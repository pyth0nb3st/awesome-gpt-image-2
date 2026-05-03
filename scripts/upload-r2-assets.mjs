import { createHash, createHmac } from "node:crypto";
import { access, readFile, readdir, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { spawnSync } from "node:child_process";

const bucket = process.env.GPTIMG_R2_BUCKET;
const assetRoot = process.env.GPTIMG_R2_ASSET_ROOT ?? "assets";
const cacheControl = process.env.GPTIMG_R2_CACHE_CONTROL ?? "public, max-age=31536000, immutable";
const s3Endpoint = process.env.R2_S3_ENDPOINT;
const s3AccessKeyId = process.env.R2_ACCESS_KEY_ID ?? process.env.AWS_ACCESS_KEY_ID;
const s3SecretAccessKey = process.env.R2_SECRET_ACCESS_KEY ?? process.env.AWS_SECRET_ACCESS_KEY;
const roots = ["assets/images", "assets/thumbs"];

if (!bucket) {
  throw new Error("Missing GPTIMG_R2_BUCKET. Example: GPTIMG_R2_BUCKET=gptimg2-assets npm run upload:r2-assets");
}

const contentTypes = new Map([
  [".avif", "image/avif"],
  [".gif", "image/gif"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".png", "image/png"],
  [".webp", "image/webp"],
]);

const walk = async (directory, results = []) => {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(path, results);
    } else if (entry.isFile()) {
      results.push(path);
    }
  }
  return results;
};

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

const objectKey = (filePath) => relative(assetRoot, filePath).replaceAll("\\", "/");

const hashHex = (value) => createHash("sha256").update(value).digest("hex");
const hmac = (key, value, encoding) => createHmac("sha256", key).update(value).digest(encoding);
const encodeKey = (key) => key.split("/").map(encodeURIComponent).join("/");

const s3SigningKey = (date) => {
  const kDate = hmac(`AWS4${s3SecretAccessKey}`, date);
  const kRegion = hmac(kDate, "auto");
  const kService = hmac(kRegion, "s3");
  return hmac(kService, "aws4_request");
};

const putS3Object = async (filePath) => {
  const key = objectKey(filePath);
  const body = await readFile(filePath);
  const contentType = contentTypes.get(extname(filePath).toLowerCase()) ?? "application/octet-stream";
  const endpoint = s3Endpoint.replace(/\/+$/, "");
  const url = new URL(`${endpoint}/${bucket}/${encodeKey(key)}`);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const shortDate = amzDate.slice(0, 8);
  const payloadHash = hashHex(body);
  const signedHeaders = "cache-control;content-type;host;x-amz-content-sha256;x-amz-date";
  const canonicalHeaders = [
    `cache-control:${cacheControl}`,
    `content-type:${contentType}`,
    `host:${url.host}`,
    `x-amz-content-sha256:${payloadHash}`,
    `x-amz-date:${amzDate}`,
    "",
  ].join("\n");
  const canonicalRequest = ["PUT", url.pathname, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
  const scope = `${shortDate}/auto/s3/aws4_request`;
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, hashHex(canonicalRequest)].join("\n");
  const signature = hmac(s3SigningKey(shortDate), stringToSign, "hex");

  const response = await fetch(url, {
    method: "PUT",
    body,
    headers: {
      Authorization: `AWS4-HMAC-SHA256 Credential=${s3AccessKeyId}/${scope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
      "Cache-Control": cacheControl,
      "Content-Type": contentType,
      "x-amz-content-sha256": payloadHash,
      "x-amz-date": amzDate,
    },
  });

  if (!response.ok) {
    throw new Error(`S3 upload failed for ${key}: ${response.status} ${response.statusText}\n${await response.text()}`);
  }

  return key;
};

const putWranglerObject = (filePath) => {
  const key = objectKey(filePath);
  const contentType = contentTypes.get(extname(filePath).toLowerCase()) ?? "application/octet-stream";
  const args = [
    "r2",
    "object",
    "put",
    `${bucket}/${key}`,
    "--file",
    filePath,
    "--content-type",
    contentType,
    "--cache-control",
    cacheControl,
    "--remote",
  ];
  const result = spawnSync("wrangler", args, {
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.status !== 0) {
    throw new Error(`wrangler ${args.join(" ")} failed\n${result.stdout}\n${result.stderr}`);
  }

  return key;
};

const putObject = (filePath) =>
  s3Endpoint && s3AccessKeyId && s3SecretAccessKey ? putS3Object(filePath) : putWranglerObject(filePath);

const files = [];
for (const root of roots) {
  if (!(await exists(root))) {
    continue;
  }
  files.push(...(await walk(root)));
}

if (files.length === 0) {
  console.log("No local asset files found under assets/images or assets/thumbs; nothing to upload.");
  process.exit(0);
}

let uploaded = 0;
let bytes = 0;

for (const filePath of files) {
  const fileStat = await stat(filePath);
  const key = await putObject(filePath);
  uploaded += 1;
  bytes += fileStat.size;
  console.log(`Uploaded ${key}`);
}

console.log(`Uploaded ${uploaded} R2 object(s), ${(bytes / 1024 / 1024).toFixed(1)} MiB total.`);

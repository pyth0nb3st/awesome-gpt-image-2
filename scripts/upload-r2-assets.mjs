import { readdir, stat } from "node:fs/promises";
import { extname, join, relative } from "node:path";
import { spawnSync } from "node:child_process";

const bucket = process.env.GPTIMG_R2_BUCKET;
const assetRoot = process.env.GPTIMG_R2_ASSET_ROOT ?? "assets";
const cacheControl = process.env.GPTIMG_R2_CACHE_CONTROL ?? "public, max-age=31536000, immutable";
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

const objectKey = (filePath) => relative(assetRoot, filePath).replaceAll("\\", "/");

const putObject = (filePath) => {
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

const files = [];
for (const root of roots) {
  files.push(...(await walk(root)));
}

let uploaded = 0;
let bytes = 0;

for (const filePath of files) {
  const fileStat = await stat(filePath);
  const key = putObject(filePath);
  uploaded += 1;
  bytes += fileStat.size;
  console.log(`Uploaded ${key}`);
}

console.log(`Uploaded ${uploaded} R2 object(s), ${(bytes / 1024 / 1024).toFixed(1)} MiB total.`);

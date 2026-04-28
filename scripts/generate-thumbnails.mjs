import { access, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const THUMB_WIDTH = 768;
const THUMB_QUALITY = 6;
const imageDirectory = "assets/images";
const thumbDirectory = "assets/thumbs";
const manifestPath = path.join(thumbDirectory, "manifest.json");
const preserveRemoteManifestEntries = Boolean(process.env.NEXT_PUBLIC_GPTIMG_ASSET_BASE_URL);

const exists = async (filePath) => {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
};

const readExistingManifest = async () => {
  try {
    return JSON.parse(await readFile(manifestPath, "utf8"));
  } catch {
    return { images: {} };
  }
};

const hasFfmpeg = () => spawnSync("ffmpeg", ["-version"], { stdio: "ignore" }).status === 0;

const runFfmpeg = (inputPath, outputPath) =>
  new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      inputPath,
      "-vf",
      `scale=${THUMB_WIDTH}:-2:force_original_aspect_ratio=decrease`,
      "-q:v",
      String(THUMB_QUALITY),
      outputPath,
    ]);

    let stderr = "";
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(stderr.trim() || `ffmpeg exited with code ${code}`));
      }
    });
  });

const thumbDimensions = (image) => {
  const width = Math.min(THUMB_WIDTH, image.width);
  const rawHeight = (image.height * width) / image.width;
  const height = Math.max(2, Math.round(rawHeight / 2) * 2);
  return { width, height };
};

const data = JSON.parse(await readFile("gallery.json", "utf8"));
const existingManifest = await readExistingManifest();
const ffmpegAvailable = hasFfmpeg();
let generated = 0;
let missing = 0;

await mkdir(thumbDirectory, { recursive: true });

for (const image of data.images) {
  const sourcePath = image.path;
  const inputPath = path.join(imageDirectory, path.basename(sourcePath));
  const outputPath = path.join(thumbDirectory, `${path.basename(sourcePath, path.extname(sourcePath))}.jpg`);

  if (!(await exists(inputPath))) {
    missing += 1;
    continue;
  }

  const [inputStat, outputExists] = await Promise.all([stat(inputPath), exists(outputPath)]);
  if (outputExists) {
    const outputStat = await stat(outputPath);
    if (outputStat.mtimeMs >= inputStat.mtimeMs) {
      continue;
    }
  }

  if (!ffmpegAvailable) {
    missing += 1;
    continue;
  }

  await runFfmpeg(inputPath, outputPath);
  generated += 1;
}

const thumbs = preserveRemoteManifestEntries ? { ...(existingManifest.images ?? {}) } : {};
for (const image of data.images) {
  const sourcePath = image.path;
  const outputPath = path.join(thumbDirectory, `${path.basename(sourcePath, path.extname(sourcePath))}.jpg`);
  if (!(await exists(outputPath))) continue;

  thumbs[sourcePath] = {
    path: outputPath,
    ...thumbDimensions(image),
  };
}

await writeFile(
  manifestPath,
  `${JSON.stringify(
    {
      version: 1,
      sourceWidth: THUMB_WIDTH,
      format: "jpg",
      images: thumbs,
    },
    null,
    2,
  )}\n`,
);

const count = Object.keys(thumbs).length;
console.log(`Prepared ${count} gallery thumbnails${generated ? ` (${generated} generated)` : ""}${missing ? `; ${missing} missing` : ""}.`);

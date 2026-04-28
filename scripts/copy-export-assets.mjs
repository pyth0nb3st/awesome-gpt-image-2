import { access, cp, mkdir, copyFile } from "node:fs/promises";

const exists = async (path) => {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
};

await mkdir("out", { recursive: true });

if (process.env.NEXT_PUBLIC_GPTIMG_ASSET_BASE_URL) {
  console.log("Skipping gallery asset copy because NEXT_PUBLIC_GPTIMG_ASSET_BASE_URL is set.");
} else {
  await cp("assets", "out/assets", { recursive: true });
}

for (const file of ["CNAME", ".nojekyll", "gallery.json"]) {
  if (await exists(file)) {
    await copyFile(file, `out/${file}`);
  }
}

console.log("Copied static assets into out/.");

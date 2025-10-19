import fs from "fs";
import path from "path";

export async function loadTimelinesServer() {
  // Path to your data directory
  const dataDir = path.join(process.cwd(), "src/app/(main)/timeline/data");

  const files = fs.readdirSync(dataDir);
  const timelines: Record<string, any> = {};

  for (const file of files) {
    if (file.startsWith("timeline_") && file.endsWith(".json")) {
      const countryName = file.replace("timeline_", "").replace(".json", "");
      const filePath = path.join(dataDir, file);

      try {
        const content = fs.readFileSync(filePath, "utf8");
        timelines[countryName] = JSON.parse(content);
      } catch (err) {
        console.error(`Failed to load timeline for ${countryName}:`, err);
      }
    }
  }

  return timelines;
}

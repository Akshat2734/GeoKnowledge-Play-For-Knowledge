// validate-json.js
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "./data");

const files = fs.readdirSync(dataDir).filter(
  (f) => f.startsWith("timeline_") && f.endsWith(".json")
);

for (const file of files) {
  const filePath = path.join(dataDir, file);
  const content = fs.readFileSync(filePath, "utf8");

  try {
    JSON.parse(content);
    console.log(`✅ ${file} is valid JSON`);
  } catch (err) {
    console.error(`\n❌ Invalid JSON in ${file}: ${err.message}`);

    // Try to extract a readable error location
    const match = err.message.match(/position (\d+)/);
    if (match) {
      const pos = parseInt(match[1], 10);
      const before = content.slice(Math.max(0, pos - 40), pos);
      const after = content.slice(pos, pos + 40);
      console.error(
        `  → Around position ${pos}:\n\n  ${before}🔴${after}\n`
      );

      // Try to compute line/column roughly
      const untilPos = content.slice(0, pos);
      const lines = untilPos.split("\n");
      console.error(
        `  Line ${lines.length}, Column ${lines[lines.length - 1].length + 1}\n`
      );
    }
  }
}

import fs from "fs";
import path from "path";

// Path to the folder containing your JSON files
const folderPath = "./data"; // change this to your folder name

function cleanJsonFiles(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);

    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // If it's a folder, recurse
      cleanJsonFiles(filePath);
    } else if (file.endsWith(".json")) {
      let content = fs.readFileSync(filePath, "utf-8");

      // Remove \r and \n characters globally
      content = content.replace(/\\r\\n/g, ""); // Remove escaped \r\n (inside strings)
      content = content.replace(/\r?\n/g, "");  // Remove actual newlines
      content = content.replace(/\s{2,}/g, " "); // Optional: collapse excessive spaces

      // Optionally, prettify JSON again
      try {
        const json = JSON.parse(content);
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
        console.log(`✅ Cleaned: ${filePath}`);
      } catch (err) {
        console.error(`❌ Error in ${filePath}: Invalid JSON format.`);
      }
    }
  }
}

// Run
cleanJsonFiles(folderPath);
console.log("🎉 Cleaning completed!");

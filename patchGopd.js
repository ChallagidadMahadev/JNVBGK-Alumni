import fs from "fs";
import path from "path";

console.log("Running patchGopd.js...");

const tsconfigPath = path.resolve("node_modules", "gopd", "tsconfig.json");

if (fs.existsSync(tsconfigPath)) {
  console.log("Found gopd/tsconfig.json");
  let content = fs.readFileSync(tsconfigPath, "utf-8");
  try {
    // Remove problematic "extends" line using regex
    content = content.replace(/"extends":\s*".*?",?\s*/g, "");
    fs.writeFileSync(tsconfigPath, content, "utf-8");
    console.log("Patched gopd/tsconfig.json successfully");
  } catch (error) {
    console.error("Error patching gopd/tsconfig.json:", error.message);
  }
} else {
  console.error("gopd/tsconfig.json not found for patching");
}

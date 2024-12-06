const fs = require("fs");
const path = require("path");

const gopdPath = path.resolve(__dirname, "node_modules", "gopd", "index.js");

if (fs.existsSync(gopdPath)) {
  let content = fs.readFileSync(gopdPath, "utf-8");
  // Replace incorrect './gOPD' reference with './index.js'
  content = content.replace(`require('./gOPD')`, `require('./index.js')`);
  fs.writeFileSync(gopdPath, content, "utf-8");
  console.log("Patched gopd/index.js successfully");
} else {
  console.error("gopd/index.js not found for patching");
}

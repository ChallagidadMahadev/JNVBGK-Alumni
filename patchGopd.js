const fs = require("fs");
const path = require("path");

const gopdPath = path.resolve(__dirname, "node_modules", "gopd", "index.js");

if (fs.existsSync(gopdPath)) {
  console.log("Found gopd/index.js");
  let content = fs.readFileSync(gopdPath, "utf-8");
  if (content.includes(`require('./gOPD')`)) {
    console.log("Found problematic require statement in gopd/index.js");
    content = content.replace(`require('./gOPD')`, `require('./index.js')`);
    fs.writeFileSync(gopdPath, content, "utf-8");
    console.log("Patched gopd/index.js successfully");
  } else {
    console.log("No problematic require statement found in gopd/index.js");
  }
} else {
  console.error("gopd/index.js not found for patching");
}

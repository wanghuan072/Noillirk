const fs = require("fs");
const p = JSON.parse(fs.readFileSync("package.json"));
p.type = "module";
fs.writeFileSync("package.json", JSON.stringify(p, null, 2) + "\n");

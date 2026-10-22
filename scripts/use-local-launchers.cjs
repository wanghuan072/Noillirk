const fs = require("fs");
const packagePath = "package.json",
  pkg = JSON.parse(fs.readFileSync(packagePath));
pkg.scripts.predev = "node scripts/prepare-routes.mjs";
pkg.scripts.dev = "next dev";
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + "\n");
fs.writeFileSync(
  "scripts/start-preview.cjs",
  `const fs=require('fs');
const dir='.next-preview',standalone=dir+'/standalone';
if(!fs.existsSync(dir+'/BUILD_ID'))throw new Error('Run build:preview first');
const buildId=fs.readFileSync(dir+'/BUILD_ID','utf8').trim();
require('./local-server.cjs')({mode:'production-preview',port:4318,buildId,args:[standalone+'/server.js'],prepare(){fs.cpSync('public',standalone+'/public',{recursive:true});fs.cpSync(dir+'/static',standalone+'/'+dir+'/static',{recursive:true});}}).catch(e=>{console.error(e.message);process.exitCode=1;});
`,
);

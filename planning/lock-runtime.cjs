const fs=require('fs'),yaml=require('js-yaml');
const p=yaml.load(fs.readFileSync('project.yaml','utf8'));
p.runtime.node_version=process.version;p.runtime.rendering='Prerendered App Router; explicit isolated local draft preview';p.deployment={target:'Portable Node.js standalone server',production_output:'.next/standalone',status:'not_generated_release_gates_open'};
fs.writeFileSync('project.yaml',yaml.dump(p,{lineWidth:110}));
const map=JSON.parse(fs.readFileSync('planning/content-map.json'));
fs.writeFileSync('planning/route-registry.json',JSON.stringify({routes:map.pages.map(p=>({id:p.page_id,path:p.path,status:p.status})),previewPrefix:'/preview',publicRule:'Published records only; no main game detail alias'},null,2));

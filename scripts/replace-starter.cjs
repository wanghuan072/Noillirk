const fs = require("fs");
fs.writeFileSync(
  "app/page.tsx",
  `import { SitePage } from "@/components/SitePage";
import { isLocalPreview } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import { tdk } from "@/seo/tdk";
export const metadata=pageMetadata(tdk.home,"/",isLocalPreview);
export default function Home(){
 if(isLocalPreview)return <main className="container site-main"><h1>Local build</h1><p>Public records have not passed release checks.</p><a href="/preview">Open the isolated draft preview →</a></main>;
 return <SitePage path="/"/>;
}
`,
);
fs.writeFileSync(
  "app/layout.tsx",
  `import type { Metadata } from "next";
import { isLocalPreview } from "@/lib/site";
import "./globals.css";
export const metadata:Metadata={robots:isLocalPreview?{index:false,follow:false}:undefined,icons:{icon:"/images/icon.png"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
`,
);
fs.writeFileSync(
  "app/globals.css",
  '@import "tailwindcss";\n@import "./site.css";\n',
);

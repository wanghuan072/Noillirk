import { SitePage } from "@/components/SitePage";
import { isLocalPreview } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";
import { tdk } from "@/seo/tdk";
export const metadata = pageMetadata(tdk.home, "/", isLocalPreview);
export default function Home() {
  return <SitePage path="/" preview={isLocalPreview} />;
}

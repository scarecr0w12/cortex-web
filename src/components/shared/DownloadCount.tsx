import { Download } from "lucide-react";
import { formatNumber } from "@/lib/utils";

export function DownloadCount({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-[#9090a8]">
      <Download className="w-3.5 h-3.5" />
      {formatNumber(count)}
    </span>
  );
}

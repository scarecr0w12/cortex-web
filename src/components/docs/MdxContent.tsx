import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MdxContentProps {
  content: string;
}

export function MdxContent({ content }: MdxContentProps) {
  return (
    <div className="prose prose-invert max-w-none prose-headings:text-[#e2e2ea] prose-p:text-[#9090a8] prose-a:text-indigo-400 prose-strong:text-[#e2e2ea] prose-code:text-[#e2e2ea] prose-pre:bg-[#111118] prose-pre:border prose-pre:border-[rgba(255,255,255,0.07)] prose-pre:rounded-xl prose-code:before:content-none prose-code:after:content-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

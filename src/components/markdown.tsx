import ReactMarkdown from "react-markdown";

interface Props {
  children: React.ReactNode;
}

export function Markdown({
  children,
  ...props
}: React.ComponentProps<typeof ReactMarkdown> & Props) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-medium mb-6" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-medium mb-6" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg font-medium mb-6" {...props} />
        ),
        h4: ({ node, ...props }) => (
          <h4 className="text-base font-medium mb-6" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="mb-6 leading-relaxed" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-6 mb-6" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-6 mb-6" {...props} />
        ),
        li: ({ node, ...props }) => <li className="mb-2" {...props} />,
        strong: ({ node, ...props }) => (
          <strong className="font-semibold" {...props} />
        ),
        code: ({ node, ...props }) => (
          <code className="bg-gray-100 p-1 rounded" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote className="border-l-4 pl-4 italic my-4" {...props} />
        ),
      }}
      {...props}
    >
      {children as string}
    </ReactMarkdown>
  );
}

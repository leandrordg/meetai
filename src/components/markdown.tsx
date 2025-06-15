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
        h1: (props) => <h1 className="text-2xl font-medium mb-6" {...props} />,
        h2: (props) => <h2 className="text-xl font-medium mb-6" {...props} />,
        h3: (props) => <h3 className="text-lg font-medium mb-6" {...props} />,
        h4: (props) => <h4 className="text-base font-medium mb-6" {...props} />,
        p: (props) => <p className="mb-6 leading-relaxed" {...props} />,
        ul: (props) => <ul className="list-disc pl-6 mb-6" {...props} />,
        ol: (props) => <ol className="list-decimal pl-6 mb-6" {...props} />,
        li: (props) => <li className="mb-2" {...props} />,
        strong: (props) => <strong className="font-semibold" {...props} />,
        code: (props) => (
          <code className="bg-gray-100 p-1 rounded" {...props} />
        ),
        blockquote: (props) => (
          <blockquote className="border-l-4 pl-4 italic my-4" {...props} />
        ),
      }}
      {...props}
    >
      {children as string}
    </ReactMarkdown>
  );
}

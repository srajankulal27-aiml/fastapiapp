import React from "react";

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  // Inline styling / replacements for bold (**text**)
  const parseInlineStyles = (text: string): React.ReactNode[] => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index} style={{ color: "var(--text-main)" }}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let listKey = 0;

  const flushList = () => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`list-${listKey++}`} style={{ paddingLeft: "24px", margin: "12px 0", listStyleType: "disc" }}>
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (trimmedLine.startsWith("####")) {
      flushList();
      elements.push(
        <h5 key={index} style={{ fontSize: "1.05rem", fontWeight: "700", margin: "14px 0 6px 0", textAlign: "left" }}>
          {parseInlineStyles(trimmedLine.replace(/^####\s*/, ""))}
        </h5>
      );
    } else if (trimmedLine.startsWith("###")) {
      flushList();
      elements.push(
        <h4 key={index} style={{ fontSize: "1.15rem", fontWeight: "700", margin: "16px 0 8px 0", textAlign: "left" }}>
          {parseInlineStyles(trimmedLine.replace(/^###\s*/, ""))}
        </h4>
      );
    } else if (trimmedLine.startsWith("##")) {
      flushList();
      elements.push(
        <h3 key={index} style={{ fontSize: "1.3rem", fontWeight: "700", margin: "18px 0 10px 0", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px", textAlign: "left" }}>
          {parseInlineStyles(trimmedLine.replace(/^##\s*/, ""))}
        </h3>
      );
    } else if (trimmedLine.startsWith("#")) {
      flushList();
      elements.push(
        <h2 key={index} style={{ fontSize: "1.5rem", fontWeight: "800", margin: "20px 0 12px 0", textAlign: "left" }}>
          {parseInlineStyles(trimmedLine.replace(/^#\s*/, ""))}
        </h2>
      );
    } else if (trimmedLine.startsWith("-") || trimmedLine.startsWith("*")) {
      const itemText = trimmedLine.replace(/^[-*]\s*/, "");
      currentList.push(
        <li key={index} style={{ marginBottom: "6px", lineHeight: "1.6", textAlign: "left" }}>
          {parseInlineStyles(itemText)}
        </li>
      );
    } else if (/^\d+\.\s*/.test(trimmedLine)) {
      const itemText = trimmedLine.replace(/^\d+\.\s*/, "");
      currentList.push(
        <li key={index} style={{ marginBottom: "6px", lineHeight: "1.6", textAlign: "left" }}>
          {parseInlineStyles(itemText)}
        </li>
      );
    } else if (trimmedLine === "") {
      flushList();
    } else {
      flushList();
      elements.push(
        <p key={index} style={{ margin: "10px 0", lineHeight: "1.6", textAlign: "left" }}>
          {parseInlineStyles(trimmedLine)}
        </p>
      );
    }
  });

  flushList();

  return <div className="markdown-content">{elements}</div>;
}

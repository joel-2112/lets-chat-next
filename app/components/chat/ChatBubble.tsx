import { ReactNode } from "react";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  avatar?: string;
}

export function ChatBubble({ role, content, timestamp, avatar }: ChatBubbleProps) {
  const isUser = role === "user";

  const renderContent = (text: string) => {
    // Split into lines for processing
    const lines = text.split("\n").map((line, index) => {
      // Code block detection (```text``` or common code patterns)
      if (
        line.startsWith("```") && line.endsWith("```") ||
        line.match(/^\s*(function|const|let|var|class|if|for|while|return|\{|\}|\()/)
      ) {
        const code = line.startsWith("```") ? line.slice(3, -3) : line;
        return (
          <pre
            key={index}
            className="bg-gray-100 dark:bg-gray-900 p-2 rounded-md text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto"
          >
            <code>{code}</code>
          </pre>
        );
      }

      // Process bold (**text**) and italics (*text*) with Tailwind
      let formattedLine = line;
      formattedLine = formattedLine.replace(/\*\*(.*?)\*\*/g, (_, match) => `<span class="font-bold">${match}</span>`);
      formattedLine = formattedLine.replace(/\*(.*?)\*/g, (_, match) => `<span class="italic">${match}</span>`);

      // Blue highlights for assistant keywords
      if (!isUser) {
        const keywords = ["code", "example", "important", "note", "key"];
        keywords.forEach((word) => {
          const regex = new RegExp(`\\b${word}\\b`, "gi");
          formattedLine = formattedLine.replace(regex, `<span class="text-blue-500 font-semibold">${word}</span>`);
        });
      }

      return (
        <p
          key={index}
          className="text-sm md:text-base leading-relaxed"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
    });
    return lines;
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4 items-start`}>
      {!isUser && avatar && (
        <img
          src={avatar}
          alt="Assistant Avatar"
          className="w-8 h-8 rounded-full mr-2 mt-1 border border-gray-300 dark:border-gray-600"
        />
      )}
      <div
        className={`max-w-[70%] p-4 rounded-lg shadow-md transition-all duration-200 chat-bubble ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
        }`}
      >
        <div>{renderContent(content)}</div>
        {timestamp && (
          <span
            className={`text-xs mt-1 block text-right ${
              isUser ? "text-blue-200" : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {timestamp}
          </span>
        )}
      </div>
      {isUser && avatar && (
        <img
          src={avatar}
          alt="User Avatar"
          className="w-8 h-8 rounded-full ml-2 mt-1 border border-gray-300 dark:border-gray-600"
        />
      )}
    </div>
  );
}
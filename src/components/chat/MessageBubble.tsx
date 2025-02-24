interface MessageBubbleProps {
  message: string;
  isUser?: boolean;
  files?: File[];
}

const MessageBubble = ({
  message,
  isUser = false,
  files,
}: MessageBubbleProps) => {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${isUser ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-900"}`}
      >
        <div>{message}</div>
        {files && files.length > 0 && (
          <div className="mt-2 space-y-1">
            {files.map((file, index) => (
              <div
                key={index}
                className="text-xs font-mono bg-white/80 rounded px-2 py-1"
              >
                {file.name} ({(file.size / 1024).toFixed(1)}KB)
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;

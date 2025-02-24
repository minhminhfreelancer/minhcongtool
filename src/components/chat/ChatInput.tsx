import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, Image, Send } from "lucide-react";
import { useState, useRef, ClipboardEvent, ChangeEvent } from "react";

interface ChatInputProps {
  onSend: (message: string, files?: File[]) => void;
}

const ChatInput = ({ onSend }: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage("");
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    const files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf("image") !== -1) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }

    if (files.length > 0) {
      onSend(message, files);
      setMessage("");
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onSend(message, files);
      setMessage("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex gap-2 p-4 bg-white">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*,.pdf,.doc,.docx,.txt"
        multiple
        className="hidden"
      />
      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="h-10 w-10 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
        >
          <FileUp className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="h-10 w-10 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
        >
          <Image className="h-4 w-4" />
        </Button>
      </div>
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onPaste={handlePaste}
        placeholder="Type your message... (Paste images or attach files)"
        className="min-h-[60px] bg-white border-slate-200 text-slate-900 placeholder:text-slate-500"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
          }
        }}
      />
      <Button
        onClick={handleSend}
        size="icon"
        className="h-10 w-10 bg-blue-600 hover:bg-blue-700 text-white"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default ChatInput;

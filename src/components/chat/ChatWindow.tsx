import { useState, useEffect } from "react";
import SearchHeader from "./SearchHeader";
import SearchResults from "./SearchResults";
import { SearchResult } from "@/types/search";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import ChatHeader from "./ChatHeader";
import {
  searchGoogle,
  fetchPageContent,
  htmlToMarkdown,
  downloadTextFile,
} from "@/lib/search";
import { StoredApiKey, loadApiKeys } from "@/lib/storage";
import {
  ChatMessage,
  sendMessageToGemini,
  getActiveApiKey,
} from "@/lib/gemini";
import { SearchCredentials } from "@/lib/searchConfig";

const ChatWindow = () => {
  const [mode, setMode] = useState<"search" | "chat">("search");
  const [apiKeys, setApiKeys] = useState<StoredApiKey[]>([]);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const savedKeys = await loadApiKeys();
        if (savedKeys.length > 0) {
          setApiKeys(savedKeys);
        }
      } catch (error) {
        console.error("Error loading API keys:", error);
      }
    };
    
    fetchApiKeys();
  }, []);
  const [selectedModel, setSelectedModel] = useState("gemini-1.0-pro");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("us");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [config, setConfig] = useState<SearchCredentials | null>(null);

  const handleSearch = async () => {
    if (!keyword.trim()) return;

    if (!config) {
      alert("Please configure your Google Search API credentials first");
      return;
    }

    setIsLoading(true);
    try {
      // Search Google
      const results = await searchGoogle(
        keyword,
        selectedCountry,
        config.apiKey,
        config.searchEngineId,
      );

      // Fetch and process content for each result
      const processedResults = await Promise.all(
        results.map(async (result) => {
          try {
            const htmlContent = await fetchPageContent(result.url);
            const markdownContent = htmlContent ? htmlToMarkdown(htmlContent) : "";
            return {
              ...result,
              htmlContent,
              markdownContent,
              error: undefined
            };
          } catch (error) {
            return {
              ...result,
              htmlContent: "",
              markdownContent: "",
              error: error instanceof Error ? error.message : "Unknown error"
            };
          }
        }),
      );

      setSearchResults(processedResults);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (searchResults.length === 0) return;

    const content = searchResults
      .map(
        (result) =>
          `# ${result.title}\n\nSource: ${result.url}\n\n${result.markdownContent}\n\n---\n`,
      )
      .join("\n");

    downloadTextFile(`${keyword.replace(/\s+/g, "-")}.txt`, content);
  };

  const handleNextStep = () => {
    if (searchResults.length === 0) return;

    const activeKey = getActiveApiKey(apiKeys);
    if (!activeKey) {
      alert("Please add and select a Gemini API key first");
      return;
    }

    const content = searchResults
      .map(
        (result) =>
          `# ${result.title}\n\nSource: ${result.url}\n\n${result.markdownContent}\n\n---\n`,
      )
      .join("\n");

    const prompt = `Đây là nội dung nghiên cứu từ các bài viết về ${keyword}:\n\n${content}\n\nHãy phân tích và cung cấp:\n\nCấu trúc chung các bài viết\nCác section chính và phụ\nKey points được đề cập\nGóc nhìn độc đáo từng bài\nĐiểm mạnh/yếu mỗi bài\nCơ hội tạo giá trị khác biệt`;

    setMode("chat");
    // Auto send the prompt
    handleSend(prompt);
  };

  const handleSend = async (message: string, files?: File[]) => {
    const activeKey = getActiveApiKey(apiKeys);
    if (!activeKey) {
      alert("Please add and select a Gemini API key first");
      return;
    }

    setMessages((prev) => [...prev, { content: message, role: "user", files }]);
    setIsProcessing(true);

    try {
      const response = await sendMessageToGemini(
        message,
        activeKey,
        selectedModel,
      );
      setMessages((prev) => [
        ...prev,
        { content: response, role: "assistant" },
      ]);
    } catch (error) {
      console.error("Failed to get response:", error);
      setMessages((prev) => [
        ...prev,
        {
          content:
            "Sorry, there was an error processing your request. Please try again.",
          role: "assistant",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white text-slate-900">
      <div className="flex flex-col gap-4 p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Content Research Assistant</h2>
        </div>
        <p className="text-sm text-slate-500">
          Search and analyze content from different regions to help with your
          writing
        </p>
        <SearchHeader
          keyword={keyword}
          onKeywordChange={setKeyword}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
          onSearch={handleSearch}
          onConfigChange={setConfig}
        />
      </div>

      <div className="flex-1 overflow-auto p-4">
        {mode === "search" ? (
          <SearchResults
            results={searchResults}
            onDownload={handleDownload}
            onNextStep={handleNextStep}
            isLoading={isLoading}
          />
        ) : (
          <div className="flex flex-col h-full">
            <ChatHeader
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
              apiKeys={apiKeys}
              onApiKeysChange={setApiKeys}
            />
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <MessageBubble
                  key={index}
                  message={msg.content}
                  isUser={msg.role === "user"}
                  files={msg.files}
                />
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-500 rounded-lg px-4 py-2">
                    Processing...
                  </div>
                </div>
              )}
            </div>
            <ChatInput onSend={handleSend} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;

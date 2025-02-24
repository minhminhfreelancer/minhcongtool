import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { HelpCircle } from "lucide-react";

export const ConfigGuide = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Hướng dẫn cấu hình Google Search API</DialogTitle>
          <DialogDescription>
            Làm theo các bước sau để thiết lập Google Search API cho ứng dụng
          </DialogDescription>
        </DialogHeader>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="step1">
            <AccordionTrigger>
              1. Tạo Google Custom Search Engine
            </AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p>
                1. Truy cập{" "}
                <a
                  href="https://programmablesearchengine.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Programmable Search Engine
                </a>
              </p>
              <p>2. Nhấn "Create a new search engine"</p>
              <p>3. Điền thông tin:</p>
              <ul className="list-disc pl-6 space-y-1">
                - Tên cho search engine - Chọn "Search the entire web" - Enable
                "Search the entire web" option
              </ul>
              <p>
                4. Sau khi tạo xong, vào Edit search engine để lấy Search Engine
                ID (cx)
              </p>
              <p className="text-sm text-slate-500">
                Search Engine ID có dạng: 123456789:abcdefghijk
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="step2">
            <AccordionTrigger>2. Tạo Google Cloud Project</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p>
                1. Truy cập{" "}
                <a
                  href="https://console.cloud.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google Cloud Console
                </a>
              </p>
              <p>2. Tạo project mới hoặc chọn project có sẵn</p>
              <p>3. Enable Custom Search API:</p>
              <ul className="list-disc pl-6 space-y-1">
                - Tìm "Custom Search API" trong API Library - Click "Enable"
              </ul>
              <p>4. Tạo API Key:</p>
              <ul className="list-disc pl-6 space-y-1">
                - Vào mục "Credentials" - Click "Create Credentials" → "API Key"
                - Copy API Key được tạo
              </ul>
              <p className="text-sm text-slate-500">
                API Key có dạng: AIzaSyB...XYZ
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="step3">
            <AccordionTrigger>3. Cấu hình trong ứng dụng</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <p>1. Tạo file .env.local trong thư mục gốc của project</p>
              <p>2. Thêm các biến môi trường:</p>
              <pre className="bg-slate-100 p-2 rounded text-sm">
                VITE_GOOGLE_API_KEY=your_api_key_here
                VITE_GOOGLE_CX=your_search_engine_id_here
              </pre>
              <p>3. Restart development server để áp dụng thay đổi</p>
              <p className="text-amber-600">Lưu ý về giới hạn API:</p>
              <ul className="list-disc pl-6 space-y-1 text-sm">
                - Free tier: 100 queries/ngày - Paid tier: $5 per 1000 queries
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </DialogContent>
    </Dialog>
  );
};

export default ConfigGuide;

import { Suspense } from "react";
import { Routes, Route, useRoutes } from "react-router-dom";
import ContentWizard from "./components/content/ContentWizard";

// Khai báo tạm thời nếu không tìm thấy tempo-routes
const defaultRoutes = [];

function App() {
  // Xử lý tham số truy vấn framework
  const urlParams = new URLSearchParams(window.location.search);
  const framework = urlParams.get("framework");

  // Chỉ sử dụng tempoRoutes nếu VITE_TEMPO là true và tempo-routes tồn tại
  let tempoRoutes = null;
  try {
    const routes = require("tempo-routes").default || defaultRoutes;
    tempoRoutes =
      import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;
  } catch (error) {
    console.warn("Không thể tải tempo-routes, sử dụng định tuyến mặc định.");
  }

  if (tempoRoutes) {
    return tempoRoutes;
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<ContentWizard />} />
        <Route path="*" element={<ContentWizard />} />
      </Routes>
    </Suspense>
  );
}

export default App;

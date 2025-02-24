import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import ContentWizard from "./components/content/ContentWizard";
import routes from "tempo-routes";

function App() {
  // Handle Tempo routes
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  if (tempoRoutes) {
    return tempoRoutes;
  }

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Routes>
        <Route path="/" element={<ContentWizard />} />
        {/* Add Tempo route before catch-all */}
        {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
        <Route path="*" element={<ContentWizard />} />
      </Routes>
    </Suspense>
  );
}

export default App;

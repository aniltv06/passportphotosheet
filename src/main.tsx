
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import ErrorBoundary from "./components/ErrorBoundary.tsx";
  import "./utils/errorHandler"; // Initialize global error handler
  import "./index.css";

  createRoot(document.getElementById("root")!).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );

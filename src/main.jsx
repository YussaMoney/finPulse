import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        duration: 3000,
        className: "finpulse-toast",
        style: {
          background: "transparent",
          color: "var(--text-main, #f8fafc)",
          border: "none",
          boxShadow: "none",
          padding: 0,
          fontSize: "14px",
          fontWeight: 500,
        },
        success: {
          iconTheme: {
            primary: "#22c55e",
            secondary: "#fff",
          },
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },
      }}
    />
    <App />
  </StrictMode>,
);

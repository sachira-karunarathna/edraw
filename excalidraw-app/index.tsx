import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import "./index.css";
import "../excalidraw-app/sentry";
import AppNav from "./nav/AppNav";
import { AuthProvider as SupabaseAuthProvider } from "./contexts/AuthContext";

window.__EXCALIDRAW_SHA__ = import.meta.env.VITE_APP_GIT_SHA;
const rootElement = document.getElementById("root")!;
const root = createRoot(rootElement);
registerSW();

root.render(
  <StrictMode>
    <SupabaseAuthProvider>
      <AppNav />
    </SupabaseAuthProvider>
  </StrictMode>,
);

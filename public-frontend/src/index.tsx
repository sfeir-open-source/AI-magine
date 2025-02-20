import { App } from "@/src/app";
import React from "react";
import { createRoot } from "react-dom/client";
import '@/src/globals.css';

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");
createRoot(rootElement).render(<App />);

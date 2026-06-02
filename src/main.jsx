import React from "react";
import ReactDOM from "react-dom/client";
import ComparativeLawRevision from "./ComparativeLawRevision.jsx";

const rootStyle = document.createElement("style");
rootStyle.textContent = `
  html, body, #root { margin: 0; padding: 0; min-height: 100%; }
  body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
`;
document.head.appendChild(rootStyle);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ComparativeLawRevision />
  </React.StrictMode>
);

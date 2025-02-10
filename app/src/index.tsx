import React from "react";
import { createRoot } from "react-dom/client"; // Correct import
import App from "./App"; 
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import store from "./redux/store";
import { Provider } from "react-redux";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

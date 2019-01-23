import "@babel/polyfill";
import React from "react";
import { render } from "react-dom";
import App from "./modules/App";
import { AppContextProvider } from "./modules/AppContext";

const path = window.location.href.split("?")[0];
const mode = (path.endsWith("preview.html")) ? "preview" : "";
const container = document.getElementById("content");
render((
  <AppContextProvider>
    <App mode={mode} container={container} />
  </AppContextProvider>
), container);

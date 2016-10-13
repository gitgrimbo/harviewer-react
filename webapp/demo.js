import "@babel/polyfill";
import React from "react";
import { render } from "react-dom";

import HarModel from "./modules/preview/harModel";
import HarModelLoader from "./modules/preview/harModelLoader";

import DemoApp from "./modules/Demo";

function loadHar(harUrl, callback, errback) {
  harUrl = harUrl || "../examples/softwareishard.com.har";
  HarModelLoader.loadArchives([harUrl], [], null, callback);
}

window.addEventListener("load", function() {
  function renderDemo(demoName, demoProps) {
    render(
      <DemoApp demoName={demoName} demoProps={demoProps} />, document.getElementById("demo-app")
    );
  }

  function createDemoProps(har) {
    const model = new HarModel();
    model.append(har);
    const firstPage = har.log.pages[0];
    const firstPageEntries = model.getPageEntries(firstPage);
    const firstEntryOfFirstPage = firstPageEntries[0];
    return {
      model,
      input: har,
      page: firstPage,
      entries: firstPageEntries,
      entry: firstEntryOfFirstPage,
      visible: true,
    };
  }

  // eslint-disable-next-line
  const uri = URI(window.location.href);
  const params = uri.query(true);
  if (params.demo) {
    loadHar(null, (har) => renderDemo(params.demo, createDemoProps(har)));
  } else {
    renderDemo();
  }
});

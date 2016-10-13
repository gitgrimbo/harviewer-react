import React from "react";
import Perf from 'react-addons-perf';
import { render } from "react-dom";

import HarModel from "preview/harModel";
import HarModelLoader from "preview/harModelLoader";

import DemoApp from "./modules/Demo";

window.Perf = Perf;

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
    var model = new HarModel();
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
      visible: true
    };
  }

  // eslint-disable-next-line
  var uri = URI(window.location.href);
  var params = uri.query(true);
  if (params.demo) {
    loadHar(null, har => renderDemo(params.demo, createDemoProps(har)));
  } else {
    renderDemo();
  }
});

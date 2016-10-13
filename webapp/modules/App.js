import React from "react";

import HarModel from "preview/harModel";
import Loader from "preview/harModelLoader";

import homeTabStrings from "amdi18n!nls/homeTab";
import harViewerStrings from "amdi18n!nls/harViewer";
import previewTabStrings from "amdi18n!nls/previewTab";
import domTabStrings from "amdi18n!nls/domTab";

import setState from "./setState";
import buildInfo from "./buildInfo";
import InfoTipHolder from "./InfoTipHolder";
import TabView from "./tabview/TabView";
import AboutTab from "./tabs/AboutTab";
import HomeTab from "./tabs/HomeTab";
import PreviewTab from "./tabs/PreviewTab";

export default React.createClass({
  createAboutTab(harViewerExampleApp) {
    const versionStr = buildInfo.version + "/" + buildInfo.gitVersion;
    const aboutTab = {
      id: "About",
      label: harViewerStrings.aboutTabLabel,
      body: <AboutTab version={versionStr} harViewerExampleApp={harViewerExampleApp} />
    };
    aboutTab.content = (
      <div>{aboutTab.label || aboutTab.id}
        <span className="version"> {versionStr}</span>
      </div>
    );
    return aboutTab;
  },

  createTabs() {
    const { model } = this.state;

    let harViewerExampleApp = window.location.href.split("?")[0];
    if (!harViewerExampleApp.endsWith("/")) {
      harViewerExampleApp += "/";
    }

    const tabs = [
      {
        id: "Home",
        label: homeTabStrings.homeTabLabel,
        body: <HomeTab requestTabChange={tabName => setState(this, { selectedTabIdx: 3 })} />
      },
      {
        id: "Preview",
        label: previewTabStrings.previewTabLabel,
        body: <PreviewTab model={model} />
      },
      {
        id: "DOM",
        label: domTabStrings.domTabLabel
      },
      this.createAboutTab(harViewerExampleApp),
      {
        id: "Schema",
        label: harViewerStrings.schemaTabLabel
      }
    ];

    return tabs;
  },

  updatePreviewCols() {
    const content = document.getElementById("content");
    content.setAttribute("previewCols", this.state.previewCols);
  },

  getInitialState() {
    return {
      model: new HarModel(),
      previewCols: "url status size timeline",
      selectedTabIdx: 0
    };
  },

  componentDidMount() {
    this.updatePreviewCols();

    Loader.run(response => {
      const model = new HarModel();
      const har = (typeof response === "string") ? JSON.parse(response) : response;
      model.append(har);
      setState(this, {
        model,
        selectedTabIdx: 1
      });
    }, err => console.error(err));
  },

  componentWillUnmount() {
  },

  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps, prevState);
    this.updatePreviewCols();
  },

  render() {
    const { selectedTabIdx } = this.state;

    const tabs = this.createTabs();
    return (
      <InfoTipHolder>
        <TabView tabs={tabs} selectedTabIdx={selectedTabIdx} id="harView" />
      </InfoTipHolder>
    );
  }
});

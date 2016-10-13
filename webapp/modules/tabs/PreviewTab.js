import React from "react";
import { saveAs } from "file-saver";

import setState from "../setState";
import Stats from "../Stats";
import PageTimeline from "../pagetimeline/PageTimeline";
import PageTable from "../pagetable/PageTable";
import PreviewTabToolbar from "./PreviewTabToolbar";

export default React.createClass({
  displayName: "tabs/PreviewTab",

  propTypes: {
    model: React.PropTypes.object
  },

  getInitialState() {
    return {
      timelineVisible: false,
      statsVisible: false
    };
  },

  onDownloadClick(e) {
    e.preventDefault();
    const { model } = this.props;
    const json = model ? model.toJSON() : "";
    const blob = new Blob([json], { type: "text/plain;charset=" + document.characterSet });
    saveAs(blob, "netData.har");
  },

  onStatsClick(e) {
    e.preventDefault();
    setState(this, {
      statsVisible: !this.state.statsVisible
    });
  },

  onTimelineClick(e) {
    e.preventDefault();
    setState(this, {
      timelineVisible: !this.state.timelineVisible
    });
  },

  onClearClick(e) {
    e.preventDefault();
    const href = window.location.href;
    const index = href.indexOf("?");
    window.location = href.substr(0, index);
  },

  render() {
    const { model } = this.props;

    if (!model) {
      return <div></div>;
    }

    const page = null;
    const clickHandlers = {
      onStatsClick: this.onStatsClick,
      onTimelineClick: this.onTimelineClick,
      onClearClick: this.onClearClick,
      onDownloadClick: this.onDownloadClick
    };

    return (
      <div>
        <div className="previewToolbar">
          <PreviewTabToolbar model={model} { ...clickHandlers } />
        </div>
        <div className="previewTimeline">
          {this.state.timelineVisible ? <PageTimeline model={model} page={page} /> : ""}
        </div>
        <div className="previewStats">
          {this.state.statsVisible ? <Stats model={model} /> : ""}
        </div>
        <div className="previewList">
          <PageTable model={model} />
        </div>
      </div>
    );
  }
});

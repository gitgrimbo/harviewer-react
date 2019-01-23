import React, { Component } from "react";
import PropTypes from "prop-types";
import { saveAs } from "file-saver";

import AppContext from "../AppContext";
import Stats from "../Stats";
import PageTimeline from "../pagetimeline/PageTimeline";
import PreviewTabToolbar from "./PreviewTabToolbar";
import PreviewList from "./preview/PreviewList";

class PreviewTab extends Component {
  constructor(props) {
    super(props);

    this.toolbarRef = React.createRef();

    this.state = {
      timelineVisible: false,
      selectedPages: null,
      statsVisible: false,
    };
  }

  showStats() {
    this.setState(({ statsVisible }) => ({
      statsVisible: !statsVisible,
    }));
  }

  showTimeline() {
    this.setState(({ timelineVisible }) => ({
      timelineVisible: !timelineVisible,
    }));
  }

  addPageTiming(timing) {
    this.context.addPageTiming(timing);
  }

  onDownloadClick = (e) => {
    e.preventDefault();
    // TODO find out which model to copy.
    const { harModels } = this.props;
    const model = harModels[0];
    const json = model ? model.toJSON() : "";
    const blob = new Blob([json], { type: "text/plain;charset=" + document.characterSet });
    saveAs(blob, "netData.har");
  }

  onStatsClick = (e) => {
    e.preventDefault();
    this.showStats();
  }

  onTimelineClick = (e) => {
    e.preventDefault();
    this.showTimeline();
  }

  onClearClick = (e) => {
    e.preventDefault();
    const href = window.location.href;
    const index = href.indexOf("?");
    window.location = href.substr(0, index);
  }

  findPagelessEntries(har) {
    const { pages, entries } = har.log;

    let pageIds = {};
    if (pages && pages.length > 0) {
      pageIds = pages.reduce((ids, page) => {
        if (page.id) {
          ids[page.id] = 1;
        }
        return ids;
      }, {});
    } else {
      // No pages, so all entries are pageless
      return entries;
    }

    if (entries && entries.length > 0) {
      return entries.filter((e) => {
        if (!e.pageref) {
          // pageless
          return true;
        }
        // pageless if there isn't a matching page.id
        return !pageIds || !pageIds[e.pageref];
      });
    }

    return null;
  }

  getToolbar() {
    return this.toolbarRef.current;
  }

  onPageTimelinePageSelection = (selectedPages) => {
    this.setState({
      selectedPages,
    });
  }

  render() {
    const { harModels, errors } = this.props;

    if (!harModels) {
      return <div></div>;
    }

    // TODO - how to choose which model?
    const clickHandlers = {
      onStatsClick: this.onStatsClick,
      onTimelineClick: this.onTimelineClick,
      onClearClick: this.onClearClick,
      onDownloadClick: this.onDownloadClick,
    };

    // TODO - Stats currently only takes one model (harviewer does it this way)
    // harviewer-react has an array of models though

    const { selectedPages } = this.state;
    const statsEntries = selectedPages
      ? selectedPages.reduce((result, { harModel, page }) => result.concat(harModel.getPageEntries(page)), [])
      : harModels.reduce((result, harModel) => result.concat(harModel.getAllEntries()), []);

    return (
      <div>
        <div className="previewToolbar">
          <PreviewTabToolbar ref={this.toolbarRef} {...clickHandlers} />
        </div>
        <div className="previewTimeline">
          {this.state.timelineVisible ? <PageTimeline harModels={harModels} onPageSelection={this.onPageTimelinePageSelection} /> : ""}
        </div>
        <div className="previewStats">
          {this.state.statsVisible ? <Stats entries={statsEntries} /> : ""}
        </div>
        <PreviewList harModels={harModels} errors={errors} />
      </div>
    );
  }
};

PreviewTab.propTypes = {
  harModels: PropTypes.array,
  errors: PropTypes.array,
};

PreviewTab.contextType = AppContext;

export default PreviewTab;

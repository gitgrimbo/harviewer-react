import React, { Component } from "react";
import PropTypes from "prop-types";

import Toolbar, { Button } from "../toolbar/Toolbar";

class PreviewTabToolbar extends Component {
  state = {
    showButtons: ["showTimeline", "showStats", "clear", "download"],
  }

  removeButton(buttonName) {
    this.setState(({ showButtons }) => ({
      showButtons: showButtons.filter((it) => it !== buttonName),
    }));
  }

  render() {
    const {
      onStatsClick,
      onTimelineClick,
      onClearClick,
      onDownloadClick,
    } = this.props;
    const { showButtons } = this.state;

    if (showButtons.length === 0) {
      return null;
    }

    const downloadImgStyle = {
      display: "inline-block",
      width: "16px",
      height: "16px",
      background: "url(./css/images/download-sprites.png) no-repeat",
    };

    const buttons = {
      showTimeline: <Button key="timelineBtn" title="Show/hide page timeline." command={onTimelineClick}>Show Page Timeline</Button>,
      showStats: <Button key="statsBtn" title="Show/hide statistic preview for selected pages in the timeline." command={onStatsClick}>Show Statistics</Button>,
      clear: <Button key="clearBtn" title="Remove all HAR logs from the viewer" command={onClearClick}>Clear</Button>,
      download: <Button key="downloadBtn" command={onDownloadClick} title="Download all current data in one HAR file.">
        <span style={downloadImgStyle}></span>
      </Button>,
    };

    return (
      <Toolbar>
        {showButtons.map((buttonName) => buttons[buttonName])}
      </Toolbar>
    );
  }
};

PreviewTabToolbar.propTypes = {
  onStatsClick: PropTypes.func,
  onTimelineClick: PropTypes.func,
  onClearClick: PropTypes.func,
  onDownloadClick: PropTypes.func,
};

export default PreviewTabToolbar;

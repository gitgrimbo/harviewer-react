import React from "react";
import Toolbar, { Button } from "../toolbar/Toolbar";

export default React.createClass({
  displayName: "tabs/PreviewTabToolbar",

  propTypes: {
    onStatsClick: React.PropTypes.func,
    onTimelineClick: React.PropTypes.func,
    onClearClick: React.PropTypes.func,
    onDownloadClick: React.PropTypes.func
  },

  render() {
    const { onStatsClick, onTimelineClick, onClearClick, onDownloadClick } = this.props;

    const downloadImgStyle = {
      display: "inline-block",
      width: "16px",
      height: "16px",
      background: "url(./css/images/download-sprites.png) no-repeat"
    };

    return (
      <Toolbar>
        <Button key="statsBtn" title="Show/hide statistic preview for selected pages in the timeline." command={onStatsClick}>Show Statistics</Button>
        <Button key="timelineBtn" title="Show/hide page timeline." command={onTimelineClick}>Show Page Timeline</Button>
        <Button key="clearBtn" title="Remove all HAR logs from the viewer" command={onClearClick}>Clear</Button>
        <Button key="downloadBtn" command={onDownloadClick} title="Download all current data in one HAR file.">
          <span style={downloadImgStyle}></span>
        </Button>
      </Toolbar>
    );
  }
});

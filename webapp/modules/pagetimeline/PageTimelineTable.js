import React, { Component } from "react";
import PropTypes from "prop-types";

class PageTimelineTable extends Component {
  render() {
    return (
      <table cellPadding="0" cellSpacing="0" className="pageTimelineTable">
        <tbody className=" ">
          <tr className="pageTimelineRow">
            {this.props.pageTimelineCols}
          </tr>
        </tbody>
      </table>
    );
  }
}

PageTimelineTable.propTypes = {
  pageTimelineCols: PropTypes.node,
};

export default PageTimelineTable;

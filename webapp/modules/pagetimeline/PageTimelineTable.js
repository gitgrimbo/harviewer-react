import React from "react";

export default React.createClass({
  displayName: "pagetimeline/PageTimelineTable",

  propTypes: {
    pageTimelineCols: React.PropTypes.node
  },

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
});

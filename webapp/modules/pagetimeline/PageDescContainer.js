import React from "react";
import * as Lib from "core/lib";
import * as HarModel from "preview/harModel";
import Strings from "amdi18n!nls/PageTimeline";

export default React.createClass({
  displayName: "pagetimeline/PageDescContainer",

  propTypes: {
    model: React.PropTypes.object,
    page: React.PropTypes.object
  },

  render() {
    return (
      <div className="pageDescBox ">
        <div className="connector " style={{ marginLeft: '18px' }}></div>
        <div className="desc "><span className="summary ">{this.getSummary(this.props.model, this.props.page)}</span>
          <span className="time ">{this.getTime(this.props.page)}</span>
          <span className="title ">{this.getTitle(this.props.page)}</span>
          <pre className="comment ">{this.getComment(this.props.page)}</pre>
        </div>
      </div>
    );
  },

  getSummary: function(model, page) {
    var summary = "";
    var onLoad = page.pageTimings.onLoad;
    if (onLoad > 0) {
      summary += Strings.pageLoad + ": " + Lib.formatTime(onLoad) + ", ";
    }

    var requests = HarModel.getPageEntries(model.input, page);
    var count = requests.length;
    summary += count + " " + (count === 1 ? Strings.request : Strings.requests);

    return summary;
  },

  getTime: function(page) {
    var pageStart = Lib.parseISO8601(page.startedDateTime);
    var date = new Date(pageStart);
    return date.toLocaleString();
  },

  getTitle: function(page) {
    return page.title;
  },

  getComment: function(page) {
    return page.comment ? page.comment : "";
  }
});

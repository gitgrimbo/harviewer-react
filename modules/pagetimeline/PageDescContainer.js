import React, { Component } from "react";
import PropTypes from "prop-types";

import * as Date_ from "../core/date";
import * as Str from "../core/string";
import Strings from "i18n!../nls/PageTimeline";

class PageDescContainer extends Component {
  render() {
    const { page, numEntries } = this.props;
    return (
      <div className="pageDescBox ">
        <div className="connector " style={{ marginLeft: "18px" }}></div>
        <div className="desc ">
          <span className="summary ">{
            page ? this.getSummary(page, numEntries) : ""
          }</span>
          <span className="time ">{
            page ? this.getTime(this.props.page) : ""
          }</span>
          <span className="title ">{
            page ? this.getTitle(this.props.page) : ""
          }</span>
          <pre className="comment ">{
            page ? this.getComment(this.props.page) : ""
          }</pre>
        </div>
      </div>
    );
  }

  getSummary(page, numEntries) {
    let summary = "";
    const onLoad = page.pageTimings.onLoad;
    if (onLoad > 0) {
      summary += Strings.pageLoad + ": " + Str.formatTime(onLoad.toFixed(2)) + ", ";
    }

    const count = numEntries;
    summary += count + " " + (count === 1 ? Strings.request : Strings.requests);

    return summary;
  }

  getTime(page) {
    const pageStart = Date_.parseISO8601(page.startedDateTime);
    const date = new Date(pageStart);
    return date.toLocaleString();
  }

  getTitle(page) {
    return page.title;
  }

  getComment(page) {
    return page.comment ? page.comment : "";
  }
}

PageDescContainer.propTypes = {
  numEntries: PropTypes.number,
  page: PropTypes.object,
};

export default PageDescContainer;

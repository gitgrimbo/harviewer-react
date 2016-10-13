import React from "react";
import * as Url from "core/url";
import * as Str from "core/string";
import Bar from "./Bar";
import PageTimingBar from "./PageTimingBar";

const NetRow = React.createClass({
  displayName: "nettable/NetRow",

  propTypes: {
    entry: React.PropTypes.object,
    entryId: React.PropTypes.number,
    opened: React.PropTypes.bool,
    bars: React.PropTypes.array,
    pageTimingBars: React.PropTypes.array,
    onClick: React.PropTypes.func
  },

  getHref(entry) {
    var fileName = Url.getFileName(this.getFullHref(entry));
    return unescape(entry.request.method + " " + fileName);
  },

  getFullHref(entry) {
    return unescape(entry.request.url);
  },

  getStatus(entry) {
    var status = entry.response.status > 0 ? (entry.response.status + " ") : "";
    return status + entry.response.statusText;
  },

  getType(entry) {
    return entry.response.content.mimeType;
  },

  getDomain(entry) {
    return Url.getPrettyDomain(entry.request.url);
  },

  getSize(entry) {
    var bodySize = entry.response.bodySize;
    var size = (bodySize && bodySize !== -1) ? bodySize : entry.response.content.size;

    return this.formatSize(size);
  },

  formatSize(bytes) {
    return Str.formatSize(bytes);
  },

  shouldComponentUpdate(nextProps, nextState) {
    const { entry, entryId, opened, bars, pageTimingBars } = this.props;
    // TODO - Very basic, needs improving
    return !(
      entry === nextProps.entry &&
      entryId === nextProps.entryId &&
      opened === nextProps.opened &&
      bars.length === nextProps.bars.length &&
      pageTimingBars.length === nextProps.pageTimingBars.length
    );
  },

  render() {
    let { entry, entryId, opened, bars, pageTimingBars, onClick } = this.props;

    bars = (bars || []).map((bar, i) => <Bar key={"Entry" + entryId + "Bar" + i} bar={bar} />);
    pageTimingBars = (pageTimingBars || []).map((pageTimingBar, i) =>
      <PageTimingBar key={"Entry" + entryId + "PageTimingBar" + i} { ...pageTimingBar } />
    );

    return (
      <tr className={"netRow loaded isExpandable" + (opened ? " opened" : "")} onClick={onClick} data-entry-id={entryId}>
        <td className="netHrefCol netCol ">
          <div style={{ marginLeft: "0px" }} className="netHrefLabel netLabel ">
            {this.getHref(entry)}
          </div>
          <div style={{ marginLeft: "0px" }} className="netFullHrefLabel netHrefLabel netLabel ">
            {this.getFullHref(entry)}
          </div>
        </td>
        <td className="netStatusCol netCol ">
          <div className="netStatusLabel netLabel ">
            {this.getStatus(entry)}
          </div>
        </td>
        <td className="netTypeCol netCol ">
          <div className="netTypeLabel netLabel ">
            {this.getType(entry)}
          </div>
        </td>
        <td className="netDomainCol netCol ">
          <div className="netDomainLabel netLabel ">
            {this.getDomain(entry)}
          </div>
        </td>
        <td className="netSizeCol netCol ">
          <div className="netSizeLabel netLabel ">
            {this.getSize(entry)}
          </div>
        </td>
        <td className="netTimeCol netCol ">
          <div className="netTimelineBar ">&nbsp;
                        {bars}
            {pageTimingBars}
          </div>
        </td>
        <td className="netOptionsCol netCol ">
          <div className="netOptionsLabel netLabel "></div>
        </td>
      </tr>
    );
  }
});

export default NetRow;

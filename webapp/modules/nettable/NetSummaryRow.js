import React from "react";
import PropTypes from "prop-types";

import Strings from "i18n!../nls/requestList";
import * as Str from "../core/string";
import { calculateSummaryInfo } from "./NetSummaryRowModel";

class NetSummaryRow extends React.Component {
  formatRequestCount(count) {
    return count + " " + (count === 1 ? Strings.request : Strings.requests);
  }

  formatTotalTime(totalTime, onLoadTime) {
    const onLoadStr = onLoadTime > 0 ? " (onload: " + Str.formatTime(onLoadTime) + ")" : "";
    return Str.formatTime(totalTime) + onLoadStr;
  }

  getCacheSizeContent(cachedSize) {
    if (cachedSize <= 0) {
      return "";
    }
    return [
      "(",
      <span key="cachedSize" className=" ">{Str.formatSize(cachedSize)}</span>,
      <span key="summaryFromCache" className=" "> {Strings.summaryFromCache}</span>,
      ")",
    ];
  }

  render() {
    let { page, entries, summaryInfo } = this.props;
    if (!summaryInfo) {
      summaryInfo = calculateSummaryInfo(page, entries);
    }

    return (
      <tr className="netRow netSummaryRow ">
        <td className="netIndexCol netCol "></td>
        <td className="netHrefCol netCol ">
          <div className="netCountLabel netSummaryLabel ">{this.formatRequestCount(entries.length)}</div>
        </td>
        <td className="netStatusCol netCol "></td>
        <td className="netTypeCol netCol "></td>
        <td className="netDomainCol netCol "></td>
        <td className="netServerIPAddressCol netCol "></td>
        <td className="netConnectionCol netCol "></td>
        <td className="netTotalSizeCol netSizeCol netCol ">
          <div className="netTotalSizeLabel netSummaryLabel ">{Str.formatSize(summaryInfo.totalTransferredSize)}</div>
        </td>
        <td className="netTotalTimeCol netTimeCol netCol ">
          <div style={{ width: "100%" }} className=" ">
            <div className="netCacheSizeLabel netSummaryLabel ">
              {this.getCacheSizeContent(summaryInfo.cachedSize)}
            </div>
            <div className="netUncompressedSizeLabel netSummaryLabel ">
              (<span className=" ">{Str.formatSize(summaryInfo.totalUncompressedSize)}</span>
              <span className=" "> {Strings.uncompressed}</span>)
            </div>
            <div className="netTimeBar ">
              <span className="netTotalTimeLabel netSummaryLabel ">{this.formatTotalTime(summaryInfo.totalTime, summaryInfo.onLoadTime)}</span>
            </div>
          </div>
        </td>
        <td className="netOptionsCol netCol "></td>
      </tr>
    );
  }
};

NetSummaryRow.propTypes = {
  entries: PropTypes.array.isRequired,
  page: PropTypes.object,
  summaryInfo: PropTypes.object,
};

export default NetSummaryRow;

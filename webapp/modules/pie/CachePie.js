import React, { Component } from "react";
import PropTypes from "prop-types";

import Pie from "./Pie";
import * as Str from "../core/string";
import Strings from "i18n!../nls/harStats";

class CachePie extends Component {
  title = "Comparison of downloaded data from the server and browser cache."

  data = [
    {
      count: 0,
      value: 0,
      label: Strings.pieLabelDownloaded,
      color: "rgb(182, 182, 182)",
    },
    {
      count: 0,
      value: 0,
      label: Strings.pieLabelPartial,
      color: "rgb(218, 218, 218)",
    },
    {
      count: 0,
      value: 0,
      label: Strings.pieLabelFromCache,
      color: "rgb(239, 239, 239)",
    },
  ]

  getLabelTooltipText = (item) => {
    return item.count + "x " + item.label + ": " + Str.formatSize(item.value);
  }

  calcData() {
    // Iterate over all requests and compute stats.
    const { entries = [] } = this.props;
    const data = this.data.map((d) => ({ ...d }));
    entries.forEach((entry) => {
      if (!entry.timings) {
        return;
      }

      const { response } = entry;
      // TODO use transferred size
      const resBodySize = response.bodySize > 0 ? response.bodySize : 0;

      // TODO use proper stats routines

      // Get Cache info
      if (entry.response.status === 206) { // Partial content
        data[1].value += resBodySize;
        data[1].count++;
      } else if (entry.response.status === 304) { // From cache
        data[2].value += resBodySize;
        data[2].count++;
      } else if (resBodySize > 0) { // Downloaded
        data[0].value += resBodySize;
        data[0].count++;
      }
    });
    return data;
  }

  render() {
    return <Pie data={this.calcData()} title={this.title} getLabelTooltipText={this.getLabelTooltipText} />;
  }
}

CachePie.propTypes = {
  entries: PropTypes.array,
};

export default CachePie;

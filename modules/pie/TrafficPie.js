import React, { Component } from "react";
import PropTypes from "prop-types";

import Pie from "./Pie";
import * as Str from "../core/string";
import Strings from "i18n!../nls/harStats";

class TrafficPie extends Component {
  title = "Summary of sent and received bodies & headers."

  data = [
    {
      value: 0,
      label: Strings.pieLabelHeadersSent,
      color: "rgb(247, 179, 227)",
    },
    {
      value: 0,
      label: Strings.pieLabelBodiesSent,
      color: "rgb(226, 160, 241)",
    },
    {
      value: 0,
      label: Strings.pieLabelHeadersReceived,
      color: "rgb(166, 232, 166)",
    },
    {
      value: 0,
      label: Strings.pieLabelBodiesReceived,
      color: "rgb(168, 196, 173)",
    },
  ]

  getLabelTooltipText = (item) => {
    return item.label + ": " + Str.formatSize(item.value);
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

      // Get traffic info
      data[0].value += entry.request.headersSize > 0 ? entry.request.headersSize : 0;
      data[1].value += entry.request.bodySize > 0 ? entry.request.bodySize : 0;
      data[2].value += entry.response.headersSize > 0 ? entry.response.headersSize : 0;
      data[3].value += resBodySize;
    });
    return data;
  }

  render() {
    return <Pie data={this.calcData()} title={this.title} getLabelTooltipText={this.getLabelTooltipText} />;
  }
}

TrafficPie.propTypes = {
  entries: PropTypes.array,
};

export default TrafficPie;

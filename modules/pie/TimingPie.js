import React, { Component } from "react";
import PropTypes from "prop-types";

import Pie from "./Pie";
import * as Str from "../core/string";
import Strings from "i18n!../nls/harStats";

class TimingPie extends Component {
  title = "Summary of request times."

  data = [
    {
      value: 0,
      label: Strings.pieLabelBlocked,
      color: "rgb(228, 214, 193)",
    },
    {
      value: 0,
      label: Strings.pieLabelDNS,
      color: "rgb(119, 192, 203)",
    },
    {
      value: 0,
      label: Strings.pieLabelSSL,
      color: "rgb(168, 196, 173)",
    },
    {
      value: 0,
      label: Strings.pieLabelConnect,
      color: "rgb(179, 222, 93)",
    },
    {
      value: 0,
      label: Strings.pieLabelSend,
      color: "rgb(224, 171, 157)",
    },
    {
      value: 0,
      label: Strings.pieLabelWait,
      color: "rgb(163, 150, 190)",
    },
    {
      value: 0,
      label: Strings.pieLabelReceive,
      color: "rgb(194, 194, 194)",
    },
  ]

  getLabelTooltipText = (item) => {
    return item.label + ": " + Str.formatTime(item.value.toFixed(2));
  }

  calcData() {
    // Iterate over all requests and compute stats.
    const { entries = [] } = this.props;
    const data = this.data.map((d) => ({ ...d }));
    entries.forEach((entry) => {
      if (!entry.timings) {
        return;
      }

      // Get timing info (SSL is new in HAR 1.2)
      data[0].value += entry.timings.blocked;
      data[1].value += entry.timings.dns;
      data[2].value += entry.timings.ssl > 0 ? entry.timings.ssl : 0;
      data[3].value += entry.timings.connect;
      data[4].value += entry.timings.send;
      data[5].value += entry.timings.wait;
      data[6].value += entry.timings.receive;

      // The ssl time is also included in the connect field, see HAR 1.2 spec
      // (to ensure backward compatibility with HAR 1.1).
      if (entry.timings.ssl > 0) {
        data[3].value -= entry.timings.ssl;
      }
    });
    return data;
  }

  render() {
    return <Pie data={this.calcData()} title={this.title} getLabelTooltipText={this.getLabelTooltipText} />;
  }
}

TimingPie.propTypes = {
  entries: PropTypes.array,
};

export default TimingPie;

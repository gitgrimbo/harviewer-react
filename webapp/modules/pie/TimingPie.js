import createPie from "./Pie";
import * as Str from "core/string";
import Strings from "amdi18n!nls/harStats";

export default createPie({
  title: "Summary of request times.",

  data: [
    {
      value: 0,
      label: Strings.pieLabelBlocked,
      color: "rgb(228, 214, 193)"
    },
    {
      value: 0,
      label: Strings.pieLabelDNS,
      color: "rgb(119, 192, 203)"
    },
    {
      value: 0,
      label: Strings.pieLabelSSL,
      color: "rgb(168, 196, 173)"
    },
    {
      value: 0,
      label: Strings.pieLabelConnect,
      color: "rgb(179, 222, 93)"
    },
    {
      value: 0,
      label: Strings.pieLabelSend,
      color: "rgb(224, 171, 157)"
    },
    {
      value: 0,
      label: Strings.pieLabelWait,
      color: "rgb(163, 150, 190)"
    },
    {
      value: 0,
      label: Strings.pieLabelReceive,
      color: "rgb(194, 194, 194)"
    }
  ],

  getLabelTooltipText(item) {
    return item.label + ": " + Str.formatTime(item.value);
  },

  handlePage(page) {
    // Iterate over all requests and compute stats.
    var entries = page ? this.props.model.getPageEntries(page) : this.props.model.getAllEntries();
    for (var i = 0; i < entries.length; i++) {
      var entry = entries[i];
      if (!entry.timings) {
        continue;
      }

      // Get timing info (SSL is new in HAR 1.2)
      this.data[0].value += entry.timings.blocked;
      this.data[1].value += entry.timings.dns;
      this.data[2].value += entry.timings.ssl > 0 ? entry.timings.ssl : 0;
      this.data[3].value += entry.timings.connect;
      this.data[4].value += entry.timings.send;
      this.data[5].value += entry.timings.wait;
      this.data[6].value += entry.timings.receive;

      // The ssl time is also included in the connect field, see HAR 1.2 spec
      // (to ensure backward compatibility with HAR 1.1).
      if (entry.timings.ssl > 0) {
        this.data[3].value -= entry.timings.ssl;
      }
    }
  }
});

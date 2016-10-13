import createPie from "./Pie";
import * as Str from "core/string";
import Strings from "amdi18n!nls/harStats";

export default createPie({
  title: "Summary of sent and received bodies & headers.",

  data: [
    {
      value: 0,
      label: Strings.pieLabelHeadersSent,
      color: "rgb(247, 179, 227)"
    },
    {
      value: 0,
      label: Strings.pieLabelBodiesSent,
      color: "rgb(226, 160, 241)"
    },
    {
      value: 0,
      label: Strings.pieLabelHeadersReceived,
      color: "rgb(166, 232, 166)"
    },
    {
      value: 0,
      label: Strings.pieLabelBodiesReceived,
      color: "rgb(168, 196, 173)"
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

      var response = entry.response;
      var resBodySize = response.bodySize > 0 ? response.bodySize : 0;

      // Get traffic info
      this.data[0].value += entry.request.headersSize > 0 ? entry.request.headersSize : 0;
      this.data[1].value += entry.request.bodySize > 0 ? entry.request.bodySize : 0;
      this.data[2].value += entry.response.headersSize > 0 ? entry.response.headersSize : 0;
      this.data[3].value += resBodySize;
    }
  }
});

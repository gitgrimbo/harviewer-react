import createPie from "./Pie";
import * as Str from "core/string";
import Strings from "amdi18n!nls/harStats";

export default createPie({
  title: "Comparison of downloaded data from the server and browser cache.",

  data: [
    {
      value: 0,
      label: Strings.pieLabelDownloaded,
      color: "rgb(182, 182, 182)"
    },
    {
      value: 0,
      label: Strings.pieLabelPartial,
      color: "rgb(218, 218, 218)"
    },
    {
      value: 0,
      label: Strings.pieLabelFromCache,
      color: "rgb(239, 239, 239)"
    }
  ],

  getLabelTooltipText(item) {
    return item.count + "x " + item.label + ": " + Str.formatSize(item.value);
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

      // Get Cache info
      if (entry.response.status === 206) { // Partial content
        this.data[1].value += resBodySize;
        this.data[1].count++;
      } else if (entry.response.status === 304) { // From cache
        this.data[2].value += resBodySize;
        this.data[2].count++;
      } else if (resBodySize > 0) { // Downloaded
        this.data[0].value += resBodySize;
        this.data[0].count++;
      }
    }
  }
});

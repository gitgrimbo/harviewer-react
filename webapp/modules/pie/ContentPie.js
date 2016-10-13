import createPie from "./Pie";
import * as Mime from "core/mime";
import * as Str from "core/string";
import Strings from "amdi18n!nls/harStats";

var jsTypes = {
  "text/javascript": 1,
  "text/jscript": 1,
  "application/javascript": 1,
  "application/x-javascript": 1,
  "text/js": 1
};

var htmlTypes = {
  "text/plain": 1,
  "text/html": 1
};

var cssTypes = {
  "text/css": 1
};

var imageTypes = {
  "image/png": 1,
  "image/jpeg": 1,
  "image/gif": 1
};

var flashTypes = {
  "application/x-shockwave-flash": 1
};

var jsonTypes = {
  "text/x-json": 1,
  "text/x-js": 1,
  "application/json": 1,
  "application/x-js": 1
};

var xmlTypes = {
  "application/xml": 1,
  "application/xhtml+xml": 1,
  "application/vnd.mozilla.xul+xml": 1,
  "text/xml": 1,
  "text/xul": 1,
  "application/rdf+xml": 1
};

var unknownTypes = {
  "text/xsl": 1,
  "text/sgml": 1,
  "text/rtf": 1,
  "text/x-setext": 1,
  "text/richtext": 1,
  "text/tab-separated-values": 1,
  "text/rdf": 1,
  "text/xif": 1,
  "text/ecmascript": 1,
  "text/vnd.curl": 1,
  "text/vbscript": 1,
  "view-source": 1,
  "view-fragment": 1,
  "application/x-httpd-php": 1,
  "application/ecmascript": 1,
  "application/http-index-format": 1
};

export default createPie({
  title: "Summary of content types.",

  data: [
    {
      value: 0,
      label: Strings.pieLabelHTMLText,
      color: "rgb(174, 234, 218)"
    },
    {
      value: 0,
      label: Strings.pieLabelJavaScript,
      color: "rgb(245, 230, 186)"
    },
    {
      value: 0,
      label: Strings.pieLabelCSS,
      color: "rgb(212, 204, 219)"
    },
    {
      value: 0,
      label: Strings.pieLabelImage,
      color: "rgb(220, 171, 181)"
    },
    {
      value: 0,
      label: Strings.pieLabelFlash,
      color: "rgb(166, 156, 222)"
    },
    {
      value: 0,
      label: Strings.pieLabelOthers,
      color: "rgb(229, 171, 255)"
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

      // Get Content type info. Make sure we read the right content type
      // even if there is also a charset specified.
      var mimeType = Mime.extractMimeType(response.content.mimeType);

      // Collect response sizes according to the contentType.
      if (htmlTypes[mimeType]) {
        this.data[0].value += resBodySize;
        this.data[0].count++;
      } else if (jsTypes[mimeType]) {
        this.data[1].value += resBodySize;
        this.data[1].count++;
      } else if (cssTypes[mimeType]) {
        this.data[2].value += resBodySize;
        this.data[2].count++;
      } else if (imageTypes[mimeType]) {
        this.data[3].value += resBodySize;
        this.data[3].count++;
      } else if (flashTypes[mimeType]) {
        this.data[4].value += resBodySize;
        this.data[4].count++;
      } else {
        this.data[5].value += resBodySize;
        this.data[5].count++;
      }
    }
  }
});

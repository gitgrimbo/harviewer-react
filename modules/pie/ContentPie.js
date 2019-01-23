import React, { Component } from "react";
import PropTypes from "prop-types";

import Pie from "./Pie";
import * as Mime from "../core/mime";
import * as Str from "../core/string";
import Strings from "i18n!../nls/harStats";

const jsTypes = {
  "text/javascript": 1,
  "text/jscript": 1,
  "application/javascript": 1,
  "application/x-javascript": 1,
  "text/js": 1,
};

const htmlTypes = {
  "text/plain": 1,
  "text/html": 1,
};

const cssTypes = {
  "text/css": 1,
};

const imageTypes = {
  "image/png": 1,
  "image/jpeg": 1,
  "image/gif": 1,
};

const flashTypes = {
  "application/x-shockwave-flash": 1,
};

const jsonTypes = {
  "text/x-json": 1,
  "text/x-js": 1,
  "application/json": 1,
  "application/x-js": 1,
};

const xmlTypes = {
  "application/xml": 1,
  "application/xhtml+xml": 1,
  "application/vnd.mozilla.xul+xml": 1,
  "text/xml": 1,
  "text/xul": 1,
  "application/rdf+xml": 1,
};

const unknownTypes = {
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
  "application/http-index-format": 1,
};

class ContentPie extends Component {
  title = "Summary of content types."

  data = [
    {
      count: 0,
      value: 0,
      label: Strings.pieLabelHTMLText,
      color: "rgb(174, 234, 218)",
    },
    {
      count: 0,
      value: 0,
      label: Strings.pieLabelJavaScript,
      color: "rgb(245, 230, 186)",
    },
    {
      count: 0,
      value: 0,
      label: Strings.pieLabelCSS,
      color: "rgb(212, 204, 219)",
    },
    {
      count: 0,
      value: 0,
      label: Strings.pieLabelImage,
      color: "rgb(220, 171, 181)",
    },
    {
      count: 0,
      value: 0,
      label: Strings.pieLabelFlash,
      color: "rgb(166, 156, 222)",
    },
    {
      count: 0,
      value: 0,
      label: Strings.pieLabelOthers,
      color: "rgb(229, 171, 255)",
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

      // Get Content type info. Make sure we read the right content type
      // even if there is also a charset specified.
      const mimeType = Mime.extractMimeType(response.content.mimeType);

      // Collect response sizes according to the contentType.
      if (htmlTypes[mimeType]) {
        data[0].value += resBodySize;
        data[0].count++;
      } else if (jsTypes[mimeType]) {
        data[1].value += resBodySize;
        data[1].count++;
      } else if (cssTypes[mimeType]) {
        data[2].value += resBodySize;
        data[2].count++;
      } else if (imageTypes[mimeType]) {
        data[3].value += resBodySize;
        data[3].count++;
      } else if (flashTypes[mimeType]) {
        data[4].value += resBodySize;
        data[4].count++;
      } else {
        data[5].value += resBodySize;
        data[5].count++;
      }
    });
    return data;
  }

  render() {
    return <Pie data={this.calcData()} title={this.title} getLabelTooltipText={this.getLabelTooltipText} />;
  }
}

ContentPie.propTypes = {
  entries: PropTypes.array,
};

export default ContentPie;

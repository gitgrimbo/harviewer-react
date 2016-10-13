import React from "react";
import * as Mime from "core/mime";
import dp from "syntax-highlighter/shCore";

import { canDecode } from "./decoder";

const Highlighted = React.createClass({
  displayName: "requestbodies/Highlighted",

  propTypes: {
    entry: React.PropTypes.object
  },

  maybeDoHighlighting() {
    const { entry } = this.props;
    const pre = this.refs.dom;
    pre.innerText = "";
    const text = entry.response.content.text;
    pre.appendChild(document.createTextNode(text));
    dp.SyntaxHighlighter.highlight(pre);
  },

  componentDidMount() {
    this.maybeDoHighlighting();
  },

  componentDidUpdate() {
    this.maybeDoHighlighting();
  },

  render() {
    const { entry } = this.props;
    const brush = Highlighted.shouldHighlightAs(entry.response.content.mimeType);
    return (
      <div className="netInfoHighlightedText netInfoText">
        <pre className={"toolbar: false; brush: " + brush} name="code" ref="dom">
        </pre>
      </div>
    );
  }
});

Highlighted.canShowEntry = function(entry) {
  var content = entry.response.content;

  if (!content || !content.text) {
    return false;
  }

  if (!canDecode(content.encoding)) {
    return false;
  }

  // Remove any mime type parameters (if any)
  var mimeType = Mime.extractMimeType(content.mimeType || "");

  return (Highlighted.shouldHighlightAs(mimeType) !== null);
};

// TODO - REPLACE ME
const XmlTab = {
  isXmlMimeType: mimeType => false
};

Highlighted.shouldHighlightAs = function(mimeType) {
  var mimeTypesToHighlight = {
    javascript: [
      "application/javascript",
      "text/javascript",
      "application/x-javascript",
      "text/ecmascript",
      "application/ecmascript",
      "application/json"
    ],
    css: ["text/css"],
    html: ["text/html", "application/xhtml+xml"]
  };
  for (var brush in mimeTypesToHighlight) {
    if (mimeTypesToHighlight[brush].indexOf(mimeType) > -1) {
      return brush;
    }
  }
  return XmlTab.isXmlMimeType(mimeType) ? "xml" : null;
};

export default Highlighted;

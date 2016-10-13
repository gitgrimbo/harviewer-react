import React, { Component } from "react";
import PropTypes from "prop-types";

import * as Mime from "../core/mime";
import { canDecode } from "./decoder";

class Highlighted extends Component {
  constructor(props) {
    super(props);
    this.domRef = React.createRef();
  }

  maybeDoHighlighting() {
    const { entry } = this.props;
    const text = entry.response.content.text;
    const brush = Highlighted.shouldHighlightAs(entry.response.content.mimeType);

    const pre = this.domRef.current;
    const code = pre.firstChild;

    // clear flag
    code.removeAttribute("highlighted");

    code.innerText = "";
    code.appendChild(document.createTextNode(text));

    if (brush) {
      code.className = brush;
      // Run highlightElement on the <code>, not the <pre>
      hljs.highlightBlock(code);

      // test that highlighting has worked, and set a flag that helps with testing.
      const highlightedElement = code;
      if (code.classList.contains("hljs")) {
        highlightedElement.setAttribute("highlighted", true);
      }
    }
  }

  componentDidMount() {
    this.maybeDoHighlighting();
  }

  componentDidUpdate() {
    this.maybeDoHighlighting();
  }

  render() {
    // highlightjs needs a <code> block inside a <pre> block.
    return (
      <div className="netInfoHighlightedText netInfoText">
        <pre className="javascript" ref={this.domRef}>
          <code></code>
        </pre>
      </div>
    );
  }
};

Highlighted.propTypes = {
  entry: PropTypes.object,
};

Highlighted.canShowEntry = function(entry) {
  const { content } = entry.response;

  if (!content || !content.text) {
    return false;
  }

  if (!canDecode(content.encoding)) {
    return false;
  }

  // Remove any mime type parameters (if any)
  const mimeType = Mime.extractMimeType(content.mimeType || "");

  const shouldHighlightAs = Highlighted.shouldHighlightAs(mimeType);
  return (shouldHighlightAs !== null);
};

// TODO - Put this in the right place when we implement XML tab.
const XmlTab = {};

XmlTab.isXmlMimeType = function(mimeType) {
  mimeType = Mime.extractMimeType(mimeType);
  return [
    "text/xml",
    "application/xml",
    "image/svg+xml",
    "application/atom+xml",
    "application/xslt+xml",
    "application/mathml+xml",
    "application/rss+xml",
  ].indexOf(mimeType) > -1;
};

Highlighted.shouldHighlightAs = function(mimeType) {
  const mimeTypesToHighlight = {
    javascript: [
      "application/javascript",
      "text/javascript",
      "application/x-javascript",
      "text/ecmascript",
      "application/ecmascript",
      "application/json",
    ],
    css: ["text/css"],
    html: ["text/html", "application/xhtml+xml"],
  };
  for (const brush in mimeTypesToHighlight) {
    if (mimeTypesToHighlight[brush].indexOf(mimeType) > -1) {
      return brush;
    }
  }
  return XmlTab.isXmlMimeType(mimeType) ? "xml" : null;
};

export default Highlighted;

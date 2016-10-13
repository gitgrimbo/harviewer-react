import React from "react";
import PropTypes from "prop-types";

import XMLTree, { hasChildren, populateChildren } from "../tree/XMLTree";
import { canDecode, decode } from "./decoder";
import * as Mime from "../core/mime";

function getRoot(entry) {
  const { content } = entry.response;
  const xmlStr = decode(content.text, content.encoding);
  return $.parseXML(xmlStr);
}

class XMLEntryTree extends React.Component {
  render() {
    const { entry } = this.props;
    const root = getRoot(entry);
    return <XMLTree root={root} hasChildren={hasChildren} populateChildren={populateChildren} />;
  }
};

XMLEntryTree.propTypes = {
  entry: PropTypes.object,
};

XMLEntryTree.isXmlMimeType = function(mimeType) {
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

XMLEntryTree.canShowEntry = function(entry) {
  const { content } = entry.response;

  if (!content || !content.text) {
    return false;
  }

  if (!canDecode(content.encoding)) {
    return false;
  }

  const mimeType = Mime.extractMimeType(content.mimeType || "");
  return XMLEntryTree.isXmlMimeType(mimeType);
};

export default XMLEntryTree;

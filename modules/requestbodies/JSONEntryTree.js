import React from "react";
import PropTypes from "prop-types";

import ObjectTree, { hasChildren, populateChildren } from "../tree/ObjectTree";
import { canDecode, decode } from "./decoder";
import * as Mime from "../core/mime";

function getRoot(entry) {
  const { content } = entry.response;
  const jsonStr = decode(content.text, content.encoding);
  return JSON.parse(jsonStr);
}

class JSONEntryTree extends React.Component {
  render() {
    const { entry } = this.props;
    const root = getRoot(entry);
    return <ObjectTree root={root} hasChildren={hasChildren} populateChildren={populateChildren} />;
  }
};

JSONEntryTree.propTypes = {
  entry: PropTypes.object,
};

JSONEntryTree.canShowEntry = function(entry) {
  const { content } = entry.response;

  if (!content || !content.text) {
    return false;
  }

  if (!canDecode(content.encoding)) {
    return false;
  }

  const mimeType = Mime.extractMimeType(content.mimeType || "");
  return ["application/json"].indexOf(mimeType) > -1;
};

export default JSONEntryTree;

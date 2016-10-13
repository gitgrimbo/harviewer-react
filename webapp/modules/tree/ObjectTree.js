import React from "react";
import PropTypes from "prop-types";

import Tree, { createUINode } from "./Tree";

export function hasChildren(value) {
  if (typeof value === "string") {
    // Object.keys(string) returns numeric keys like an array.
    // We don't want that.
    return false;
  }
  // arrays have keys, so this works for arrays and objects
  return Object.keys(value).length > 0;
}

export function populateChildren(uiNode, level) {
  const object = uiNode.value;
  const children = uiNode.children = [];

  const handleChild = (prop, propObj) => {
    if (typeof propObj !== "function") {
      const child = createUINode("dom", prop, propObj, hasChildren(propObj), level);
      children.push(child);
    }
  };

  if (Array.isArray(object)) {
    object.forEach((item, i) => handleChild(i, item));
  } else {
    Object.keys(object).forEach((key) => handleChild(key, object[key]));
  }
}

class ObjectTree extends React.Component {
  treeRef = React.createRef();

  getTree() {
    return this.treeRef.current;
  }

  render() {
    return <Tree ref={this.treeRef} hasChildren={hasChildren} populateChildren={populateChildren} {...this.props} />;
  }
};

export default ObjectTree;

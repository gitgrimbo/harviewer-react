import React from "react";
import PropTypes from "prop-types";

import Tree, { createUINode } from "./Tree";

function nodeChildElements(node, limit) {
  limit = ("number" === limit) ? limit : null;

  const elements = [];
  let child = node.firstChild;
  while (child) {
    if (Node.ELEMENT_NODE === child.nodeType) {
      elements.push(child);
      if (null !== limit && elements.length >= limit) {
        return elements;
      }
    }
    child = child.nextSibling;
  }
  return elements;
}

function nodeAttributes(node, limit) {
  limit = ("number" === limit) ? limit : null;

  const attrs = [];
  if (!node.attributes) {
    return attrs;
  }
  for (let i = node.attributes.length; --i >= 0;) {
    attrs.push(node.attributes[i]);
    if (null !== limit && attrs.length >= limit) {
      return attrs;
    }
  }
  return attrs;
}

function hasChildren(value) {
  const attrs = nodeAttributes(value);
  const elements = nodeChildElements(value);
  return (attrs.length > 0 || elements.length > 0);
}

function populateChildren(uiNode, level) {
  const object = uiNode.value;
  const children = uiNode.children = [];

  const attrs = nodeAttributes(object)
    .map((attr) => createUINode("dom", "@" + attr.name, attr.value, false, level));

  const elements = nodeChildElements(object).map((element) => {
    const hasChilds = hasChildren(element);
    return createUINode("dom", element.tagName, hasChilds ? element : element.firstChild.nodeValue, hasChilds, level);
  });

  const members = attrs;

  // If there are no child elements, then we add the element's firstChild content (if it exists).
  // This firstChild content could be text.
  if (elements.length === 0 && object.firstChild) {
    members.push(createUINode("dom", "value", object.firstChild.nodeValue, false, level));
  }

  children.push(...attrs);
  children.push(...elements);
}

class XMLTree extends React.Component {
  render() {
    const { root } = this.props;
    return <Tree root={root} hasChildren={hasChildren} populateChildren={populateChildren} />;
  }
};

XMLTree.propTypes = {
  root: PropTypes.object,
};

XMLTree.isXmlMimeType = function(mimeType) {
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

XMLTree.canShowEntry = function(entry) {
  const { content } = entry.response;

  if (!content || !content.text) {
    return false;
  }

  if (!canDecode(content.encoding)) {
    return false;
  }

  const mimeType = Mime.extractMimeType(content.mimeType || "");
  return XMLTree.isXmlMimeType(mimeType);
};

export default XMLTree;

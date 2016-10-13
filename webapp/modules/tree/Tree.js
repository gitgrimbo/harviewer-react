import React, { Component } from "react";
import PropTypes from "prop-types";

import Css from "../core/css";
import Dom from "../core/dom";
import Events from "../core/events";

import Representations from "./TreeRepresentations";

export function createUINode(type, name, value, hasChildren, level) {
  const representation = Representations.getRep(value);

  return {
    name,
    value,
    type,
    rowClass: "memberRow-" + type,
    open: false,
    level,
    indent: level * 16,
    hasChildren,
    children: null,
    representation,
  };
};

function Row({ dataKey, level, child, hasChildrenClass }) {
  const openClass = child.open ? "opened" : "";
  return (
    <tr data-key={dataKey} level={level} className={`memberRow ${child.type}Row ${hasChildrenClass} ${openClass}`}>
      <td style={{ paddingLeft: `${child.indent}px` }} className="memberLabelCell">
        <span className={`memberLabel ${child.type}Label`}>{child.name}</span></td>
      <td className="memberValueCell"><child.representation type={child.type} value={child.value} /></td>
    </tr>
  );
}

function setStateAsync(ctx, updaterOrState, callback) {
  return new Promise((resolve, reject) => {
    ctx.setState(updaterOrState, () => {
      (typeof callback === "function") && callback();
      resolve();
    });
  });
}

class Tree extends Component {
  static defaultProps = {
    showFirstChild: true,
  };

  constructor(props) {
    super(props);

    this.tableRef = React.createRef();

    const { root } = this.props;

    const uiTree = this.getUITree("ROOT", root);
    this.state = {
      uiTree,
    };
  }

  componentDidMount() {
    const { showFirstChild } = this.props;
    if (showFirstChild) {
      this.toggleNode("0");
    }
  }

  getUITree(name, object, level) {
    if (!level) {
      level = 0;
    }

    const { hasChildren, populateChildren } = this.props;
    const uiNode = createUINode("dom", name, object, hasChildren(object), level);
    populateChildren(uiNode, level + 1);

    return uiNode;
  }

  findObjectBox(key) {
    const row = this.tableRef.current.querySelector(`[data-key="${key}"]`);
    return row ? row.querySelector(".memberValueCell .objectBox") : null;
  }

  async findNode(key) {
    const { populateChildren } = this.props;
    const { uiTree } = this.state;

    let newUiTree = null;

    const parts = key.split(".");
    const found = parts.reduce((uiNode, part) => {
      const { hasChildren } = uiNode;
      if (hasChildren && uiNode.children === null) {
        populateChildren(uiNode, uiNode.level + 1);
        uiNode.open = true;
        newUiTree = uiTree;
      }
      const child = uiNode.children[part];
      return child;
    }, uiTree);

    if (newUiTree) {
      return setStateAsync(this, { uiTree: newUiTree })
        .then(() => found);
    }

    return found;
  }

  async resolveNode(keyOrNode) {
    if (typeof keyOrNode === "string") {
      return this.findNode(keyOrNode);
    }
    // assume it's a node already
    return keyOrNode;
  }

  async refresh() {
    // TODO - we fake a change of state here really.
    // we've modified the actual state, but passed a new state 'wrapper' to setState to get re-render.
    return setStateAsync(this, ({ uiTree }) => ({
      uiTree,
    }));
  }

  async showNode(keyOrNode) {
    const { populateChildren } = this.props;
    const uiNode = await this.resolveNode(keyOrNode);
    const { hasChildren } = uiNode;
    if (hasChildren) {
      populateChildren(uiNode, uiNode.level + 1);
    }
    uiNode.open = true;
    return this.refresh();
  }

  async hideNode(keyOrNode) {
    const uiNode = await this.resolveNode(keyOrNode);
    uiNode.children = null;
    uiNode.open = false;
    return this.refresh();
  }

  async toggleNode(keyOrNode) {
    const uiNode = await this.resolveNode(keyOrNode);

    if (!uiNode.open) {
      return this.showNode(uiNode);
    }
    return this.hideNode(uiNode);
  }

  onClick = (e) => {
    if (!Events.isLeftClick(e)) {
      return;
    }

    const row = Dom.getAncestorByClass(e.target, "memberRow");
    const label = Dom.getAncestorByClass(e.target, "memberLabel");
    if (label && Css.hasClass(row, "hasChildren")) {
      this.toggleNode(row.dataset.key);
    }
  }

  renderRows(uiNode, runningKey, rows) {
    const makeKey = (i) => {
      if (runningKey) {
        return runningKey + "." + i;
      }
      return String(i);
    };
    runningKey = runningKey || "";
    rows = rows || [];

    const { hasChildren } = this.props;

    // console.log("renderRows", uiNode, runningKey, rows);
    (uiNode.children || []).forEach((child, i) => {
      const { level } = child;
      const hasChildrenClass = hasChildren(child.value) ? "hasChildren" : "";

      const key = makeKey(i);
      // console.log(key);

      rows.push(<Row key={key} dataKey={key} level={level} child={child} hasChildrenClass={hasChildrenClass} />);
      if (hasChildrenClass && child.open) {
        this.renderRows(child, key, rows);
      }
    });
    return rows;
  }

  render() {
    const { uiTree } = this.state;

    if (!uiTree) {
      return null;
    }

    return (
      <table ref={this.tableRef} cellPadding="0" cellSpacing="0" className="domTable" onClick={this.onClick}>
        <tbody>
          {this.renderRows(uiTree)}
        </tbody>
      </table>
    );
  }
};

Tree.propTypes = {
  root: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
  hasChildren: PropTypes.func,
  populateChildren: PropTypes.func,
  showFirstChild: PropTypes.bool,
};

export default Tree;

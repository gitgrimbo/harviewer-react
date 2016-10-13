import React from "react";

import setState from "../setState";
import booleanFlipper from "../booleanFlipper";

import PageRow from "./PageRow";
import PageInfoRow from "./PageInfoRow";

export default React.createClass({
  displayName: "pagetable/PageTable",

  propTypes: {
    model: React.PropTypes.object
  },

  getInitialState() {
    const { model } = this.props;
    if (!model || !model.input) {
      return {};
    }

    const pages = model.input.log.pages;
    return {
      pageRowExpandedState: pages.map((page, i) => false)
    };
  },

  createPageRows(model) {
    if (!model || !model.input) {
      return [];
    }

    const pages = model.input.log.pages;
    const { pageRowExpandedState } = this.state;

    // Use concat to flatten an array of arrays to a flat array.
    return [].concat(pages.map((page, i) => {
      const opened = pageRowExpandedState[i];
      const pageRow = <PageRow key={"PageRow" + i} page={page} opened={opened} onClick={this.onPageRowClick.bind(this, i)} />;
      if (!opened) {
        return pageRow;
      }
      return [pageRow, <PageInfoRow key={"PageInfoRow" + i} model={model} page={page} />];
    }));
  },

  onPageRowClick(pageRowIdx) {
    setState(this, {
      pageRowExpandedState: this.state.pageRowExpandedState.map(booleanFlipper(pageRowIdx))
    });
  },

  render() {
    const { model } = this.props;
    const pageRows = this.createPageRows(model);

    return (
      <table className="pageTable" cellPadding="0" cellSpacing="0">
        <tbody>
          {pageRows}
        </tbody>
      </table>
    );
  }
});

import React from "react";

import setState from "../setState";
import TabBar from "./TabBar";
import TabBodies from "./TabBodies";

export default React.createClass({
  displayName: "tabview/TabView",

  propTypes: {
    id: React.PropTypes.string,
    selectedTabIdx: React.PropTypes.number,
    tabs: React.PropTypes.array
  },

  getInitialState() {
    return {
      selectedTabIdx: this.props.selectedTabIdx || 0
    };
  },

  componentWillReceiveProps(nextProps) {
    if (typeof nextProps.selectedTabIdx === "number") {
      setState(this, {
        selectedTabIdx: nextProps.selectedTabIdx
      });
    }
  },

  onSelectTab(tab, tabIdx, tabs) {
    setState(this, {
      selectedTabIdx: tabIdx
    });
  },

  render() {
    const { id, tabs } = this.props;

    // Try to get selectedTabIdx from state first.
    let { selectedTabIdx } = this.state;
    if (typeof selectedTabIdx !== "number") {
      selectedTabIdx = this.props.selectedTabIdx;
    }

    return (
      <table cellPadding="0" cellSpacing="0" className={"tabView " + (id || "")}>
        <tbody className="">
          <tr className="tabViewRow">
            <td style={{ verticalAlign: "top" }} className="tabViewCol">
              <div className="tabViewBody">
                <TabBar id={id} tabs={tabs} selectedTabIdx={selectedTabIdx} onSelectTab={this.onSelectTab} />
                <TabBodies id={id} tabs={tabs} selectedTabIdx={selectedTabIdx} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
});

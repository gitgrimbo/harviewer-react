import React from "react";
import Tab from "./Tab";

export default React.createClass({
  displayName: "tabview/TabBar",

  propTypes: {
    id: React.PropTypes.string,
    onSelectTab: React.PropTypes.func,
    selectedTabIdx: React.PropTypes.number,
    tabs: React.PropTypes.array
  },

  onSelectTab(tab, tabIdx) {
    const { tabs, onSelectTab } = this.props;
    if (onSelectTab) {
      onSelectTab(tabs[tabIdx], tabIdx, tabs);
    }
  },

  render() {
    const { id, tabs, selectedTabIdx } = this.props;
    const tabElements = tabs.map((tab, i) =>
      <Tab key={tab.id} { ...tab } selected={selectedTabIdx === i} onSelect={this.onSelectTab.bind(this, tab, i)} />
    );
    return (
      <div className={id + "Bar tabBar"}>
        {tabElements}
      </div>
    );
  }
});

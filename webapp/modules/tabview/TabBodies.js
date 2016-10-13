import React from "react";
import TabBody from "./TabBody";

export default React.createClass({
  displayName: "tabview/TabBodies",

  propTypes: {
    id: React.PropTypes.string,
    selectedTabIdx: React.PropTypes.number,
    tabs: React.PropTypes.array
  },

  render() {
    const { id, tabs, selectedTabIdx } = this.props;
    const tabBodies = tabs.map((tab, i) => {
      const selected = (selectedTabIdx === i);
      // Only include the body if it's selected
      return <TabBody key={tab.id} id={tab.id} selected={selected}>{selected ? tab.body : ""}</TabBody>;
    });
    return (
      <div className={id + "Bodies tabBodies"}>
        {tabBodies}
      </div>
    );
  }
});

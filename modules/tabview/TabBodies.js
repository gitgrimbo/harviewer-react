import React from "react";
import PropTypes from "prop-types";

import TabBody from "./TabBody";

class TabBodies extends React.Component {
  constructor(props) {
    super(props);

    const { tabs } = this.props;
    this.tabBodyRefs = tabs.map(() => React.createRef());
  }

  getTab(name) {
    const { tabs } = this.props;
    const idx = tabs.findIndex((tab) => name === tab.id);
    const tab = this.tabBodyRefs[idx].current;
    return (idx < 0) ? null : tab;
  }

  render() {
    const { id, tabs, selectedTabIdx } = this.props;

    const tabBodies = tabs.map((tab, i) => {
      const selected = (selectedTabIdx === i);
      // Only include the body if it's selected
      const clone = React.cloneElement(tab.body, {
        ref: this.tabBodyRefs[i],
      });
      return <TabBody key={tab.id} id={tab.id} selected={selected}>{selected ? clone : ""}</TabBody>;
    });
    return (
      <div className={id + "Bodies tabBodies"}>
        {tabBodies}
      </div>
    );
  }
}

TabBodies.propTypes = {
  id: PropTypes.string,
  selectedTabIdx: PropTypes.number,
  tabs: PropTypes.array,
};

export default TabBodies;

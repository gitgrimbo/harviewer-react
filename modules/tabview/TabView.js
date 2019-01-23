import React from "react";
import PropTypes from "prop-types";

import TabBar from "./TabBar";
import TabBodies from "./TabBodies";

class TabView extends React.Component {
  constructor(...args) {
    super(...args);
    this.tabBodiesRef = React.createRef();
    this.tableRef = React.createRef();
  }

  onSelectTab = (tabIdx, tab, tabs) => {
    const { onSelectedTabChange } = this.props;
    onSelectedTabChange(tabIdx, tab, tabs);
  }

  getTab(name) {
    return this.tabBodiesRef.current.getTab(name);
  }

  render() {
    const {
      id,
      tabs,
      selectedTabIdx,
      showTabBar = true,
    } = this.props;

    const hidetabbar = String(showTabBar === false);

    return (
      <table ref={this.tableRef} cellPadding="0" cellSpacing="0" className={"tabView " + (id || "")} hidetabbar={hidetabbar}>
        <tbody className="">
          <tr className="tabViewRow">
            <td style={{ verticalAlign: "top" }} className="tabViewCol">
              <div className="tabViewBody">
                {showTabBar && <TabBar id={id} tabs={tabs} selectedTabIdx={selectedTabIdx} onSelectTab={this.onSelectTab} />}
                <TabBodies ref={this.tabBodiesRef} id={id} tabs={tabs} selectedTabIdx={selectedTabIdx} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}

TabView.propTypes = {
  id: PropTypes.string,
  selectedTabIdx: PropTypes.number,
  tabs: PropTypes.array,
  onSelectedTabChange: PropTypes.func,
  showTabBar: PropTypes.bool,
};

export default TabView;

import React from "react";
import PropTypes from "prop-types";

class TabBody extends React.Component {
  render() {
    const { id, selected } = this.props;
    const selectedClass = selected ? "selected" : "";
    return (
      <div className={`tab${id}Body tabBody ${selectedClass}`}>
        {this.props.children}
      </div>
    );
  }
}

TabBody.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string,
  selected: PropTypes.bool,
};

export default TabBody;

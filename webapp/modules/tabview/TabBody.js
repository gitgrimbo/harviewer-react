import React from "react";

export default React.createClass({
  displayName: "tabview/TabBody",

  propTypes: {
    children: React.PropTypes.node,
    id: React.PropTypes.string,
    selected: React.PropTypes.bool
  },

  render() {
    const { id, selected } = this.props;
    return (
      <div className={"tab" + id + "Body tabBody " + (selected ? "selected" : "")}>
        {this.props.children}
      </div>
    );
  }
});

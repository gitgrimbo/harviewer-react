import React from "react";

export default React.createClass({
  displayName: "nettable/PageTimingBar",

  propTypes: {
    classes: React.PropTypes.string,
    left: React.PropTypes.string
  },

  render() {
    let { left, classes } = this.props;
    const style = {
      left: left,
      display: "block"
    };
    return (
      <div className={classes + " netPageTimingBar netBar"} style={style}></div>
    );
  }
});

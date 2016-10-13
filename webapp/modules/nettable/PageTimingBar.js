import React, { Component } from "react";
import PropTypes from "prop-types";

class PageTimingBar extends Component {
  render() {
    const { left, classes } = this.props;
    const style = {
      left: left,
      display: "block",
    };
    return (
      <div className={classes + " netPageTimingBar netBar"} style={style}></div>
    );
  }
}

PageTimingBar.propTypes = {
  classes: PropTypes.string,
  left: PropTypes.string,
};

export default PageTimingBar;

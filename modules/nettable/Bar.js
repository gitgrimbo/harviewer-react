import React, { Component } from "react";
import PropTypes from "prop-types";

class Bar extends Component {
  render() {
    const { bar } = this.props;

    const timeLabel = bar.timeLabel ? <span className="netTimeLabel ">{bar.timeLabel}</span> : null;

    return (
      <div className={bar.className + " netBar"} style={bar.style}>
        {timeLabel}
      </div>
    );
  }
}

Bar.propTypes = {
  bar: PropTypes.object,
};

export default Bar;

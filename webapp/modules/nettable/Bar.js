import React from "react";

const Bar = React.createClass({
  displayName: "nettable/Bar",

  propTypes: {
    bar: React.PropTypes.object
  },

  render() {
    const { bar } = this.props;

    const timeLabel = bar.timeLabel ? <span className="netTimeLabel ">{bar.timeLabel}</span> : null;

    return (
      <div className={bar.className + " netBar"} style={bar.style}>
        {timeLabel}
      </div>
    );
  }
});

export default Bar;

import React, { Component } from "react";
import PropTypes from "prop-types";

class PageTimelineCol extends Component {
  tdRef = React.createRef()

  render() {
    const { onClick, onMouseOver, selected } = this.props;
    const title = "Click to select and include in statistics preview.";
    const style = {
      height: this.getHeight() + "px",
    };
    return (
      <td ref={this.tdRef} className="pageTimelineCol ">
        <div
          title={title} style={style} className={`pageBar ${selected ? "selected" : ""}`}
          onClick={onClick}
          onMouseOver={onMouseOver}
        ></div>
      </td >
    );
  }

  getHeight() {
    const { page, maxElapsedTime } = this.props;
    const { onLoad } = page.pageTimings;

    let height = 1;
    if (onLoad > 0 && maxElapsedTime > 0) {
      height = Math.round((onLoad / maxElapsedTime) * 100);
    }

    return Math.max(1, height);
  }
}

PageTimelineCol.propTypes = {
  maxElapsedTime: PropTypes.number,
  onClick: PropTypes.func,
  onMouseOver: PropTypes.func,
  page: PropTypes.object,
  selected: PropTypes.bool,
};

export default PageTimelineCol;

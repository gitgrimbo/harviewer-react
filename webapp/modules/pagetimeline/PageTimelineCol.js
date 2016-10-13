import React from "react";
import * as Lib from "core/lib";

export default React.createClass({
  displayName: "pagetimeline/PageTimelineCol",

  propTypes: {
    maxElapsedTime: React.PropTypes.number,
    page: React.PropTypes.object
  },

  render() {
    let title = "Click to select and include in statistics preview.";
    let style = {
      height: this.getHeight() + 'px'
    };
    return (
      <td ref="dom" className="pageTimelineCol ">
        <div title={title} style={style} onClick={this.onClick} className="pageBar "></div>
      </td>
    );
  },

  onClick(event) {
    var e = Lib.fixEvent(event);

    var bar = e.target;
    if (!Lib.hasClass(bar, "pageBar"))
      return;

    var control = Lib.isControlClick(e);
    var shift = Lib.isShiftClick(e);

    var row = Lib.getAncestorByClass(bar, "pageTimelineRow");

    // If no modifier is active remove the current selection.
    if (!control && !shift) {
      Selection.unselectAll(row, bar);
    }

    // Clicked bar toggles its selection state
    Selection.toggle(bar);

    this.selectionChanged();
  },

  selectionChanged: function() {
    // Notify listeners such as the statistics preview
    var pages = this.getSelection();
    Lib.dispatch(this.listeners, "onSelectionChange", [pages]);
  },

  isVisible: function() {
    return Lib.hasClass(this.element, "opened");
  },

  getSelection: function() {
    if (!this.isVisible()) {
      return [];
    }

    var row = Lib.getElementByClass(this.refs.dom, "pageTimelineRow");
    return Selection.getSelection(row);
  },

  getHeight: function() {
    var height = 1;
    var page = this.props.page;
    var maxElapsedTime = this.props.maxElapsedTime;
    var onLoad = page.pageTimings.onLoad;
    if (onLoad > 0 && maxElapsedTime > 0) {
      height = Math.round((onLoad / maxElapsedTime) * 100);
    }

    return Math.max(1, height);
  }
});

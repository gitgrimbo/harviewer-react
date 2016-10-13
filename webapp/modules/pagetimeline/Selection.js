import React from "react";
import * as Lib from "core/lib";

let Selection = {
  isSelected: function(bar) {
    return Lib.hasClass(bar, "selected");
  },

  toggle: function(bar) {
    Lib.toggleClass(bar, "selected");
  },

  select: function(bar) {
    if (!this.isSelected(bar)) {
      Lib.setClass(bar, "selected");
    }
  },

  unselect: function(bar) {
    if (this.isSelected(bar)) {
      Lib.removeClass(bar, "selected");
    }
  },

  getSelection: function(row) {
    var pages = [];
    var bars = Lib.getElementsByClass(row, "pageBar");
    for (var i = 0; i < bars.length; i++) {
      var bar = bars[i];
      if (this.isSelected(bar)) {
        pages.push(bar.page);
      }
    }
    return pages;
  },

  unselectAll: function(row, except) {
    var bars = Lib.getElementsByClass(row, "pageBar");
    for (var i = 0; i < bars.length; i++) {
      if (except !== bars[i]) {
        this.unselect(bars[i]);
      }
    }
  }
};

export default Selection;

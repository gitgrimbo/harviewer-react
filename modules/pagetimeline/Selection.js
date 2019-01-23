import * as Css from "../core/css";
import * as Dom from "../core/dom";

const Selection = {
  isSelected: function(bar) {
    return Css.hasClass(bar, "selected");
  },

  toggle: function(bar) {
    Css.toggleClass(bar, "selected");
  },

  select: function(bar) {
    if (!this.isSelected(bar)) {
      Css.setClass(bar, "selected");
    }
  },

  unselect: function(bar) {
    if (this.isSelected(bar)) {
      Css.removeClass(bar, "selected");
    }
  },

  getSelection: function(row) {
    const bars = Array.from(Dom.getElementsByClass(row, "pageBar"));
    return bars
      .filter((bar) => this.isSelected(bar))
      .map((bar) => bar.page);
  },

  unselectAll: function(row, except) {
    const bars = Array.from(Dom.getElementsByClass(row, "pageBar"));
    bars
      .filter((bar) => except !== bar)
      .forEach((bar) => this.unselect(bar));
  },
};

export default Selection;

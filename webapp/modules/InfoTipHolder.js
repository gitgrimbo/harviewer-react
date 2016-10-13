import React from "react";
import { render, unmountComponentAtNode } from "react-dom";

import * as Lib from "core/lib";

import InfoTip from "./InfoTip";

const InfoTipHolder = React.createClass({
  displayName: "",

  propTypes: {
    children: React.PropTypes.node
  },

  listeners: [],
  maxWidth: 100,
  maxHeight: 80,
  infoTipMargin: 10,
  infoTipWindowPadding: 25,

  getChildContext() {
    return {
      infoTipHolder: this
    };
  },

  componentDidMount() {
    $(this.holder).on("mouseover", this.mousemove);
    $(this.holder).on("mouseover", this.mouseout);
    $(this.holder).on("mouseover", this.mousemove);
  },

  componentWillUnmount() {
    $(this.holder).off("mouseover", this.mousemove);
    $(this.holder).off("mouseover", this.mouseout);
    $(this.holder).off("mouseover", this.mousemove);
  },

  setInfoTipState(state) {
    if (this.infoTip) {
      // console.log("setInfoTipState", state);
      this.infoTip.setState(state);
    }
  },

  showInfoTip(infoTip, target, x, y, rangeParent, rangeOffset) {
    var scrollParent = Lib.getOverflowParent(target);
    var scrollX = x + (scrollParent ? scrollParent.scrollLeft : 0);

    // Distribute event to all registered listeners and show the info tip if
    // any of them return true.
    var result = Lib.dispatch2(this.listeners, "showInfoTip",
      [infoTip, target, scrollX, y, rangeParent, rangeOffset]);

    if (result) {
      unmountComponentAtNode(infoTip);
      render(result.element, infoTip);

      var htmlElt = infoTip.ownerDocument.documentElement;
      var panelWidth = htmlElt.clientWidth;
      var panelHeight = htmlElt.clientHeight;

      const style = {};

      if (x + infoTip.offsetWidth + this.infoTipMargin >
        panelWidth - this.infoTipWindowPadding) {
        style.left = "auto";
        style.right = ((panelWidth - x) + this.infoTipMargin) + "px";
      } else {
        style.left = (x + this.infoTipMargin) + "px";
        style.right = "auto";
      }

      if (y + infoTip.offsetHeight + this.infoTipMargin > panelHeight) {
        style.top = Math.max(0,
          panelHeight - (infoTip.offsetHeight + this.infoTipMargin)) + "px";
        style.bottom = "auto";
      } else {
        style.top = (y + this.infoTipMargin) + "px";
        style.bottom = "auto";
      }

      infoTip.style.top = style.top;
      infoTip.style.left = style.left;
      infoTip.style.right = style.right;
      infoTip.style.bottom = style.bottom;

      this.setInfoTipState({
        active: true,
        multiline: result.multiline
      });
    } else {
      this.setInfoTipState({
        active: false
      });
    }
  },

  addListener(listener) {
    this.listeners.push(listener);
  },

  removeListener(listener) {
    Lib.remove(this.listeners, listener);
  },

  mousemove(e) {
    var x = e.clientX;
    var y = e.clientY;
    this.showInfoTip(this.infoTipDom, e.target, x, y, e.rangeParent, e.rangeOffset);
  },

  mouseout(e) {
    if (!e.relatedTarget) {
      this.setInfoTipState({
        active: false
      });
    }
  },

  render() {
    return (
      <div ref={ref => this.holder = ref}>
        {this.props.children}
        <InfoTip ref={ref => this.infoTip = ref} onRef={ref => this.infoTipDom = ref} />
      </div>
    );
  }
});

InfoTipHolder.childContextTypes = {
  infoTipHolder: React.PropTypes.object
};

export default InfoTipHolder;

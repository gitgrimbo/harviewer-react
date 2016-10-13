import React from "react";

export default React.createClass({
  displayName: "InfoTip",

  propTypes: {
    children: React.PropTypes.node,
    onRef: React.PropTypes.func
  },

  getInitialState() {
    return {
      active: false,
      multiline: false
    };
  },

  setActiveAttr(ref) {
    ref.setAttribute("active", this.state.active);
    // There is no background image for mulitline tooltips.
    ref.setAttribute("multiline", this.state.multiline);
  },

  componentDidMount() {
    this.setActiveAttr(this.infoTip);
    if (this.props.onRef) {
      this.props.onRef(this.infoTip);
    }
  },

  componentWillUpdate(nextProps, nextState) {
    this.setActiveAttr(this.infoTip);
  },

  render() {
    return (
      <div className="infoTip" ref={ref => this.infoTip = ref}>
        {this.props.children}
      </div>
    );
  }
});

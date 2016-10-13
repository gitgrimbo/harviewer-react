import React from "react";

import homeHtml from "raw!tabs/homeTab.html";

export default React.createClass({
  displayName: "tabs/HomeTab",

  propTypes: {
    requestTabChange: React.PropTypes.func
  },

  componentDidMount() {
    const el = this.refs.homeBody;
    $(el).on("click", ".example", this.onExampleClick);
    $(el).on("click", ".linkAbout", this.onAboutClick);
  },

  componentWillUnmount() {
    const el = this.refs.homeBody;
    $(el).off("click", ".example", this.onExampleClick);
    $(el).off("click", ".linkAbout", this.onAboutClick);
  },

  onExampleClick(e) {
    const target = e.target;
    const har = target.getAttribute("har");
    const href = window.location.href;
    const index = href.indexOf("?");
    window.location = href.substr(0, index) + "?har=" + har;
  },

  onAboutClick(e) {
    this.props.requestTabChange("About");
  },

  render() {
    return (
      <div ref="homeBody" className="homeBody" dangerouslySetInnerHTML={{ __html: homeHtml }}></div>
    );
  }
});

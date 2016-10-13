import React, { Component } from "react";
import PropTypes from "prop-types";

import AppContext from "../AppContext";
import homeHtml from "raw-loader!./homeTab.html";

// TODO Move me
if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector;
}

function on(e, selector, listener) {
  const { target } = e;
  if (target.matches(selector)) {
    listener.call(null, e);
  }
}

export class HomeTab extends Component {
  constructor(props) {
    super(props);
    this.ref = React.createRef();
  }

  componentDidMount() {
    this.validate = this.ref.current.querySelector("#validate");
    this.validate.checked = this.context.validate;
  }

  componentWillUnmount() {
    this.validate = null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.validate.checked = this.context.validate;
  }

  onClick = (e) => {
    on(e, ".example", this.onExampleClick);
    on(e, ".linkAbout", this.onAboutClick);
    on(e, "#appendPreview", this.onPreviewClick);
    on(e, "#validate", this.onValidateClick);
  }

  onExampleClick = (e) => {
    e.preventDefault();
    const { target } = e;
    const har = target.getAttribute("har");
    const href = window.location.href;
    const page = href.split("?")[0];
    window.location = page + "?har=" + har;
  }

  onAboutClick = (e) => {
    e.preventDefault();
    this.props.requestTabChange("About");
  }

  onPreviewClick = (e) => {
    const json = document.getElementById("sourceEditor").value;
    const { appendPreview } = this.props;
    appendPreview(json);
  }

  onValidateClick = (e) => {
    e.stopPropagation();
    const checked = e.target.checked;
    const { setValidate } = this.context;
    setValidate(checked);
  }

  render() {
    return (
      <div
        className="homeBody"
        ref={this.ref}
        onClick={this.onClick}
        dangerouslySetInnerHTML={{ __html: homeHtml }}
      ></div>
    );
  }
};

HomeTab.propTypes = {
  appendPreview: PropTypes.func,
  requestTabChange: PropTypes.func,
};

HomeTab.contextType = AppContext;

export default HomeTab;

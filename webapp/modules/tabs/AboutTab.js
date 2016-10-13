import React, { Component } from "react";
import PropTypes from "prop-types";

import aboutHtml from "raw-loader!./aboutTab.html";

class AboutTab extends Component {
  replace(s, pattern, replaceWith) {
    if (!replaceWith) {
      return s;
    }
    return s.replace(new RegExp(pattern, "g"), replaceWith);
  }

  render() {
    let { version, harSpecURL, harViewerDemoUrl } = this.props;
    if (!harSpecURL) {
      harSpecURL = "http://www.softwareishard.com/blog/har-12-spec/";
    }

    let html = aboutHtml;
    html = this.replace(html, "@VERSION@", version);
    html = this.replace(html, "@HAR_SPEC_URL@", harSpecURL);
    html = this.replace(html, "@HARVIEWER_DEMO_URL@", harViewerDemoUrl);

    return (
      <div className="aboutBody" dangerouslySetInnerHTML={{ __html: html }}></div>
    );
  }
}

AboutTab.propTypes = {
  version: PropTypes.string,
  harSpecURL: PropTypes.string,
  harViewerDemoUrl: PropTypes.string,
};

export default AboutTab;

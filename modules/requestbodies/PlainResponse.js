import React from "react";
import PropTypes from "prop-types";

import * as Str from "../core/string";

class PlainResponse extends React.Component {
  render() {
    const { entry } = this.props;
    const { text } = entry.response.content;

    return (
      <div className="netInfoResponseText netInfoText">
        <pre>
          {Str.wrapText(text, true)}
        </pre>
      </div>
    );
  }
}

PlainResponse.canShowEntry = function(entry) {
  return (entry.response.content.text && entry.response.content.text.length > 0);
};

PlainResponse.propTypes = {
  entry: PropTypes.object,
};

export default PlainResponse;

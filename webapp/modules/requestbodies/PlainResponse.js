import React from "react";
import * as Str from "core/string";

export default React.createClass({
  displayName: "requestbodies/PlainResponse",

  propTypes: {
    entry: React.PropTypes.object
  },

  render() {
    const { entry } = this.props;

    var text = entry.response.content.text;

    return (
      <div className="netInfoResponseText netInfoText">
        <pre>
          {Str.wrapText(text, true)}
        </pre>
      </div>
    );
  }
});

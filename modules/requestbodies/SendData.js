import React from "react";
import PropTypes from "prop-types";

import * as Arr from "../core/array";
import ParamRow from "./ParamRow";

class SendData extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { entry } = this.props;
    const { postData } = entry.request;
    if (!postData) {
      return null;
    }

    let content = null;
    if (postData.mimeType === "application/x-www-form-urlencoded") {
      content = (
        <table className="netInfoPostTable" cellPadding="0" cellSpacing="0">
          <tbody>
            {postData.params.map((param, i) => <ParamRow key={i} name={param.name} value={param.value} />)}
          </tbody>
        </table>
      );
    } else {
      // TODO
      content = postData.text;
    }
    return (
      <div className="netInfoPostText netInfoText">
        {content}
      </div>
    );
  }
};

SendData.propTypes = {
  entry: PropTypes.object,
};

SendData.canShowEntry = function(entry) {
  const { postData } = entry.request;
  if (!postData) {
    // No post data at all.
    return false;
  }

  const paramsMissing = !Arr.isArray(postData.params) || (postData.params.length === 0);
  const textMissing = !postData.text;

  const postContentMissing = paramsMissing && textMissing;

  if (postContentMissing) {
    // (at least) Firefox 47 exports GET requests in HARs that have:
    //   postData.mimeType = ""
    //   postData.params = []
    //   postData.text = ""
    // So double-check for this and only allow such 'empty' postData for PUT and POST
    return ["PUT", "POST"].indexOf(entry.request.method) > -1;
  }

  return true;
};

export default SendData;

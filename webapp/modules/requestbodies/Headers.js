import React from "react";
import * as Str from "core/string";

function getParamValue(value) {
  // This value is inserted into PRE element and so, make sure the HTML isn't escaped (1210).
  // This is why the second parameter is true.
  // The PRE element preserves whitespaces so they are displayed the same, as they come from
  // the server (1194).
  return Str.wrapText(value, true);
}

const ParamRow = props => {
  return (
    <tr>
      <td className="netInfoParamName">{props.name}</td>
      <td className="netInfoParamValue"><pre>{getParamValue(props.value)}</pre></td>
    </tr>
  );
};

ParamRow.propTypes = {
  name: React.PropTypes.string,
  value: React.PropTypes.string
};

const TitleRow = props => {
  return (
    <tr className={"netInfo" + props.titleType + "HeadersTitle"}>
      <td colSpan="2"><div className="netInfoHeadersGroup ">{props.title}</div></td>
    </tr>
  );
};

TitleRow.propTypes = {
  title: React.PropTypes.string,
  titleType: React.PropTypes.string
};

export default React.createClass({
  displayName: "requestbodies/Headers",

  propTypes: {
    entry: React.PropTypes.object
  },

  render() {
    const { entry } = this.props;

    return (
      <table cellPadding="0" cellSpacing="0" className="netInfoHeadersText netInfoText netInfoHeadersTable ">
        <tbody>
          <TitleRow titleType="Response" title="Response Headers" />
          {
            entry.response.headers.map((header, i) =>
              <ParamRow key={i} name={header.name} value={header.value} />
            )
          }
          <TitleRow titleType="Request" title="Request Headers" />
          {
            entry.request.headers.map((header, i) =>
              <ParamRow key={i} name={header.name} value={header.value} />
            )
          }
        </tbody>
      </table>
    );
  }
});

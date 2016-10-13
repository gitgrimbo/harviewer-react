import React from "react";
import PropTypes from "prop-types";

import * as Str from "../core/string";

function getParamValue(value) {
  // This value is inserted into PRE element and so, make sure the HTML isn't escaped (1210).
  // This is why the second parameter is true.
  // The PRE element preserves whitespaces so they are displayed the same, as they come from
  // the server (1194).
  return Str.wrapText(value, true);
}

const ParamRow = (props) => {
  return (
    <tr>
      <td className="netInfoParamName">{props.name}</td>
      <td className="netInfoParamValue"><pre>{getParamValue(props.value)}</pre></td>
    </tr>
  );
};

ParamRow.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
};

export default ParamRow;

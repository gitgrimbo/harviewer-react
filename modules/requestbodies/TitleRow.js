import React from "react";
import PropTypes from "prop-types";

const TitleRow = (props) => {
  return (
    <tr className={"netInfo" + props.titleType + "Title"}>
      <td colSpan="2"><div className="netInfoHeadersGroup ">{props.title}</div></td>
    </tr>
  );
};

TitleRow.propTypes = {
  title: PropTypes.string,
  titleType: PropTypes.string,
};

export default TitleRow;

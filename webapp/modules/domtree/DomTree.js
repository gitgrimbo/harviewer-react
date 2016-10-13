import React from "react";

function paddingLeft(padding) {
  return {
    paddingLeft: padding + "px"
  };
}

const ObjectBox = props => {
  const trClassName = [
    "memberRow",
    "domRow",
    props.hasChildren ? "hasChildren" : "",
    props.opened ? " opened" : ""
  ].join(" ");
  const objectBoxClassName = "objectBox objectBox-" + props.type;
  return (
    <tr level={props.level} className={trClassName}>
      <td style={paddingLeft(props.level * 16)} className="memberLabelCell">
        <span className="memberLabel domLabel">{props.objectKey}</span>
      </td>
      <td className="memberValueCell">
        <div className={objectBoxClassName}>{props.getDisplayString(props.objectValue)}</div>
      </td>
    </tr>
  );
};
ObjectBox.propTypes = {
  hasChildren: React.PropTypes.boolean,
  opened: React.PropTypes.boolean,
  level: React.PropTypes.number,
  objectKey: React.PropTypes.string,
  objectValue: React.PropTypes.object,
  type: React.PropTypes.string,
  getDisplayString: React.PropTypes.func.isRequired
};

const ObjectBoxString = props => {
  const props2 = Object.assign({}, {
    type: "string",
    getDisplayString: value => value
  }, props);
  return <ObjectBox { ...props2 } />;
};
ObjectBoxString.propTypes = {};

const ObjectBoxObject = props => {
  const props2 = Object.assign({}, {
    type: "object",
    getDisplayString: value => "Object",
    hasChildren: Object.keys(props.objectValue[props.objectKey]).length > 0
  }, props);
  return <ObjectBox { ...props2 } />;
};
ObjectBoxObject.propTypes = {
  objectKey: React.PropTypes.string,
  objectValue: React.PropTypes.object
};

const ObjectBoxArray = props => {
  const props2 = Object.assign({}, {
    type: "array",
    getDisplayString: value => `Array[$value.length]`,
    hasChildren: props.objectValue[props.objectKey].length > 0
  }, props);
  return <ObjectBox { ...props2 } />;
};
ObjectBoxArray.propTypes = {
  objectKey: React.PropTypes.string,
  objectValue: React.PropTypes.object
};

export default React.createClass({
  displayName: "DomTree",

  propTypes: {
    model: React.PropTypes.object
  },

  render() {
    const { model } = this.props;
    const har = model.input;
    return (
      <table cellPadding="0" cellSpacing="0" className="domTable">
        <tbody>
          <ObjectBoxObject level={0} objectKey="log" objectValue={har} />
        </tbody>
      </table>
    );
  }
});

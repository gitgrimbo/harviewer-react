import React from "react";
import PropTypes from "prop-types";

export const Button = (props) => {
  return (
    <span
      ref={props.buttonRef}
      title={props.title}
      className="toolbarButton text"
      onClick={props.command}>
      {props.children}
    </span>
  );
};

Button.propTypes = {
  buttonRef: PropTypes.string,
  children: PropTypes.node,
  command: PropTypes.func,
  title: PropTypes.string,
};

class Toolbar extends React.Component {
  createToolbarItems(children) {
    const style = { color: "gray" };
    return children.reduce((items, child, i) => {
      if (items.length > 0) {
        const span = <span key={"toolbarSeparator" + i} style={style} className="toolbarSeparator ">|</span>;
        items.push(span);
      }
      items.push(child);
      return items;
    }, []);
  }

  render() {
    let { children } = this.props;
    if (!Array.isArray(children)) {
      children = [children];
    }
    return (
      <div className="toolbar ">
        {this.createToolbarItems(children || [])}
      </div>
    );
  }
}

Toolbar.propTypes = {
  children: PropTypes.node,
};

export default Toolbar;

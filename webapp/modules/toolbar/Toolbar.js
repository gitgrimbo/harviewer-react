import React from "react";

export const Button = props => {
  return (
    <span
      ref={props.buttonRef}
      title={props.title}
      className="toolbarButton text"
      onClick={props.command}
      >
      {props.children}
    </span>
  );
};

Button.propTypes = {
  buttonRef: React.PropTypes.string,
  children: React.PropTypes.node,
  command: React.PropTypes.func,
  title: React.PropTypes.string
};

export default React.createClass({
  displayName: "",

  propTypes: {
    children: React.PropTypes.array
  },

  createToolbarButton(title, text) {
    const props = { title, text };
    return <Button {...props} />;
  },
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
  },

  render() {
    return (
      <div className="toolbar ">
        {this.createToolbarItems(this.props.children || [])}
      </div>
    );
  }
});

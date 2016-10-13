import React from "react";

export default React.createClass({
  displayName: "tabview/Tab",

  propTypes: {
    content: React.PropTypes.node,
    id: React.PropTypes.string,
    label: React.PropTypes.string,
    onSelect: React.PropTypes.func,
    selected: React.PropTypes.bool,
    title: React.PropTypes.string
  },

  updateSelected() {
    const { id, selected } = this.props;
    this.refs.dom.setAttribute("selected", selected);
    this.refs.dom.setAttribute("view", id);
  },

  componentDidMount() {
    this.updateSelected();
  },

  componentDidUpdate() {
    this.updateSelected();
  },

  render() {
    const { title, id, label, content, onSelect } = this.props;
    return (
      <a data-id={id} title={title || id} className={id + "Tab tab"} onClick={onSelect} ref="dom">
        {content || label || id}
      </a>
    );
  }
});

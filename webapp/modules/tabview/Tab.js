import React from "react";
import PropTypes from "prop-types";

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.linkRef = React.createRef();
  }

  updateSelected() {
    const { id, selected } = this.props;
    this.linkRef.current.setAttribute("selected", selected);
    this.linkRef.current.setAttribute("view", id);
  }

  componentDidMount() {
    this.updateSelected();
  }

  componentDidUpdate() {
    this.updateSelected();
  }

  render() {
    const { title, id, label, content, onSelect, selected } = this.props;
    return (
      <a data-id={id} title={title || id} className={id + "Tab tab" + (selected ? " selected" : "")} onClick={onSelect} ref={this.linkRef}>
        {content || label || id}
      </a>
    );
  }
};

Tab.propTypes = {
  content: PropTypes.node,
  id: PropTypes.string,
  label: PropTypes.string,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  title: PropTypes.string,
};

export default Tab;

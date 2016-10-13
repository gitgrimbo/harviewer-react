import React, { Component } from "react";
import PropTypes from "prop-types";

class SearchBox extends Component {
  state = {
    searchValue: "",
    status: null,
  };

  onChange = (e) => {
    const text = e.target.value;
    this.setState({
      searchValue: text,
    });
  }

  onKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      this.search(e.target.value);
    }
  }

  search(text) {
    const result = this.props.search(text);
    this.setState({
      status: result ? null : "notfound",
    });
  }

  render() {
    const { status } = this.state;
    const { placeholder = "Search" } = this.props;
    return (
      <span className="searchBox">
        <span className="toolbarSeparator resizer">&nbsp;</span>
        <span className="searchTextBox">
          <input
            type="text"
            placeholder={placeholder}
            className="searchInput"
            status={status}
            value={this.state.searchValue}
            onChange={this.onChange}
            onKeyPress={this.onKeyPress}
          />
          <span className="arrow">&nbsp;</span>
        </span>
      </span>
    );
  }
}

SearchBox.propTypes = {
  search: PropTypes.func,
  placeholder: PropTypes.string,
};

export default SearchBox;

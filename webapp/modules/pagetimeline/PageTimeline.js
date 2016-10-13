import React, { Component } from "react";
import PropTypes from "prop-types";

import PageTimelineCol from "./PageTimelineCol";
import PageDescContainer from "./PageDescContainer";
import PageTimelineTable from "./PageTimelineTable";


const forEachPage = (harModels, callback, opts = {
  collectResults: true,
}) => {
  const results = [];
  let pageIdx = 0;
  harModels.forEach((harModel) => {
    harModel.getPages().forEach((page) => {
      const result = callback(harModel, page, pageIdx++);
      if (opts.collectResults) {
        results.push(result);
      }
    });
  });
  return results;
};


/**
* State helper for PageTimeline. Keeps track of selected pages.
*/
class SelectedPages {
  constructor(harModels, setState) {
    this.harModels = harModels;
    this.setState = setState;
  }

  onPageClick(selectedHarModel, selectedPage, toggle = false, range = false) {
    const { harModels, setState } = this;

    const newSelectedPages = (selectedPages) => {
      if (toggle) {
        return forEachPage(harModels, (harModel, page, pageIdx) =>
          (page === selectedPage) ? !selectedPages[pageIdx] : selectedPages[pageIdx]
        );
      }
      if (range) {
        const firstSelected = selectedPages.findIndex(Boolean);
        let found = false;
        return forEachPage(harModels, (harModel, page, pageIdx) => {
          if (page === selectedPage) {
            found = true;
            return true;
          }
          return !found && (pageIdx >= firstSelected);
        });
      }
      // basic selection of a single page
      return forEachPage(harModels, (harModel, page) => page === selectedPage);
    };

    return new Promise((resolve, reject) => {
      setState(({ selectedPages: prevSelectedPages }) => ({
        selectedPages: newSelectedPages(prevSelectedPages),
      }), resolve);
    });
  }
}


class PageTimeline extends Component {
  constructor(...args) {
    super(...args);

    const { harModels } = this.props;
    this.selectedPages = new SelectedPages(harModels, this.setState.bind(this));

    this.state = {
      mouseOverNumEntries: null,
      mouseOverPage: null,
      selectedPages: [],
    };
  }

  onPageTimelineColClick = async (e, selectedHarModel, selectedPage) => {
    // update the selection
    const togglePage = e.ctrlKey;
    const addRange = e.shiftKey;
    await this.selectedPages.onPageClick(selectedHarModel, selectedPage, togglePage, addRange);

    // call onPageSelection if it exists
    const { harModels, onPageSelection } = this.props;
    onPageSelection && onPageSelection(
      forEachPage(harModels,
        (harModel, page, pageIdx) => {
          if (this.state.selectedPages[pageIdx]) {
            return {
              harModel,
              page,
              pageIdx,
            };
          }
          return null;
        })
        .filter(Boolean)
    );
  }

  onPageTimelineColMouseOver = (e, selectedHarModel, selectedPage) => {
    this.setState({
      mouseOverPage: selectedPage,
      mouseOverNumEntries: (selectedHarModel.getPageEntries(selectedPage) || []).length,
    });
  }

  max(arr, supplier, startValue = 0) {
    return arr.reduce((max, it) => Math.max(supplier ? supplier(it) : it, max), startValue);
  }

  pagesMaxLoadTime(pages) {
    return this.max(pages, (page) => page.pageTimings.onLoad);
  }

  harModelsMaxLoadTime(harModels) {
    return this.max(harModels, (harModel) => this.pagesMaxLoadTime(harModel.getPages()));
  }

  render() {
    const { harModels = [] } = this.props;

    let currentPageIdx = 0;
    const maxLoadTime = this.harModelsMaxLoadTime(harModels);

    const pageTimelineCols = harModels.reduce((cols, harModel, modelIdx) => {
      const pages = harModel.getPages();
      const newCols = pages
        .map((page, pageIdx) =>
          <PageTimelineCol
            key={`PageTimelineCol.${modelIdx}.${pageIdx}`}
            page={page}
            maxElapsedTime={maxLoadTime}
            selected={this.state.selectedPages[currentPageIdx++]}
            onClick={(e) => this.onPageTimelineColClick(e, harModel, page)}
            onMouseOver={(e) => this.onPageTimelineColMouseOver(e, harModel, page)}
          />
        );
      return cols.concat(newCols);
    }, []);

    const { mouseOverNumEntries, mouseOverPage } = this.state;

    return (
      <div style={{ height: "auto" }} className="pageTimelineBody   opened ">
        <table style={{ margin: "7px" }} cellPadding="0" cellSpacing="0" className=" ">
          <tbody className=" ">
            <tr className=" ">
              <td className=" ">
                <PageTimelineTable pageTimelineCols={pageTimelineCols} />
              </td>
            </tr>
            <tr className=" ">
              <td colSpan="2" className="pageDescContainer ">
                <PageDescContainer page={mouseOverPage} numEntries={mouseOverNumEntries} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

PageTimeline.propTypes = {
  harModels: PropTypes.array,
  onPageSelection: PropTypes.func,
};

export default PageTimeline;

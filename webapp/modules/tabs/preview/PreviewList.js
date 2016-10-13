import React from "react";
import PropTypes from "prop-types";

import ValidationError from "./ValidationError";
import NetTable from "../../nettable/NetTable";
import PageTable from "../../pagetable/PageTable";

import AppContext from "../../AppContext";

class PreviewList extends React.Component {
  findPagelessEntries(har) {
    const { pages, entries } = har.log;

    let pageIds = {};
    if (pages && pages.length > 0) {
      pageIds = pages.reduce((ids, page) => {
        if (page.id) {
          ids[page.id] = 1;
        }
        return ids;
      }, {});
    } else {
      // No pages, so all entries are pageless
      return entries;
    }

    if (entries && entries.length > 0) {
      return entries.filter((e) => {
        if (!e.pageref) {
          // pageless
          return true;
        }
        // pageless if there isn't a matching page.id
        return !pageIds || !pageIds[e.pageref];
      });
    }

    return null;
  }

  render() {
    const { harModels, errors } = this.props;
    const { expandAll } = this.context;

    return (
      <div className="previewList">
        {
          harModels.map((model, i) => {
            const pageTable = <PageTable key={"PageTable" + i} model={model} expandAll={expandAll} />;

            // If there are pageless entries in the HAR, show them in a standalone NetTable
            const pagelessEntries = this.findPagelessEntries(model.input);
            if (pagelessEntries && pagelessEntries.length > 0) {
              const netTable = <NetTable key={"NetTable" + i} model={model} entries={pagelessEntries} />;
              return [netTable, pageTable];
            }

            return pageTable;
          })
        }
        {
          (errors || []).map((error, i) => <ValidationError key={i} error={error} />)
        }
      </div>
    );
  }
}

PreviewList.propTypes = {
  harModels: PropTypes.array,
  errors: PropTypes.array,
};

PreviewList.contextType = AppContext;

export default PreviewList;

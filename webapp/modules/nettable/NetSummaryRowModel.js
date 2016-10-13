import HarModel from "preview/harModel";
import * as Date_ from "core/date";

export function summarizeEntries(entries) {
  let cachedSize = 0;
  let totalTransferredSize = 0;
  let totalUncompressedSize = 0;

  let fileCount = 0;
  let minTime = 0;
  let maxTime = 0;

  for (let i = 0; i < entries.length; i++) {
    let file = entries[i];
    let startedDateTime = Date_.parseISO8601(file.startedDateTime);

    ++fileCount;

    let transferredSize = HarModel.getEntryTransferredSize(file);
    let uncompressedSize = HarModel.getEntryUncompressedSize(file);

    totalTransferredSize += transferredSize;
    totalUncompressedSize += uncompressedSize;

    if (HarModel.isCachedEntry(file)) {
      cachedSize += uncompressedSize;
    }

    if (!minTime || startedDateTime < minTime) {
      minTime = startedDateTime;
    }

    let fileEndTime = startedDateTime + file.time;
    if (fileEndTime > maxTime) {
      maxTime = fileEndTime;
    }
  }

  let totalTime = maxTime - minTime;
  return {
    cachedSize,
    totalUncompressedSize,
    totalTransferredSize,
    totalTime,
    fileCount
  };
}

export function calculateSummaryInfo(page, entries) {
  let summaryInfo = summarizeEntries(entries);
  summaryInfo.onLoadTime = 0;
  if (page) {
    summaryInfo.onLoadTime = page.pageTimings.onLoad;
  }
  return summaryInfo;
}

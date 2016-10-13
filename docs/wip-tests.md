# General questions

- Is there a simple way for test fixture HTML pages to support both old and new?
  - Unlikely as they import different resources. e.g.:
    - old - jquery/requirejs/old harviewer
    - new - jquery/vendor.js/main.js/prismjs

## testRemoveTab

Reasons for failure
- test page `testRemoveTabIndex.html` is legacy, doesn't import hv-react in the new way.

## testHideTabBar

Reasons for failure
- test page `testHideTabBarIndex.html` is legacy, doesn't import hv-react in the new way.

## testShowStatsAndTimeline

Reasons for failure
- test page `testShowStatsAndTimelineIndex.html` is legacy, doesn't import hv-react in the new way.

## testCustomPageTiming

Reasons for failure
- test page `testCustomPageTimingIndex.html` is legacy, doesn't import hv-react in the new way.

## testPhases

Reasons for failure
- phases aren't supported yet in hv-react.

## testLoadHarAPI

Reasons for failure
- test pages `testLoadHarAPIViewer.html`, `testLoadArchives.html`, `testLoadHarAPIPreview.html` is legacy, doesn't import hv-react in the new way.

## testCustomizeColumns

Reasons for failure
- test pages `testCustomizeColumnsPage.html`, `testCustomizeColumnsPage2.html`, `testCustomizeColumnsPage3.html` is legacy, doesn't import hv-react in the new way.

# Failing tests

```
Total: [✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓××××××✓] 144/144
Passed: 128  Failed: 16   Skipped: 0

Chr 71 Win: [✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓✓××××××✓] 144/144, 16 fail

× chrome 71.0.3578.80 on Windows NT - testRemoveTab - testRemoveTab
× chrome 71.0.3578.80 on Windows NT - testHideTabBar - testHideTabBar
× chrome 71.0.3578.80 on Windows NT - testShowStatsAndTimeline - testShowStatsAndTimeline
× chrome 71.0.3578.80 on Windows NT - testCustomPageTiming - testCustomPageTiming
× chrome 71.0.3578.80 on Windows NT - testPhases - testPhases
× chrome 71.0.3578.80 on Windows NT - testLoadHarAPI - testViewer
× chrome 71.0.3578.80 on Windows NT - testLoadHarAPI - testViewer loadArchives
× chrome 71.0.3578.80 on Windows NT - testLoadHarAPI - testPreview
× chrome 71.0.3578.80 on Windows NT - testCustomizeColumns - 1
× chrome 71.0.3578.80 on Windows NT - testCustomizeColumns - 2
× chrome 71.0.3578.80 on Windows NT - testCustomizeColumns - 3
× chrome 71.0.3578.80 on Windows NT - testSearchHAR - testSearchHAR
× chrome 71.0.3578.80 on Windows NT - testPreviewExpand - testExpandSinglePage
× chrome 71.0.3578.80 on Windows NT - testPreviewExpand - testExpandMultiplePages
× chrome 71.0.3578.80 on Windows NT - testPreviewExpand - testExpandByDefault
× chrome 71.0.3578.80 on Windows NT - testSearchJsonQuery - testSearchJsonQuery
```

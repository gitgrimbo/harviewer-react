/* See license.txt for terms of usage */

define([
    "../core/date",
    "./harModel",
], function(Date_, HarModel) {

    /**
     * @object This object represents a phase that joins related requests into groups (phases).
     */
    function Phase(file) {
        this.files = [];
        this.pageTimings = [];

        this.addFile(file);
    }

    Phase.prototype = {
        addFile: function(file) {
            this.files.push(file);
            file.phase = this;
        },

        getLastStartTime: function() {
            // The last request start time.
            return this.files[this.files.length - 1].startedDateTime;
        },
    };

    /***/
    function updateLayout(input, page, phaseInterval, fileVisitor, isManualBreak, breakLayout) {
        /***/
        function startPhase(file) {
            var phase = new Phase(file);
            phases.push(phase);
            return phase;
        }

        var requests = HarModel.getPageEntries(input, page);

        var phases = [];

        var phase = null;

        var pageStartedDateTime = page ? Date_.parseISO8601(page.startedDateTime) : null;

        // The onLoad time stamp is used for proper initialization of the first phase. The first
        // phase contains all requests till onLoad is fired (even if there are time gaps).
        // Don't worry if it
        var onLoadTime = (page && page.pageTimings) ? page.pageTimings.onLoad : -1;

        // The timing could be NaN or -1. In such case keep the value otherwise
        // make the time absolute.
        if (onLoadTime > 0) {
            onLoadTime += pageStartedDateTime;
        }

        // Iterate over all requests and create phases.
        for (var i = 0; i < requests.length; i++) {
            var file = requests[i];

            fileVisitor(file);

            // If the parent page doesn't exists get startedDateTime of the
            // first request.
            if (!pageStartedDateTime) {
                pageStartedDateTime = Date_.parseISO8601(file.startedDateTime);
            }

            var startedDateTime = Date_.parseISO8601(file.startedDateTime);
            var phaseLastStartTime = phase ? Date_.parseISO8601(phase.getLastStartTime()) : 0;
            var phaseEndTime = phase ? phase.endTime : 0;

            // New phase is started if:
            // 1) There is no phase yet.
            // 2) There is a gap between this request and the last one.
            // 3) The new request is not started during the page load.
            var newPhase = false;
            if (phaseInterval >= 0) {
                newPhase = (startedDateTime > onLoadTime) &&
                    ((startedDateTime - phaseLastStartTime) >= phaseInterval) &&
                    (startedDateTime + file.time >= phaseEndTime + phaseInterval);
            }

            // 4) The file can be also marked with breakLayout
            var manualBreak = isManualBreak(file);
            if (typeof manualBreak === "boolean") {
                if (!phase || manualBreak) {
                    phase = startPhase(file);
                } else {
                    phase.addFile(file);
                }
            } else {
                if (!phase || newPhase) {
                    phase = startPhase(file);
                } else {
                    phase.addFile(file);
                }
            }

            // For CSS (visual separator between two phases). Except of the first file
            // in the first phase.
            if (phases[0] !== phase) {
                breakLayout(file, phase.files[0] === file);
            }

            if ("number" !== typeof phase.startTime || phase.startTime > startedDateTime) {
                phase.startTime = startedDateTime;
            }

            // file.time represents total elapsed time of the request.
            if ("number" !== typeof phase.endTime || phase.endTime < startedDateTime + file.time) {
                phase.endTime = startedDateTime + file.time;
            }
        }

        return phases;
    }

    /***/
    function calculatePageTimings(page, file, phase, phaseElapsed) {
        // Obviously we need a page object for page timings.
        if (!page) {
            return;
        }

        var pageStart = Date_.parseISO8601(page.startedDateTime);

        // Iterate all timings in this phase and generate offsets (px position in the timeline).
        for (var i = 0; i < phase.pageTimings.length; i++) {
            var time = phase.pageTimings[i].time;
            if (time > 0) {
                var timeOffset = pageStart + time - phase.startTime;
                var barOffset = ((timeOffset / phaseElapsed) * 100).toFixed(3);
                phase.pageTimings[i].offset = barOffset;
            }
        }
    }

    /***/
    function summarizePhase(phase) {
        var cachedSize = 0;
        var totalTransferredSize = 0;
        var totalUncompressedSize = 0;

        var fileCount = 0;
        var minTime = 0;
        var maxTime = 0;

        for (var i = 0; i < phase.files.length; i++) {
            var file = phase.files[i];
            var startedDateTime = Date_.parseISO8601(file.startedDateTime);

            ++fileCount;

            var transferredSize = HarModel.getEntryTransferredSize(file);
            var uncompressedSize = HarModel.getEntryUncompressedSize(file);

            totalTransferredSize += transferredSize;
            totalUncompressedSize += uncompressedSize;

            if (HarModel.isCachedEntry(file)) {
                cachedSize += uncompressedSize;
            }

            if (!minTime || startedDateTime < minTime) {
                minTime = startedDateTime;
            }

            var fileEndTime = startedDateTime + file.time;
            if (fileEndTime > maxTime) {
                maxTime = fileEndTime;
            }
        }

        var totalTime = maxTime - minTime;
        return {
            cachedSize: cachedSize,
            totalUncompressedSize: totalUncompressedSize,
            totalTransferredSize: totalTransferredSize,
            totalTime: totalTime,
            fileCount: fileCount,
        };
    }

    /***/
    function calculateSummaries(phases) {
        var fileCount = 0;
        var totalTransferredSize = 0;
        var totalUncompressedSize = 0;
        var cachedSize = 0;
        var totalTime = 0;

        for (var i = 0; i < phases.length; ++i) {
            var phase = phases[i];
            phase.invalidPhase = false;

            var summary = summarizePhase(phase);
            fileCount += summary.fileCount;
            totalTransferredSize += summary.totalTransferredSize;
            totalUncompressedSize += summary.totalUncompressedSize;
            cachedSize += summary.cachedSize;
            totalTime += summary.totalTime;
        }

        return {
            fileCount: fileCount,
            totalTransferredSize: totalTransferredSize,
            totalUncompressedSize: totalUncompressedSize,
            cachedSize: cachedSize,
            totalTime: totalTime,
        };
    }

    return {
        calculatePageTimings: calculatePageTimings,
        calculateSummaries: calculateSummaries,
        updateLayout: updateLayout,
    };
});

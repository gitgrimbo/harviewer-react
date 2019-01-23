import HarModel from "../preview/harModel";
import * as Date_ from "../core/date";

/**
 * @object This object represents a phase that joins related requests into groups (phases).
 */
export class Phase {
  constructor(file) {
    this.files = [];
    this.pageTimings = [];
    this.addFile(file);
  }

  addFile(file) {
    this.files.push(file);
  }

  getLastStartTime() {
    // The last request start time.
    return this.files[this.files.length - 1].startedDateTime;
  }
}

export class Phases {
  constructor() {
    this.phases = [];
  }

  startPhase(file) {
    const phase = new Phase(file);
    this.phases.push(phase);
    return phase;
  }

  updateTimeStamps(page, timingDefinitions) {
    if (!page) {
      return;
    }

    // Convert registered page timings (e.g. onLoad, DOMContentLoaded) into structures
    // with label information.
    const pageTimings = [];
    for (let i = 0; page.pageTimings && i < timingDefinitions.length; i++) {
      const timing = timingDefinitions[i];
      const eventTime = page.pageTimings[timing.name];
      if (eventTime > 0) {
        pageTimings.push({
          label: timing.name,
          time: eventTime,
          classes: timing.classes,
          comment: timing.description,
        });
      }
    }

    // Get time-stamps generated from console.timeStamp() method (this method has been
    // introduced in Firebug 1.8b3).
    // See Firebug documentation: http://getfirebug.com/wiki/index.php/Console_API
    const timeStamps = page.pageTimings ? page.pageTimings._timeStamps : [];

    // Put together all timing info.
    if (timeStamps) {
      pageTimings.push(...timeStamps);
    }

    // Iterate all existing phases.
    this.phases.forEach((phase, i) => {
      const nextPhase = this.phases[i + 1];

      // Iterate all timings and divide them into phases. This process can extend
      // the end of a phase.
      pageTimings.forEach((stamp) => {
        let time = stamp.time;
        if (!time) {
          return;
        }

        // We need the absolute time.
        const startedDateTime = Date_.parseISO8601(page.startedDateTime);
        time += startedDateTime;

        // The time stamp belongs to the current phase if:
        // 1) It occurs before the next phase started or there is no next phase.
        if (!nextPhase || time < nextPhase.startTime) {
          // 2) It occurs after the current phase started, or this is the first phase.
          if (i === 0 || time >= phase.startTime) {
            // This is the case where the time stamp occurs before the first phase
            // started (shouldn't actually happen since there can't be a stamp made
            // before the first document request).
            if (phase.startTime > time) {
              phase.startTime = time;
            }

            // This is the case where the time stamp occurs after the phase end time,
            // but still before the next phase start time.
            if (phase.endTime < time) {
              phase.endTime = time;
            }

            phase.pageTimings.push({
              classes: stamp.classes ? stamp.classes : "netTimeStampBar",
              name: stamp.label,
              description: stamp.comment,
              time: stamp.time,
            });
          }
        }
      });
    });
  }

  static calculatePhases(input, page, timingDefinitions, phaseInterval, shouldSplitPhasesOnEntry) {
    const phases = new Phases();

    const requests = HarModel.getPageEntries(input, page);

    // The phase interval is customizable through a cookie.
    if (typeof phaseInterval !== "number") {
      phaseInterval = 4000;
    }

    let phase = null;

    let pageStartedDateTime = page ? Date_.parseISO8601(page.startedDateTime) : null;

    // The onLoad time stamp is used for proper initialization of the first phase. The first
    // phase contains all requests till onLoad is fired (even if there are time gaps).
    // Don't worry if it
    let onLoadTime = (page && page.pageTimings) ? page.pageTimings.onLoad : -1;

    // The timing could be NaN or -1. In such case keep the value otherwise
    // make the time absolute.
    if (onLoadTime > 0) {
      onLoadTime += pageStartedDateTime;
    }

    // Iterate over all requests and create phases.
    for (let i = 0; i < requests.length; i++) {
      const file = requests[i];

      // If the parent page doesn't exist get startedDateTime of the first request.
      if (!pageStartedDateTime) {
        pageStartedDateTime = Date_.parseISO8601(file.startedDateTime);
      }

      const startedDateTime = Date_.parseISO8601(file.startedDateTime);
      const phaseLastStartTime = phase ? Date_.parseISO8601(phase.getLastStartTime()) : 0;
      const phaseEndTime = phase ? phase.endTime : 0;

      // New phase is started if:
      // 1) There is no phase yet.
      // 2) There is a gap between this request and the last one.
      // 3) The new request is not started during the page load.
      let newPhase = false;
      if (phaseInterval >= 0) {
        newPhase = (startedDateTime > onLoadTime) &&
          ((startedDateTime - phaseLastStartTime) >= phaseInterval) &&
          (startedDateTime + file.time >= phaseEndTime + phaseInterval);
      }

      if (!newPhase) {
        // 4) The file can be also marked with breakLayout
        newPhase = (typeof shouldSplitPhasesOnEntry === "function") && shouldSplitPhasesOnEntry(file, i);
      }

      if (!phase || newPhase) {
        phase = phases.startPhase(file);
      } else {
        phase.addFile(file);
      }

      if (typeof phase.startTime !== "number" || phase.startTime > startedDateTime) {
        phase.startTime = startedDateTime;
      }

      // file.time represents total elapsed time of the request.
      if (typeof phase.endTime !== "number" || phase.endTime < startedDateTime + file.time) {
        phase.endTime = startedDateTime + file.time;
      }
    }

    phases.updateTimeStamps(page, timingDefinitions);

    return phases;
  }
}

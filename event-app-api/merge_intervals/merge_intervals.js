export function mergeIntervals(events) {
  const merged_intervals = [events[0]];
  for (let i = 1; i < events.length; i++) {
    const currentEvent = events[i];
    const lastMergedEvent = merged_intervals[merged_intervals.length - 1];

    let currentEndTime = currentEvent.endtime;

    if (currentEvent.starttime <= lastMergedEvent.endtime) {
      lastMergedEvent.endtime = Math.max(lastMergedEvent, currentEndTime);
    } else {
      merged_intervals.push(currentEvent);
    }
  }

  return merged_intervals;
}

export function findGaps(mergedIntervals) {
  const gaps = [];
  //this check for gaps in the from the current date and time to the first evnet's starttime
  const currentDate = new Date().getTime() / 1000;
  if (mergedIntervals[0].starttime > currentDate) {
    gaps.push({
      starttime: currentDate,
      endtime: mergedIntervals[0].starttime,
    });
  }

  if (mergedIntervals.length > 1) {
    for (let i = 1; i < mergedIntervals.length; i++) {
      const previousEvent = mergedIntervals[i - 1];
      const currentEvent = mergedIntervals[i];
      const gapStartTime = previousEvent.endtime;
      const gapEndTime = currentEvent.starttime;

      if (gapStartTime < gapEndTime) {
        // Found a gap, add it to the gaps array
        gaps.push({ starttime: gapStartTime, endtime: gapEndTime });
      }
    }
  }
  return gaps;
}

// Function to check if an interval overlaps the other and vice versa
export function isOverlapping(inputedEvent, events) {
  for (eventRange of events) {
    if (inputedEvent.starttime < eventRange.starttime) {
      if (inputedEvent.endtime > eventRange.starttime) return true;
    } else {
      if (inputedEvent.starttime < eventRange.endtime) return true;
    }
  }

  return false;
}

export function mergeIntervals(events) {
  const merged_intervals = [events[0]];
  for (let i = 1; i < events.length; i++) {
    const currentEvent = events[i];
    const lastMergedEvent = merged_intervals[merged_intervals.length - 1];

    let currentEndTime = currentEvent.endtime;

    if (currentEvent.starttime <= lastMergedEvent.endtime) {
      lastMergedEvent.endtime = Math.max(
        lastMergeEndtime.getTime(),
        currentEndTime.getTime()
      );
    } else {
      merged_intervals.push(currentEvent);
    }
  }

  return merged_intervals;
}

export function findGaps(mergedIntervals) {
  const gaps = [];
  if (mergedIntervals.length > 1) {
    for (let i = 1; i < mergedIntervals.length; i++) {
      const previousEvent = mergedIntervals[i - 1];
      const currentEvent = mergedIntervals[i];
      const gapStartTime = previousEvent.endtime;
      const gapEndTime = currentEvent.starttime;
      const currentDate = new Date();
      currentDate.setHours(23, 59, 59, 999);

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
  for (let i = 0; i < events.length; i++) {
    if (
      inputedEvent.starttime >= events[i].starttime &&
      inputedEvent.endtime <= events[i].endtime
    ) {
      return true;
    }
    if (inputedEvent.starttime <= events[i].starttime) {
      if (inputedEvent.endtime > events[i].starttime) {
        return true;
      }
    } else {
      if (inputedEvent.endtime <= events[i].starttime) {
        return true;
      }
    }
  }

  return false;
}

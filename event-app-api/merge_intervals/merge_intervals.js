export function mergeIntervals(testEvents3) {
  const merged_intervals = [testEvents3[0]];
  for (let i = 1; i < testEvents3.length; i++) {
    const currentEvent = testEvents3[i];
    const lastMergedEvent = merged_intervals[merged_intervals.length - 1];

    let currentEndTime = new Date(currentEvent.endtime);
    let lastMergeEndtime = new Date(lastMergedEvent.endtime);
    let currentStartTime = new Date(currentEvent.starttime);

    if (currentStartTime <= lastMergeEndtime) {
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

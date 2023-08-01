/**
 * @function mergeIntervals Function to merge intervals
 */
export function mergeIntervals(events) {
  const merged_intervals = [events[0]];
  for (let i = 1; i < events.length; i++) {
    const currentEvent = events[i];
    const lastMergedEvent = merged_intervals[merged_intervals.length - 1];

    let currentEndTime = currentEvent.endtime;

    if (currentEvent.starttime <= lastMergedEvent.endtime) {
      lastMergedEvent.endtime = Math.max(
        lastMergedEvent.endtime,
        currentEndTime
      );
    } else {
      merged_intervals.push(currentEvent);
    }
  }

  return merged_intervals;
}

/**
 * @function findGaps Function to find gaps between intervals
 */
export function findGaps(mergedIntervals) {
  const gaps = [];
  const currentDate = new Date().getTime() / 1000;
  if (mergedIntervals[0]?.starttime > currentDate) {
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

/**
 * @function isOverlapping Function to check if an interval overlaps the other and vice versa
 */
export function isOverlapping(inputedEvent, events) {
  for (let eventRange of events) {
    if (inputedEvent.starttime < eventRange.starttime) {
      if (inputedEvent.endtime > eventRange.starttime) return true;
    } else {
      if (inputedEvent.starttime < eventRange.endtime) return true;
    }
  }

  return false;
}

/**
 * @function respectsPreferredTimes returns true if the selected time is in range of the start and end time that all users
 * will be available based on set preferences
 */
export function respectsPreferredTimes(
  startTime,
  endTime,
  usersJointPreferredTime
) {
  // Converts epoch to string with time new 1679990400000 -> "15:30:45"
  const convertToTimeString = (epochTime) => {
    return new Date(epochTime * 1000).toLocaleTimeString("en-US", {
      hour12: false,
    });
  };

  const startTimeString = convertToTimeString(startTime);
  const endTimeString = convertToTimeString(endTime);

  const compareStartTimes = compareTimeStrings(
    startTimeString,
    usersJointPreferredTime.starttime
  );
  const compareStartTimeAndPrefEndTime = compareTimeStrings(
    startTimeString,
    usersJointPreferredTime.endtime
  );

  // Inputed start time is greater than all users preferred start time and is less than all users preferred end time, it is valid
  const isStartTimeValid =
    compareStartTimes > 0 && compareStartTimeAndPrefEndTime < 0;

  const compareEndTimes = compareTimeStrings(
    endTimeString,
    usersJointPreferredTime.endtime
  );
  const compareEndTimeAndPrefStartTime = compareTimeStrings(
    endTimeString,
    usersJointPreferredTime.starttime
  );

  // Inputed end time is less than all users preferred end time and is greater than all users preferred start time, it is valid
  const isEndTimeValid =
    compareEndTimes < 0 && compareEndTimeAndPrefStartTime > 0;

  return isStartTimeValid && isEndTimeValid;
}

/**
 * @function getAllUsersPreferredTimes Combine users preferred times to get a start time and
 * end time that works for all users. Goal is to find the latest preferred start time and the earliest
 * preferred end time
 */
export function getAllUsersPreferredTimes(preferredTimes) {
  let starttime = preferredTimes[0].preferredstarttime,
    endtime = preferredTimes[0].preferredendtime;

  for (let i = 1; i < preferredTimes.length; i++) {
    const compareStartTime = compareTimeStrings(
      starttime,
      preferredTimes[i].preferredstarttime
    );
    const compareEndTime = compareTimeStrings(
      endtime,
      preferredTimes[i].preferredendtime
    );

    // If preferredTimes[i].preferredstarttime is greater than starttime, we make it that
    if (compareStartTime < 0) {
      starttime = preferredTimes[i].preferredstarttime;
    }
    // If preferredTimes[i].preferredendtime is less than endtime, we make it that
    if (compareEndTime > 0) {
      endtime = preferredTimes[i].preferredendtime;
    }
  }

  return { starttime, endtime };
}

/**
 * @function compareTimeString Function to compare two different time strings (Format: HH:MM:SS)
 * - return 0: Both times are the same
 * - return -1: time2 > time1
 * - return 1: time2 < time1
 */
export function compareTimeStrings(time1, time2) {
  // Get hours, minutes and seconds from string
  const [hours1, minutes1, seconds1] = time1.split(":").map(Number);
  const [hours2, minutes2, seconds2] = time2.split(":").map(Number);

  if (hours1 < hours2) {
    return -1;
  } else if (hours1 > hours2) {
    return 1;
  } else {
    if (minutes1 < minutes2) {
      return -1;
    } else if (minutes1 > minutes2) {
      return 1;
    } else {
      if (seconds1 < seconds2) {
        return -1;
      } else if (seconds1 > seconds2) {
        return 1;
      } else {
        return 0;
      }
    }
  }
}

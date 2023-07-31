import { getAllUsersPreferredTimes } from "./merge_intervals.js";
import { respectsPreferredTimes } from "./merge_intervals.js";
import { compareTimeStrings } from "./merge_intervals.js";
import { mergeIntervals, findGaps } from "./merge_intervals.js";

describe("Merge Intervals", () => {
  test("Events with overlapping times returns one start and end time", () => {
    const testEvents = [
      {
        starttime: 1679990400, // 2023-03-28 01:00:00 AM
        endtime: 1680076800, // 2023-03-29 01:00:00 AM
      },
      {
        starttime: 1680066800, //  2023-03-28 22:13:20 PM
        endtime: 1680235200, // 2023-03-30 21:00:00 PM
      },
      {
        starttime: 1680166400, // 2023-03-30 01:53:20 AM
        endtime: 1683772800, // 2023-05-10 19:40:44 PM
      },
    ];
    const expectedResult = [
      {
        starttime: 1679990400, // 2023-03-28 01:00:00 AM
        endtime: 1683772800, // 2023-03-29 01:00:00 AM
      },
    ];

    expect(mergeIntervals(testEvents)).toEqual(expectedResult);
  });

  test("Events with non-overlapping events returns both of the events", () => {
    const testEvents2 = [
      {
        starttime: 1679930880, // 2023-03-27 08:28:00 AM
        endtime: 1679952000, // 2023-03-27 14:20:00 PM
      },
      {
        starttime: 1679952100, // 2023-03-27 14:21:40 PM
        endtime: 1679973600, // 2023-03-27 20:20:00 PM
      },
    ];

    const expectedResult = [
      {
        starttime: 1679930880,
        endtime: 1679952000,
      },
      {
        starttime: 1679952100,
        endtime: 1679973600,
      },
    ];

    expect(mergeIntervals(testEvents2)).toEqual(expectedResult);
  });

  test("Events with the same startime and endttime returns just one starttime and endtime", () => {
    const testEvents3 = [
      {
        starttime: 1629816200, // 2021-08-24 07:43:00 AM
        endtime: 1629816200, // 2021-08-24 08:00:00 AM
      },
      {
        starttime: 1629816200, // 2021-08-24 07:43:00 AM
        endtime: 1629816200, // 2021-08-24 08:00:00 AM
      },
    ];

    const expectedResult = [
      {
        starttime: 1629816200, // 2021-08-24 07:43:00 AM
        endtime: 1629816200, // 2021-08-24 08:00:00 AM
      },
    ];

    expect(mergeIntervals(testEvents3)).toEqual(expectedResult);
  });
  test("Events with various date and time combination returns both of the events", () => {
    const testEvents4 = [
      {
        starttime: 1679930880, // 2023-03-27 08:23:00 AM
        endtime: 1680000000, // 2023-03-28 03:40:00 AM
      },
      {
        starttime: 1685215200, // 2023-03-27 02:20:00 AM
        endtime: 1685289600, // 2023-03-27 07:00:00 AM
      },
    ];

    const expectedResult = [
      {
        starttime: 1679930880, // 2023-03-27 08:23:00 AM
        endtime: 1680000000, // 2023-03-28 03:40:00 AM
      },
      {
        starttime: 1685215200, // 2023-03-27 02:20:00 AM
        endtime: 1685289600, // 2023-03-27 07:00:00 AM
      },
    ];

    expect(mergeIntervals(testEvents4)).toEqual(expectedResult);
  });
  test("No events returns an empty array", () => {
    const testEvents5 = [];

    const expectedResult = [];

    expect(mergeIntervals(testEvents5)).toEqual(expectedResult);
  });
});

describe("Find gaps", () => {
  test("Events with overlapping times returns the currentStartTime as the starttime and the following event's starttime as the endtime", () => {
    const testEvents = [
      {
        starttime: 1679990400000, // 2024-03-28 01:00:00 AM
        endtime: 1680076800000, // 2023-03-29 01:00:00 AM
      },
      {
        starttime: 1680076800000, // 2024-03-29 00:59:00 AM
        endtime: 1680235200000, // 2023-03-30 21:00:00 PM
      },
      {
        starttime: 1680166400000, // 2024-03-30 01:53:00 AM
        endtime: 1683772800000, // 2024-05-10 19:40:00 AM
      },
    ];
    const expectedResult = [
      { starttime: new Date().getTime() / 1000, endtime: 1679990400000 },
    ];

    expect(findGaps(testEvents)).toEqual(expectedResult);
  });

  test("Events with non-overlapping times returns the currentStartTime as the starttime and the following event's starttime as the endtime; also returns the endtime of the first event as the startime and the startime of the second event as the endtime", () => {
    const testEvents2 = [
      {
        starttime: 1679930880, // 2023-03-27 08:28:00 AM
        endtime: 1679952000, // 2023-03-27 14:20:00 AM
      },
      {
        starttime: 1679952100, // 2023-03-27 14:21:40 AM
        endtime: 1679973600, // 2023-03-28 20:20:00 AM
      },
    ];
    const expectedResult = [
      {
        starttime: 1679952000,
        endtime: 1679952100,
      },
    ];

    expect(findGaps(testEvents2)).toEqual(expectedResult);
  });
  test("Events with the same startime and endttime returns the endtime of the first event as the startime and the startime of the second event as the endtime", () => {
    const testEvents3 = [
      {
        starttime: 1629816200, // 2021-08-24 07:43:00 AM
        endtime: 1629816200, // 2021-08-24 07:43:00 AM
      },
      {
        starttime: 1630002600, // 2021-08-26 11:30:00 AM
        endtime: 1630002600, // 2021-08-26 11:30:00 AM
      },
    ];
    const expectedResult = [
      {
        starttime: 1629816200,
        endtime: 1630002600,
      },
    ];

    expect(findGaps(testEvents3)).toEqual(expectedResult);
  });
  test("Events with various date and time combination returns the endtime of the first event as the startime and the startime of the second event as the endtime", () => {
    const testEvents4 = [
      {
        starttime: 1679930880, // 2023-03-27 08:00:00 AM
        endtime: 1680000000, // 2023-03-28 03:00:00 AM
      },
      {
        starttime: 1685215200, // 2023-03-29 12:00:00 PM
        endtime: 1685289600, // 2023-03-30 09:00:00 AM
      },
    ];
    const expectedResult = [
      {
        starttime: 1680000000,
        endtime: 1685215200,
      },
    ];

    expect(findGaps(testEvents4)).toEqual(expectedResult);
  });
  test("No events return an empty array", () => {
    const testEvents5 = [];
    const expectedResult = [];

    expect(findGaps(testEvents5)).toEqual(expectedResult);
  });
});

describe("respectsPreferredTimes", () => {
  test("Returns the true if the inputed starttime and endtime is within the user's preferred range", () => {
    const startTimeEpoch = 1525884044; // 2018-05-09 09:40:44 AM
    const endTimeEpoch = 1525894492; // 2018-05-09 12:34:52 PM
    const usersJointPreferredTime = {
      starttime: "09:23:34",
      endtime: "16:24:33",
    };

    const expectedResult = true;

    expect(
      respectsPreferredTimes(
        startTimeEpoch,
        endTimeEpoch,
        usersJointPreferredTime
      )
    ).toEqual(expectedResult);
  });
  test("Returns the false if the inputed starttime and endtime is within the user's preferred range", () => {
    const startTimeEpoch = 1525884044; // 2018-05-09 09:40:44 AM
    const endTimeEpoch = 1525894492; // 2018-05-09 12:34:52 PM
    const usersJointPreferredTime = {
      starttime: "10:23:34",
      endtime: "12:02:33",
    };

    const expectedResult = false;

    expect(
      respectsPreferredTimes(
        startTimeEpoch,
        endTimeEpoch,
        usersJointPreferredTime
      )
    ).toEqual(expectedResult);
  });
});

describe("getAllUsersPreferredTimes", () => {
  test("Returns the latest start time and earliest end time", () => {
    const times = [
      { preferredstarttime: "07:23:44", preferredendtime: "16:24:33" },
      { preferredstarttime: "09:44:34", preferredendtime: "19:24:33" },
      { preferredstarttime: "10:23:44", preferredendtime: "14:24:33" },
      { preferredstarttime: "08:13:24", preferredendtime: "15:24:33" },
      { preferredstarttime: "07:23:44", preferredendtime: "17:24:33" },
    ];
    const expectedResult = { starttime: "10:23:44", endtime: "14:24:33" };

    expect(getAllUsersPreferredTimes(times)).toEqual(expectedResult);
  });
});

describe("compareTimeStrings", () => {
  test("Should return 0 if times are the same", () => {
    const time1 = "11:59:55";
    const time2 = time1;

    expect(compareTimeStrings(time1, time2)).toEqual(0);
  });

  test("Should return 1 if time1 is greater than time2", () => {
    const time1 = "17:22:40";
    const time2 = "11:59:55";

    expect(compareTimeStrings(time1, time2)).toEqual(1);
  });

  test("Should return -1 if time2 is greater than time1", () => {
    const time1 = "11:59:55";
    const time2 = "17:22:40";

    expect(compareTimeStrings(time1, time2)).toEqual(-1);
  });
});

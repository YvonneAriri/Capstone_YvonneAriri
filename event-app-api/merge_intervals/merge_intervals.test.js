import { mergeIntervals, findGaps } from "./merge_intervals.js";

describe("Merge Intervals", () => {
  test("Events with overlapping times returns one start and end time", () => {
    const testEvents = [
      {
        starttime: 1679990400000,
        endtime: 1680076800000,
      },
      {
        starttime: 1680076800000,
        endtime: 1680235200000,
      },
      {
        starttime: 1680166400000,
        endtime: 1683772800000,
      },
    ];
    const expectedResult = [
      {
        starttime: 1679990400000,
        endtime: 1683772800000,
      },
    ];

    expect(mergeIntervals(testEvents)).toEqual(expectedResult);
  });

  test("Events with non-overlapping events returns both of the events", () => {
    const testEvents2 = [
      {
        starttime: 1679930880000,
        endtime: 1679952000000,
      },
      {
        starttime: 1679952100000,
        endtime: 1679973600000,
      },
    ];

    const expectedResult = [
      {
        starttime: 1679930880000,
        endtime: 1679952000000,
      },
      {
        starttime: 1679952100000,
        endtime: 1679973600000,
      },
    ];

    expect(mergeIntervals(testEvents2)).toEqual(expectedResult);
  });

  test("Events with the same startime and endttime returns both of the events", () => {
    const testEvents3 = [
      {
        starttime: 1629816200000,
        endtime: 1629816200000,
      },
      {
        starttime: 1630002600000,
        endtime: 1630002600000,
      },
    ];

    const expectedResult = [
      {
        starttime: 1629816200000,
        endtime: 1629816200000,
      },
      {
        starttime: 1630002600000,
        endtime: 1630002600000,
      },
    ];

    expect(mergeIntervals(testEvents3)).toEqual(expectedResult);
  });
  test("Events with various date and time combination returns both of the events", () => {
    const testEvents4 = [
      {
        starttime: 1679930880000,
        endtime: 1680000000000,
      },
      {
        starttime: 1685215200000,
        endtime: 1685289600000,
      },
    ];

    const expectedResult = [
      {
        starttime: 1679930880000,
        endtime: 1680000000000,
      },
      {
        starttime: 1685215200000,
        endtime: 1685289600000,
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
  test("Events with overlapping times returns an empty array", () => {
    const testEvents = [
      {
        starttime: 1679990400000,
        endtime: 1680076800000,
      },
      {
        starttime: 1680076800000,
        endtime: 1680235200000,
      },
      {
        starttime: 1680166400000,
        endtime: 1683772800000,
      },
    ];
    const expectedResult = [];

    expect(findGaps(testEvents)).toEqual(expectedResult);
  });
  test("Events with non-overlapping times returns the endtime of the first event as the startime and the startime of the second event as the endtime", () => {
    const testEvents2 = [
      {
        starttime: 1679930880000,
        endtime: 1679952000000,
      },
      {
        starttime: 1679952100000,
        endtime: 1679973600000,
      },
    ];
    const expectedResult = [
      {
        starttime: 1679952000000,
        endtime: 1679952100000,
      },
    ];

    expect(findGaps(testEvents2)).toEqual(expectedResult);
  });
  test("Events with the same startime and endttime returns returns the endtime of the first event as the startime and the startime of the second event as the endtime", () => {
    const testEvents3 = [
      {
        starttime: 1629816200000,
        endtime: 1629816200000,
      },
      {
        starttime: 1630002600000,
        endtime: 1630002600000,
      },
    ];
    const expectedResult = [
      {
        starttime: 1629816200000,
        endtime: 1630002600000,
      },
    ];

    expect(findGaps(testEvents3)).toEqual(expectedResult);
  });
  test("Events with various date and time combination returns returns the endtime of the first event as the startime and the startime of the second event as the endtime", () => {
    const testEvents4 = [
      {
        starttime: 1679930880000,
        endtime: 1680000000000,
      },
      {
        starttime: 1685215200000,
        endtime: 1685289600000,
      },
    ];
    const expectedResult = [
      {
        starttime: 1680000000000,
        endtime: 1685215200000,
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

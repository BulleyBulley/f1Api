const assert = require("assert");
const {
  convertToDriverSeasonResultObject,
} = require("../controllers/resultsController.jsx");
const { DriverSeasonResult } = require("../app/objects/DriverSeasonResult.js");

describe("convertToDriveSeasonResultObject", () => {
  it("should convert a valid result object to a driverSeasonResult object", () => {
    const result = {
      position: "1",
      positionText: "1",
      points: "395.5",
      wins: "10",
      Driver: {
        driverId: "max_verstappen",
        permanentNumber: "33",
        code: "VER",
        url: "http://en.wikipedia.org/wiki/Max_Verstappen",
        givenName: "Max",
        familyName: "Verstappen",
        dateOfBirth: "1997-09-30",
        nationality: "Dutch",
      },
      Constructors: [
        {
          constructorId: "red_bull",
          url: "http://en.wikipedia.org/wiki/Red_Bull_Racing",
          name: "Red Bull",
          nationality: "Austrian",
        },
      ],
    };
    const expectedDriver = {
      firstName: "Max",
      surname: "Verstappen",
      fullName: "Max Verstappen",
      id: "max_verstappen",
      team: "Red Bull",
      driverNumber: "33",
      nationality: "Dutch",
      seasonEndDriverStanding: "1",
      seasonEndPoints: "395.5",
    };

    const convertedDriver = convertToDriverSeasonResultObject(result);
    assert.deepEqual(convertedDriver, expectedDriver);
  });

  it("should be an instance of a DriverSeasonResult object", () => {
    const result = {
      position: "2",
      positionText: "2",
      points: "387.5",
      wins: "8",
      Driver: {
        driverId: "hamilton",
        permanentNumber: "44",
        code: "HAM",
        url: "http://en.wikipedia.org/wiki/Lewis_Hamilton",
        givenName: "Lewis",
        familyName: "Hamilton",
        dateOfBirth: "1985-01-07",
        nationality: "British",
      },
      Constructors: [
        {
          constructorId: "mercedes",
          url: "http://en.wikipedia.org/wiki/Mercedes-Benz_in_Formula_One",
          name: "Mercedes",
          nationality: "German",
        },
      ],
    };
    const expectedDriver = {
      firstName: "Lewis",
      surname: "Hamilton",
      fullName: "Lewis Hamilton",
      id: "hamilton",
      team: "Mercedes",
      nationality: "British",
      driverNumber: "44",
      seasonEndDriverStanding: "2",
      seasonEndPoints: "387.5",
    };

    const convertedDriver = convertToDriverSeasonResultObject(result);
    const isDriverSeasonResult = convertedDriver instanceof DriverSeasonResult;
    assert.strictEqual(isDriverSeasonResult, true);
    assert.deepEqual(convertedDriver, expectedDriver);
  });

  it("should return an error if the result object is invalid", () => {
    const result = undefined;

    const convertedDriver = convertToDriverSeasonResultObject(result);

    assert.deepEqual(convertedDriver, "invalid driverStanding");
  });
});

const assert = require("assert");
const standings1 = require("../test/testData/standings1.json");
const results1 = require("../test/testData/results1.json");


describe("combineDriverStandingsAndRaceResults", () => {
  it("should combine driver standings and race results and return an object", () => {
    const standings = standings1;
    const results = results1;

    const expected = {
        
    }

    const combineDriverStandingsAndRaceResult = combineDriverStandingsAndRaceResults(standings, results); 
    assert.deepEqual(combineDriverStandingsAndRaceResult, expected);
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

// write tests for convertToRaceObject
describe("convertToRaceObject", () => {
    it("should return an error if the result object is invalid", () => {
        const result = undefined;
  
        const convertedDriver = convertToRaceObject(result);
  
        assert.deepEqual(convertedDriver, "invalid result");
      });

      it("should return a Race object with a valid input", () => {
        const result = convertToDriverObject1;
        const expectedRace = {
            results:[
                {
                    "position": 1,
                    "driverId": "hamilton"
                },
                {
                    "position": 2,
                    "driverId": "max_verstappen"
                },
                {
                    "position": 3,
                    "driverId": "bottas"
                },
                {
                    "position": 4,
                    "driverId": "norris"
                },
                {
                    "position": 5,
                    "driverId": "perez"
                },
                {
                    "position": 6,
                    "driverId": "leclerc"
                },
                {
                    "position": 7,
                    "driverId": "ricciardo"
                },
                {
                    "position": 8,
                    "driverId": "sainz"
                },
                {
                    "position": 9,
                    "driverId": "tsunoda"
                },
                {
                    "position": 10,
                    "driverId": "stroll"
                },
                {
                    "position": 11,
                    "driverId": "raikkonen"
                },
                {
                    "position": 12,
                    "driverId": "giovinazzi"
                },
                {
                    "position": 13,
                    "driverId": "ocon"
                },
                {
                    "position": 14,
                    "driverId": "russell"
                },
                {
                    "position": 15,
                    "driverId": "vettel"
                },
                {
                    "position": 16,
                    "driverId": "mick_schumacher"
                },
                {
                    "position": 17,
                    "driverId": "gasly"
                },
                {
                    "position": 18,
                    "driverId": "latifi"
                },
                {
                    "position": 19,
                    "driverId": "alonso"
                },
                {
                    "position": 20,
                    "driverId": "mazepin"
                }
            ],
            round: "1",
            season: "2021",
            circuitId: "bahrain",
            locality: "Sakhir",
            country: "Bahrain",
            circuitName: "Bahrain International Circuit",
            date: "2021-03-28",
            time: "15:00:00Z"

          };
      
          const convertedRace = convertToRaceObject(result.convertToRaceObjectData1);
          assert.deepEqual(convertedRace, expectedRace);


      });
});

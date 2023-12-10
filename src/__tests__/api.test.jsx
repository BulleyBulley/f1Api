const axios = require('axios');
const { getAllDrivers, getDriver, getDriversWithinYear, getDriversWithinYearRound, getAllCircuits, getSeasonEndDriverStandings, getRaceResult } = require('../utilities/api');

jest.mock('axios');

//getAllDrivers
describe('getAllDrivers', () => {
  afterEach(() => {
    axios.get.mockReset();
  });

  it('should return an array of drivers', async () => {
    const mockResponse = {
      data: {
        MRData: {
          DriverTable: {
            Drivers: [
              { id: '1', givenName: 'Carlo' },
              { id: '2', givenName: 'Gorge' },
              { id: '3', givenName: 'Kenny' },
            ],
          },
        },
      },
    };

    axios.get.mockResolvedValue(mockResponse);

    const result = await getAllDrivers();

    expect(result).toEqual(mockResponse.data.MRData.DriverTable.Drivers);
    expect(axios.get).toHaveBeenCalledWith('http://ergast.com/api/f1/drivers.json');
  });

  it('should handle errors and return the error object', async () => {
    const mockError = new Error('API error');

    axios.get.mockRejectedValue(mockError);

    const result = await getAllDrivers();

    expect(result).toEqual(mockError);
    expect(axios.get).toHaveBeenCalledWith('http://ergast.com/api/f1/drivers.json');
  });
});


//getDriver
describe('getDriver', () => {
  afterEach(() => {
    axios.get.mockReset();
  });

  it('should return a driver object', async () => {
    const driverId = 'alonso';
    const mockResponse = {
      data: {
        MRData: {
          DriverTable: {
            Drivers: [
              { driverId: 'alonso', givenName: 'Fernando' },
            ],
          },
        },
      },
    };

    axios.get.mockResolvedValue(mockResponse);

    const result = await getDriver(driverId);

    expect(result).toEqual(mockResponse.data.MRData.DriverTable.Drivers[0]);
    expect(axios.get).toHaveBeenCalledWith(`http://ergast.com/api/f1/drivers/${driverId}.json`);
  });

  it('should handle errors and return the error object', async () => {
    const driverId = '1';
    const mockError = new Error('API error');

    axios.get.mockRejectedValue(mockError);

    const result = await getDriver(driverId);

    expect(result).toEqual(mockError);
    expect(axios.get).toHaveBeenCalledWith(`http://ergast.com/api/f1/drivers/${driverId}.json`);
  });
});


//getDriversWithinYearRound
describe('getDriversWithinYearRound', () => {
  afterEach(() => {
    axios.get.mockReset();
  });

  it('should return an array of drivers within a specific year and round', async () => {
    const year = 2022;
    const round = 5;
    const mockResponse = {
      data: {
        MRData: {
          DriverTable: {
            Drivers: [
              { driverId: 'Albon', givenName: 'Alexander' }
            ],
          },
        },
      },
    };

    axios.get.mockResolvedValue(mockResponse);

    const result = await getDriversWithinYearRound(year, round);

    expect(result).toEqual(mockResponse.data.MRData.DriverTable.Drivers);
    expect(axios.get).toHaveBeenCalledWith(`http://ergast.com/api/f1/${year}/${round}/drivers.json`);
  });

  it('should handle errors and return the error object', async () => {
    const year = 2021;
    const round = 1;
    const mockError = new Error('API error');

    axios.get.mockRejectedValue(mockError);

    const result = await getDriversWithinYearRound(year, round);

    expect(result).toEqual(mockError);
    expect(axios.get).toHaveBeenCalledWith(`http://ergast.com/api/f1/${year}/${round}/drivers.json`);
  });
});


//getDriversWithinYear
describe('getDriversWithinYear', () => {
  afterEach(() => {
    axios.get.mockReset();
  });

  it('should return an array of drivers within a specific year', async () => {
    const year = 2022;
    const mockResponse = {
      data: {
        MRData: {
          DriverTable: {
            Drivers: [
              { driverId: 'Albon', givenName: 'Alexander' }
            ],
          },
        },
      },
    };

    axios.get.mockResolvedValue(mockResponse);

    const result = await getDriversWithinYear(year);

    expect(result).toEqual(mockResponse.data.MRData.DriverTable.Drivers);
    expect(axios.get).toHaveBeenCalledWith(`http://ergast.com/api/f1/${year}/drivers.json`);
  });

  it('should handle errors and return the error object', async () => {
    const year = 2021;
    const mockError = new Error('API error');

    axios.get.mockRejectedValue(mockError);

    const result = await getDriversWithinYear(year);

    expect(result).toEqual(mockError);
    expect(axios.get).toHaveBeenCalledWith(`http://ergast.com/api/f1/${year}/drivers.json`);
  });
});



//getAllCircuits
describe('getAllCircuits', () => {
  afterEach(() => {
    axios.get.mockReset();
  });

  it('should return an array of circuits', async () => {
    const mockResponse = {
      data: {
        MRData: {
          CircuitTable: {
            Circuits: [
              { circuitId: 'monza', circuitName: 'Monza Circuit' },
              { circuitId: 'spa', circuitName: 'Spa-Francorchamps Circuit' }
            ],
          },
        },
      },
    };

    axios.get.mockResolvedValue(mockResponse);

    const API_URL = 'http://ergast.com/api/f1/';
    const result = await getAllCircuits();

    expect(result).toEqual(mockResponse.data.MRData.CircuitTable.Circuits);
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}circuits.json`);
  });

  it('should handle errors and return the error object', async () => {
    const mockError = new Error('API error');

    axios.get.mockRejectedValue(mockError);
    const API_URL = 'http://ergast.com/api/f1/';
    const result = await getAllCircuits();

    expect(result).toEqual(mockError);
    expect(axios.get).toHaveBeenCalledWith(`${API_URL}circuits.json`);
  });
});

//getSeasonEndDriverStandings
describe('getSeasonEndDriverStandings', () => {
  afterEach(() => {
    axios.get.mockReset();
  });

  it('should return an array of drivers', async () => {
    const year = 2021;
    const mockResponse = {
      data: {
        MRData: {
          StandingsTable: {
            StandingsLists: [
              { DriverStandings: [
                { Driver: { driverId: 'alonso', givenName: 'Fernando' } },
                { Driver: { driverId: 'hamilton', givenName: 'Lewis' } },
                { Driver: { driverId: 'norris', givenName: 'Lando' } },
              ] },
            ],
          },
        },
      },
    };

    axios.get.mockResolvedValue(mockResponse);

    const result = await getSeasonEndDriverStandings(year);

    expect(result).toEqual(mockResponse.data.MRData.StandingsTable.StandingsLists[0].DriverStandings);
    expect(axios.get).toHaveBeenCalledWith(`http://ergast.com/api/f1/${year}/driverStandings.json?limit=1000`);
  });

  it('should handle errors and return the error object', async () => {
    const year = 2021;
    const mockError = new Error('API error');

    axios.get.mockRejectedValue(mockError);

    const result = await getSeasonEndDriverStandings(year);

    expect(result).toEqual(mockError);
    expect(axios.get).toHaveBeenCalledWith(`http://ergast.com/api/f1/${year}/driverStandings.json?limit=1000`);
  });
}); 

//getRaceResult


describe('getRaceResult', () => {
  afterEach(() => {
    axios.get.mockReset();
  });

  it('should return the race result for a specific year and round', async () => {
    const year = 2021;
    const round = 1;
    const mockResponse = {
      data: {
        MRData: {
          RaceTable: {
            Races: [
              {
                season: year,
                round,
                Results: [
                  { position: 1, Driver: { driverId: 'hamilton', givenName: 'Lewis' } },
                  { position: 2, Driver: { driverId: 'verstappen', givenName: 'Max' } },
                  { position: 3, Driver: { driverId: 'bottas', givenName: 'Valtteri' } },
                ],
              },
            ],
          },
        },
      },
    };

    axios.get.mockResolvedValue(mockResponse);

    const result = await getRaceResult(year, round);

    expect(result).toEqual(mockResponse.data.MRData.RaceTable.Races[0].Results);
    expect(axios.get).toHaveBeenCalledWith(`http://ergast.com/api/f1/${year}/${round}/results.json`);
  });

  it('should handle errors and return the error object', async () => {
    const year = 2021;
    const round = 1;
    const mockError = new Error('API error');

    axios.get.mockRejectedValue(mockError);

    const result = await getRaceResult(year, round);

    expect(result).toEqual(mockError);
    expect(axios.get).toHaveBeenCalledWith(`http://ergast.com/api/f1/${year}/${round}/results.json`);
  });
});











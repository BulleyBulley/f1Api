// Import the getSeasons function from the API module using es5 style import
const { Driver} = require('../app/objects/Driver.js');
const { getSeasons, getSeasonEndDriverStandings, getCircuitsWithinAYear, getRaceResult } = require( '../utilities/api.jsx');
const { DriverSeasonResult } = require('../app/objects/DriverSeasonResult.js');
const {Race} = require("../app/objects/Race.js")

// Define the fetchSeasons function
const fetchSeasons = async () => {
  try {
    // Call the getSeasons function to fetch the data from the API
    const seasons = await getSeasons();

    // Convert the seasons object to an array
    const seasonsArray = Object.values(seasons);

    // Return the seasonsArray as props to the results page
    return seasonsArray;
  } catch (error) {
    console.error('Error fetching seasons:', error);
    return [];
  }
};

const fetchSeasonEndDriverStandings = async (year) => {
  try {
    const standings = await getSeasonEndDriverStandings(year);
    
    // Convert each instance of a driver standing into a Driver object
    const driverSeasonResultObjects = standings.map(convertToDriverSeasonResultObject);
    
    return driverSeasonResultObjects;
  } catch (error) {
    console.log(error);
    return error;
  }
}

const convertToDriverSeasonResultObject = (driverStanding) => {

  //return not valid if driverStanding is not valid
  if (!driverStanding) {
    return "invalid driverStanding";
  }

  const driverSeasonResult = new DriverSeasonResult();
  driverSeasonResult.firstName = driverStanding.Driver.givenName;
  driverSeasonResult.surname = driverStanding.Driver.familyName;
  driverSeasonResult.fullName = driverStanding.Driver.givenName + " " + driverStanding.Driver.familyName;
  driverSeasonResult.id = driverStanding.Driver.driverId;
  driverSeasonResult.team = driverStanding.Constructors[0].name;
  driverSeasonResult.driverNumber = driverStanding.Driver.permanentNumber;
  driverSeasonResult.nationality = driverStanding.Driver.nationality;
  driverSeasonResult.seasonEndDriverStanding = driverStanding.position;
  driverSeasonResult.seasonEndPoints = driverStanding.points;

  return driverSeasonResult;
  
}

const fetchCircuitsWithinAYear = async (year) => {
  try {
    const circuits = await getCircuitsWithinAYear(year);
    return circuits;
  } catch (error) {
    console.log(error);
    return error;
  }
}

const fetchRaceResult = async (year, round) => {
  try {
    const result = await getRaceResult(year, round);
    const converted = convertToRaceObject(result);

    return converted;
  } catch (error) {
    console.log(error);
    return error;
  }
}

const convertToRaceObject = (result) => {
  //console.log("result: " + JSON.stringify(result));
  if (result === undefined) {
    return "invalid result";
  }

  const race = new Race();
  const firstRace = result.MRData.RaceTable.Races[0];
  //console.log("firstRace: " + JSON.stringify(firstRace));

  race.results = firstRace.Results.map((item) => ({
    position: parseInt(item.position, 10),
    driverId: item.Driver.driverId
  }));

  race.round = firstRace.round;
  race.season = firstRace.season;
  race.circuitId = firstRace.Circuit.circuitId;
  race.locality = firstRace.Circuit.Location.locality;
  race.country = firstRace.Circuit.Location.country;
  race.circuitName = firstRace.Circuit.circuitName;
  race.date = firstRace.date;
  race.time = firstRace.time;
  race.friendlyName = Race.getFriendlyName(firstRace.Circuit.circuitName);

  return race;
};





//export the functions
module.exports = {
  fetchSeasons,
  fetchSeasonEndDriverStandings,
  fetchCircuitsWithinAYear,
  fetchRaceResult,
  convertToDriverSeasonResultObject,
  convertToRaceObject
};

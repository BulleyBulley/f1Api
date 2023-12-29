// Import the getSeasons function from the API module using es5 style import
const { Driver} = require('../app/objects/Driver.js');
const { getSeasons, getSeasonEndDriverStandings, getCircuitsWithinAYear, getRaceResult } = require( '../utilities/api.jsx');
const { DriverSeasonResult } = require('../app/objects/DriverSeasonResult.js');
const { Race } = require("../app/objects/Race.js")

// Define the fetchSeasons function
const fetchSeasons = async () => {
  console.log("IN fetchSeasons");
  try {
    // Call the getSeasons function to fetch the data from the API
    const seasons = await getSeasons();

    // Convert the seasons object to an array
    const seasonsArray = Object.values(seasons);
    console.log("OUT fetchSeasons");
    // Return the seasonsArray as props to the results page
    return seasonsArray;
  } catch (error) {
    console.error('Error fetching seasons:', error);
    return [];
  }
};

const fetchSeasonEndDriverStandings = async (year) => {
  console.log("IN fetchSeasonEndDriverStandings");
  try {
    const standings = await getSeasonEndDriverStandings(year);
    const driverStandings = standings.DriverStandings.map(convertToDriverSeasonResultObject);
    const numberOfRaces = standings.round;
    console.log("OUT fetchSeasonEndDriverStandings");
    return  { driverStandings, numberOfRaces };
  } catch (error) {
    console.log(error);
    return error;
  }
}

const convertToDriverSeasonResultObject = (driverStanding) => {
  console.log("IN convertToDriverSeasonResultObject");
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

  console.log("OUT convertToDriverSeasonResultObject")
  return driverSeasonResult;
  
}

const fetchCircuitsWithinAYear = async (year) => {
  console.log("IN fetchCircuitsWithinAYear")
  try {
    const circuits = await getCircuitsWithinAYear(year);
    console.log("OUT fetchCircuitsWithinAYear")
    return circuits;
  } catch (error) {
    console.log(error);
    return error;
  }
}

const fetchRaceResult = async (year, round) => {
  console.log("IN fetchRaceResult")
  try {
    const result = await getRaceResult(year, round);
    const converted = convertToRaceObject(result);
    console.log("OUT fetchRaceResult")
    return converted;
  } catch (error) {
    console.log(error);
    return error;
  }
}

const convertToRaceObject = (result) => {
  console.log("IN convertToRaceObject");
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
  console.log("OUT convertToRaceObject");
  return race;
};

const fetchFlagUrls = async (races) => {

  races.forEach(race => {
    const countryCode = getCountryCode(race.country);
    const style = "flat";
    const size = "64";
    race.flagUrl = `https://flagsapi.com/${countryCode}/${style}/${size}`;
  });

    return races;

}

function getCountryCode(country) {
  switch (country) {
    case "UAE": return "AE";
    case "Argentina": return "AR";
    case "Australia": return "AU";
    case "Austria": return "AT";
    case "Azerbaijan": return "AZ";
    case "Bahrain": return "BH";
    case "Belgium": return "BE";
    case "Brazil": return "BR";
    case "Canada": return "CA";
    case "China": return "CN";
    case "France": return "FR";
    case "Germany": return "DE";
    case "Hungary": return "HU";
    case "Italy": return "IT";
    case "Japan": return "JP";
    case "Malaysia": return "MY";
    case "Mexico": return "MX";
    case "Monaco": return "MC";
    case "Netherlands": return "NL";
    case "Portugal": return "PT";
    case "Qatar": return "QA";
    case "Russia": return "RU";
    case "Saudi Arabia": return "SA";
    case "Singapore": return "SG";
    case "South Africa": return "ZA";
    case "Spain": return "ES";
    case "Sweden": return "SE";
    case "Switzerland": return "CH";
    case "Turkey": return "TR";
    case "United Arab Emirates": return "AE";
    case "UK":
    case "United Kingdom": 
    return "GB";
    case "United States":
    case "USA":
    return "US";
    default: 
      return "Unknown";
  }
}





//export the functions
module.exports = {
  fetchSeasons,
  fetchSeasonEndDriverStandings,
  fetchCircuitsWithinAYear,
  fetchRaceResult,
  convertToDriverSeasonResultObject,
  convertToRaceObject,
  fetchFlagUrls,
  getCountryCode
};

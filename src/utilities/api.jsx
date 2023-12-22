var axios = require('axios');

const API_URL = 'http://ergast.com/api/f1/';

async function getAllDrivers() {
    try {
        const response = await axios.get(API_URL + 'drivers.json');
        return response.data.MRData.DriverTable.Drivers;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getDriver(id) {
    try {
        const response = await axios.get(API_URL + 'drivers/' + id + '.json');
        return response.data.MRData.DriverTable.Drivers[0];
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getDriversWithinYear(year) {
    try {
        const response = await axios.get(API_URL + year + '/drivers.json');
        return response.data.MRData.DriverTable.Drivers;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getDriversWithinYearRound(year, round) {
    try {
        const response = await axios.get(API_URL + year + '/' + round + '/drivers.json');
        return response.data.MRData.DriverTable.Drivers;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getAllCircuits() {
    try {
        const response = await axios.get(API_URL + 'circuits.json');
        return response.data.MRData.CircuitTable.Circuits;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getSeasonEndDriverStandings(year) {
    try {
        const response = await axios.get(API_URL + year + '/driverStandings.json?limit=1000');
        return response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getRaceResult(year, round) {
    try {
        const response = await axios.get(API_URL + year + '/' + round + '/results.json');
        return response.data;
    } catch (error) {
        console.log(error);
        return error;
    }
    
}

async function getSeasons() {
    try {
        const response = await axios.get(API_URL + 'seasons.json?limit=1000');
        return response.data.MRData.SeasonTable.Seasons;
    } catch (error) {
        console.log(error);
        return error;
    }
}

async function getCircuitsWithinAYear(year) {
    try {
        const response = await axios.get(API_URL + year + '/circuits.json');
        return response.data.MRData.CircuitTable.Circuits;
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports = { getAllDrivers, getDriver, getDriversWithinYear, getDriversWithinYearRound, getAllCircuits, getSeasonEndDriverStandings, getRaceResult, getSeasons, getCircuitsWithinAYear };













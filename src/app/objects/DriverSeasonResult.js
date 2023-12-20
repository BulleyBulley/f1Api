const { Driver} = require('./Driver.js');

class DriverSeasonResult extends Driver {
  //add seasonEndDriverStanding and seasonEndPoints to Driver
  constructor(seasonEndDriverStanding, seasonEndPoints, ...args) {
    super(...args);
    this.seasonEndDriverStanding = seasonEndDriverStanding;
    this.seasonEndPoints = seasonEndPoints;
  }
}

module.exports = { DriverSeasonResult };


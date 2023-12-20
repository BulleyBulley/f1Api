class Race {
    constructor(results, round, season, circuitId, circuitName, locality, country,  date, time) {
        this.results = results;
        this.round = round;
        this.season = season;
        this.circuitId = circuitId;
        this.locality = locality;
        this.country = country;
        this.circuitName = circuitName;
        this.date = date;
        this.time = time;
    }
}

module.exports = { Race };

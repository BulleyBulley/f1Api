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
        this.friendlyName = Race.getFriendlyName(circuitName);
    }

    static getFriendlyName(circuitName) {
        switch (circuitName) {
            case "Albert Park Grand Prix Circuit": return "Melbourne";
            case "Autódromo Hermanos Rodríguez": return "Mexico City";
            case "Autódromo Internacional do Algarve": return "Portimão";
            case "Autódromo José Carlos Pace": return "Brazil";
            case "Autodromo Enzo e Dino Ferrari": return "Imola";
            case "Autodromo Internazionale del Mugello": return "Mugello";
            case "Autodromo Nazionale di Monza": return "Monza";
            case "Bahrain International Circuit": return "Bahrain";
            case "Baku City Circuit": return "Baku";
            case "Circuit de Barcelona-Catalunya": return "Barcelona";
            case "Circuit Gilles Villeneuve": return "Montreal";
            case "Circuit of the Americas": return "COTA";
            case "Circuit Park Zandvoort": return "Zandvoort";
            case "Circuit Paul Ricard": return "Paul Ricard";
            case "Circuit de Monaco": return "Monaco";
            case "Circuit de Spa-Francorchamps": return "Spa";
            case "Hungaroring": return "Hungaroring";
            case "Istanbul Park": return "Istanbul";
            case "Jeddah Corniche Circuit": return "Jeddah";
            case "Las Vegas Street Circuit": return "Las Vegas";
            case "Losail International Circuit": return "Qatar";
            case "Marina Bay Street Circuit": return "Singapore";
            case "Miami International Autodrome": return "Miami";
            case "Nürburgring": return "Nürburgring";
            case "Red Bull Ring": return "Spielberg";
            case "Shanghai International Circuit": return "Shanghai";
            case "Silverstone Circuit": return "Silverstone";
            case "Sochi Autodrom": return "Sochi";
            case "Suzuka Circuit": return "Suzuka";
            case "Yas Marina Circuit": return "Abu Dhabi";
            
                default: return circuitName;
        }
    }


}

module.exports = { Race };

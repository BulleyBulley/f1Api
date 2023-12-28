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
              case "Bahrain International Circuit": return "Bahrain";
                case "Shanghai International Circuit": return "Shanghai";
                case "Baku City Circuit": return "Baku";
                case "Circuit de Barcelona-Catalunya": return "Barcelona";
                case "Circuit de Monaco": return "Monaco";
                case "Circuit Gilles Villeneuve": return "Montreal";
                case "Circuit Paul Ricard": return "Paul Ricard";
                case "Red Bull Ring": return "Spielberg";
                case "Silverstone Circuit": return "Silverstone";
                case "Hungaroring": return "Hungaroring";
                case "Circuit de Spa-Francorchamps": return "Spa";
                case "Autodromo Nazionale di Monza": return "Monza";
                case "Marina Bay Street Circuit": return "Singapore";
                case "Sochi Autodrom": return "Sochi";
                case "Suzuka Circuit": return "Suzuka";
                case "Circuit of the Americas": return "COTA";
                case "Autódromo Hermanos Rodríguez": return "Mexico City";
                case "Autódromo José Carlos Pace": return "Brazil";
                case "Yas Marina Circuit": return "Abu Dhabi";
                case "Autodromo Internazionale del Mugello": return "Mugello";
                case "Nürburgring": return "Nürburgring";
                case "Autodromo Enzo e Dino Ferrari": return "Imola";
                case "Istanbul Park": return "Istanbul";
                case "Jeddah Corniche Circuit": return "Jeddah";
                case "Yas Marina Circuit": return "Abu Dhabi";
                case "Circuit Park Zandvoort": return "Zandvoort";
                case "Circuit de Barcelona-Catalunya": return "Barcelona";
                case "Miami International Autodrome": return "Miami";
                case "Losail International Circuit": return "Qatar";
                case "Las Vegas Street Circuit": return "Las Vegas";
                case "Autódromo Internacional do Algarve": return "Portimão";
                default: return circuitName;
        }
    }


}

module.exports = { Race };

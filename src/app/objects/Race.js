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
        this.flagUrl = "";
    }

    static getFriendlyName(circuitName) {
        switch (circuitName) {
            case "Adelaide Street Circuit": return "Adelaide";
            case "Albert Park Grand Prix Circuit": return "Melbourne";
            case "Autódromo Hermanos Rodríguez": return "Mexico City";
            case "Autódromo Internacional Nelson Piquet": return "Brasilia";
            case "Autódromo Internacional do Algarve": return "Portimão";
            case "Autódromo José Carlos Pace": return "Brazil";
            case "Autódromo Juan y Oscar Gálvez": return "Buenos Aires";
            case "Autódromo do Estoril": return "Estoril";
            case "Autodromo Enzo e Dino Ferrari": return "Imola";
            case "Autodromo Internazionale del Mugello": return "Mugello";
            case "Autodromo Nazionale di Monza": return "Monza";
            case "Bahrain International Circuit": return "Bahrain";
            case "Baku City Circuit": return "Baku";
            case "Charade Circuit": return "Charade";
            case "Circuit Bremgarten": return "Bremgarten";
            case "Circuit de Barcelona-Catalunya": return "Barcelona";
            case "Circuito da Boavista": return "Boavista";
            case "Circuito de Jerez": return "Jerez";
            case "Circuit de Nevers Magny-Cours": return "Magny-Cours";
            case "Dijon-Prenois": return "Dijon";
            case "Donington Park": return "Donington";
            case "Circuit de Dijon-Prenois": return "Dijon";

            case "Circuit de Pedralbes": return "Pedralbes";
            case "Circuit de Pau-Ville": return "Pau-Ville";
            case "Circuit Gilles Villeneuve": return "Montreal";
            case "Circuit of the Americas": return "COTA";
            case "Circuit Mont-Tremblant": return "Mont-Tremblant";
            case "Circuit Park Zandvoort": return "Zandvoort";
            case "Circuit Paul Ricard": return "Paul Ricard";
            case "Circuit de Monaco": return "Monaco";
            case "Circuit de Spa-Francorchamps": return "Spa";
            case "Detroit Street Circuit": return "Detroit";
            case "Hungaroring": return "Hungaroring";
            case "Indianapolis Motor Speedway": return "Indianapolis";
            case "Istanbul Park": return "Istanbul";
            case "Jeddah Corniche Circuit": return "Jeddah";
            case "Las Vegas Street Circuit": return "Las Vegas";
            case "Las Vegas Strip Street Circuit": return "Las Vegas";
            case "Losail International Circuit": return "Qatar";
            case "Marina Bay Street Circuit": return "Singapore";
            case "Miami International Autodrome": return "Miami";
            case "Mosport International Raceway": return "Mosport";
            case "Monsanto Park Circuit": return "Monsanto";
            case "Nivelles-Baulers": return "Nivelles";
            case "Nürburgring": return "Nürburgring";
            case "Okayama International Circuit": return "Okayama";
            case "Pescaara Circuit": return "Pescara";
            case "Prince George Circuit": return "Prince George";
            case "Phoenix street circuit": return "Phoenix";
            case "Red Bull Ring": return "Spielberg";
            case "Riverside International Raceway": return "Riverside";
            case "Rouen-Les-Essarts": return "Rouen";
            case "Scandinavian Raceway": return "Anderstorp";
            case "Sebring International Raceway": return "Sebring";
            case "Sepang International Circuit": return "Sepang";
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

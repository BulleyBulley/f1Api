class Constructor {
    constructor(id, name, nationality, url) {
        this.id = id;
        this.name = name;
        this.nationality = nationality;
        this.url = url;
        this.primaryColor = getConstructorColours(this.id)[0];
        this.secondaryColor = getConstructorColours(this.id)[1];
    }

    getConstructorColours(id) {
        switch (id) {
            case "alfa": return ["#9B0000", "#FFFFFF"];
            case "alpha": return ["#9B0000", "#FFFFFF"];
            case "alpine": return ["#0090FF", "#FFFFFF"];
            case "alpinef1team": return ["#0090FF", "#FFFFFF"];
            case "alpinesportscars": return ["#0090FF", "#FFFFFF"];
            case "alphatauri": return ["#2B4562", "#FFFFFF"];
            case "alphataurif1": return ["#2B4562", "#FFFFFF"];
            case "arrows": return ["#FF0000", "#FFFFFF"];
            case "astonmartin": return ["#006F62", "#FFFFFF"];
            case "astonmartinf1": return ["#006F62", "#FFFFFF"];
            case "bar": return ["#0000FF", "#FFFFFF"];
            case "brawn": return ["#FFFFFF", "#000000"];
            case "brm": return ["#FF0000", "#FFFFFF"];
            
            }
    }
}
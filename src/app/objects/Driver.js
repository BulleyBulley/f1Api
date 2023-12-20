class Driver {
  constructor(firstName, surname, id, team, driverNumber, nationality) {
    this.firstName = firstName;
    this.surname = surname;
    this.fullName = `${firstName} ${surname}`;
    this.id = id;
    this.team = team;
    this.driverNumber = driverNumber;
    this.nationality = nationality;
    
  }
}

module.exports = { Driver };

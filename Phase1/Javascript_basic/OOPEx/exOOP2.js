class Car{
    constructor(year,make,model,miles){
    this.year = year;
    this.make = make;
    this.model = model;
    this.miles = miles;
    }
    driver(distance){
        if(distance>0){
             this.miles += distance;
             console.log(`You drove ${distance} miles. Total miles: ${this.miles}`);
        }
    }
}
const myCar = new Car("2024","Vinfast","ccc",10000)
myCar.driver(200) 
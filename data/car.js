class Car {
  #brand;
  #model;
  speed;
  isTrunkOpen = false;

  constructor(carDetails) {
    this.#brand = carDetails.brand;
    this.#model = carDetails.model;
    this.speed = carDetails.speed;
  }

  displayInfo() {
    const trunkStatus = this.isTrunkOpen ? "open" : "closed";
    console.log(
      `${this.#brand} ${this.#model}, Speed: ${
        this.speed
      } km/h, Trunk: ${trunkStatus}`
    );
  }

  go() {
    if (!this.isTrunkOpen) {
      if (this.speed + 5 <= 200) {
        this.speed += 5;
      } else {
        this.speed = 200;
      }
    } else {
      console.log(`${this.#model} can't go while the trunk is open`);
    }
  }

  brake() {
    if (this.speed - 5 < 0) {
      this.speed = 0;
    } else {
      this.speed -= 5;
    }
  }

  openTrunk() {
    if (this.speed > 0) {
      console.log(`Stop the ${this.#model} before opening the trunk`);
    } else {
      this.isTrunkOpen = true;
    }
  }

  closeTrunk() {
    this.isTrunkOpen = false;
  }
}

const car1 = new Car({
  brand: "Toyota",
  model: "Corolla",
  speed: 0,
});
const car2 = new Car({
  brand: "Tesla",
  model: "Model 3",
  speed: 0,
});

// ****** Race Car ****** //

class RaceCar extends Car {
  acceleration;
  isTrunkOpen = undefined;

  constructor(carDetails) {
    super(carDetails);
    this.acceleration = carDetails.acceleration;
  }

  openTrunk() {
    console.log("Race cars do not have a trunk.");
  }

  closeTrunk() {
    console.log("Race cars do not have a trunk.");
  }

  go() {
    if (this.speed + this.acceleration <= 300) {
      this.speed += this.acceleration;
    } else {
      this.speed = 300;
    }
  }
}

const raceCar1 = new RaceCar({
  brand: "McLaren",
  model: "F1",
  speed: 0,
  acceleration: 20,
});

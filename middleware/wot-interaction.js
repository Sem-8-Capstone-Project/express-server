const { Servient } = require("@node-wot/core");
const { HttpClientFactory } = require("@node-wot/binding-http");
const axios = require("axios");
const Headers = {
  "ngrok-skip-browser-warning": 1,
  "Content-Type": "application/json",
};

let data = '';

class WotInteraction {
  constructor(url) {
    this.url = url;
  }

  async connect() {
    // Create Servient and add HTTP binding
    const servient = new Servient();
    servient.addClientFactory(new HttpClientFactory(null));

    try {
      const WoT = await servient.start();
      const td = await WoT.requestThingDescription(this.url);
      this.thing = await WoT.consume(td);
    } catch (err) {
      console.error("Error connecting:", err);
      throw err; // Re-throw the error for handling in the usage
    }
  }

  turnLedOn(ledName) {
    this.thing.invokeAction(`${ledName}_on`);
  }

  turnLedOff(ledName) {
    this.thing.invokeAction(`${ledName}_off`);
  }

  async setLedIntensity(ledName, intensity) {
    console.log(ledName);
    console.log(intensity);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://trout-sought-marlin.ngrok-free.app/light/actions/${ledName}_intensity?intensity=${intensity}`,
      headers: { "Content-Type": "application/json" },
    };
    //this.thing.invokeAction(`${ledName}_intensity`, undefined, { uriVariables: { intensity: intensity } });
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  setUsername(username) {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `https://trout-sought-marlin.ngrok-free.app/light/actions/set_username?username=${username}`,
      headers: { "Content-Type": "application/json" },
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }

  oledOff() {
    let config = {
		method: 'post',
		maxBodyLength: Infinity,
		url: 'https://trout-sought-marlin.ngrok-free.app/light/actions/oled_off',
		headers: { "Content-Type": "application/json"},
		data: data
	  };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

module.exports = WotInteraction;

const { Servient } = require("@node-wot/core");
const { HttpClientFactory } = require("@node-wot/binding-http");

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

	setLedIntensity(ledName, intensity) {
		this.thing.invokeAction(`${ledName}_intensity`, undefined, { uriVariables: { intensity: intensity } });
	}

	setUsername(username) {
		this.thing.invokeAction("set_username", undefined, { uriVariables: { username: username } });
	}

	oledOff() {
		this.thing.invokeAction("oled_off");
	}
}

module.exports = WotInteraction;
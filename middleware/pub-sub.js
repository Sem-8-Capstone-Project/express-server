const redis = require('redis');

const client = redis.createClient({
	password: process.env.REDIS_PWD,
	socket: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT
	}
});

const subscriber = client.duplicate();

client.connect().then(() => console.log("Client Connected!"));
subscriber.connect().then(() => console.log("Subscriber Connected!"));

client.configSet("notify-keyspace-events", "KEgx").then(() => console.log("Key Space Events Enabled!"));

const handleUserQueue = () => {
    // Check queue length
    client.lLen("user-queue").then((len) => {
        console.log("Queue length:", len);
        if (len > 0) {
            // Get the first user in the queue
            client.lPop("user-queue").then((userid) => {
                console.log("Popped user:", userid);
                // Lock the endpoint
                client.set("current-user", userid, "EX", 300).then(() => {
                    console.log("Locked endpoint for user:", userid);
                });
            });
        }
    });
};


const listener = (channel, message) => {
    console.log("Received message:", message);
    handleUserQueue();
}

const setupSub = () => {
    subscriber.subscribe("__keyevent@0__:expired", listener).then(() => console.log("Subscribed to expired events!"));
    subscriber.subscribe("__keyevent@0__:del", listener).then(() => console.log("Subscribed to key del events!"));
}


module.exports = { setupSub };
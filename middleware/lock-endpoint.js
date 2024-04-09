const redis = require('redis');
require('dotenv').config();

const client = redis.createClient({
	password: process.env.REDIS_PWD,
	socket: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT
	}
});

client.connect().then(() => console.log("Client Connected!"))

// Middleware for locking endpoint
const lockEndpoint = async (req, res, next) => {
	const key = 'current-user';
	const queueKey = 'user-queue';

	const userid = req.user.id;

	const reply = await client.get(key);
	if (reply) {
		// Endpoint is already locked

		// Check if the current user is the one holding the lock
		if (reply === userid) {
			return next(); // User already holds the lock, allow access
		} else if (await client.lPos(queueKey, userid) !== null) {
			// Check if the user is already in the queue
			const position = await client.lPos(queueKey, userid); // Get position in the queue
			return res.status(429).send(`Endpoint locked. You are in position ${position + 1} in the queue.`);
		} else {
			// Add user to the queue
			await client.rPush(queueKey, userid);
			const position = await client.lLen(queueKey); // Get position in the queue
			return res.status(429).send(`Endpoint locked. You are in position ${position} in the queue.`);
		}
	}

	// Lock the endpoint
	await client.set(key, userid, { EX: 300 });
	next();
};

const unlockEndpoint = async (req, res, next) => {
	const key = 'current-user';
	const queueKey = 'user-queue';

	const userid = req.user.id;

	const reply = await client.get(key)

	if (reply === userid) {
		await client.del(key);
	} else if (await client.lPos(queueKey, userid) !== null) {
		// Check user position in queue and remove them from the queue
		await client.lRem(queueKey, 0, userid);
	} else {
		return res.status(429).send('Endpoint locked. Try again later.');
	}
	next();
}

module.exports = { lockEndpoint, unlockEndpoint }
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
	const userid = req.user.id;

	const reply = await client.get(key)

	if (reply) {
		if (reply === userid) {
			return next();
		} else {
			return res.status(429).send('Endpoint locked. Try again later.');
		}
	}

	// Set key to expire in 5 minutes
	await client.set(key, userid, { EX: 300 });
	next();
};

const unlockEndpoint = async (req, res, next) => {
	const key = 'current-user';
	const userid = req.user.id;

	const reply = await client.get(key)

	if (reply === userid) {
		await client.del(key);
	} else {
		return res.status(429).send('Endpoint locked. Try again later.');
	}
	next();
}

module.exports = { lockEndpoint, unlockEndpoint }
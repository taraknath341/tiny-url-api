"use strict";
const { MongoClient } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
let collection;

const RandomRouteGenarotor = function () {
	const letter = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
	let route = "";
	for (let c = 5; c; c--) {
		let b = Math.round(Math.random() * 1);
		if (b) {
			b = "toUpperCase"
		} else {
			b = "toLowerCase";
		}
		route += String(letter[Math.round(Math.random() * (letter.length - 1))])[b]();
	}
	return route;
}
let isdbConnected = false;
const connectDB = async () => {
	try {
		const mongo = await MongoClient.connect(process.env.MONGODB_URL);
		console.log("Mongodb Connect Success");
		isdbConnected = true;
		collection = mongo.db("mydb").collection("tiny-url");
	} catch ({ message }) {
		console.log(message);
		res.status(500).end("Server Error");
	}
}

app.use((req, res, next) => {
	if (!isdbConnected) {
		connectDB();
	}
	next();
})

app.use(cors());

app.all("/", async (req, res) => {
	try {
		const url = req.query.url;
		if (url == null) {
			res.json({
				success: false,
				message: "?url not found"
			})
			res.end();
			return;
		}
		if (url.indexOf("https://") !== -1 || url.indexOf("http://") !== -1) {
			res.json({
				success: false,
				message: "Without http or https. like google.com"
			})
			res.end();
			return;
		}
		let data = await collection.findOne({ url }, {
			projection: ["route"]
		})
		if (data != null) {
			res.json({
				success: true,
				message: `${req.host}/${data.route}`
			});
			res.end();
			return;
		}
		let route;
		async function routeIsValid() {
			route = RandomRouteGenarotor();
			data = await collection.findOne({ route }, {
				projection: ["route"]
			});
			if (data != null) {
				return await routeIsValid();
			}
		}
		await routeIsValid();
		await collection.insertOne({ url, route });
		res.json({
			success: true,
			message: `${req.host}/${route}`
		})
		res.end();
	} catch ({ message }) {
		console.log(message);
		res.status(500).end("Server Error");
	}
})

app.get("/:route", async (req, res) => {
	try {
		const route = req.params.route;
		const data = await collection.findOne({ route }, {
			projection: ["url"]
		});
		if (data == null) {
			res.status(404).send("Page Not Found");
			return;
		}
		res.redirect("https://" + data.url);
		res.end();
	} catch ({ message }) {
		console.log(message);
		res.status(500).end("Server Error");
	}
})


module.exports = app;

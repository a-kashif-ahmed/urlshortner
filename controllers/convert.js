const fs = require('fs');
const mongoose = require('mongoose');
const shortid = require('shortid');
const Url = require('../models/url');
const { randomInt } = require('crypto');
const MANGODB_URI = process.env.MONGODB ?? "mongodb+srv://dbadmin:kashif5017@cluster0.asqex.mongodb.net/shorturl?retryWrites=true&w=majority";

// Ensure the connection is set up only once
mongoose.connect(MANGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// Use async/await to catch any potential connection issues
async function converts(body) {
    if (!body.url) return res.status(400).render("home", { msg: "No URL Found" });

    const shrtid = shortid();
    try {
        // Fetch IP and create DB entry in parallel
        const [ipData] = await Promise.all([
            fetch('https://api.ipify.org?format=json').then(response => response.json())
        ]);

        const ip = ipData.ip;
        await Url.create({
            shortid: shrtid,
            actualurl: body.url,
            ipadd:ip
        }); // Update URL with IP after creation

        const srt = "localhost:8000/" + shrtid;
        return srt;
    } catch (err) {
        throw new Error("Error in URL creation: " + err.message);
    }
}

// Optimized display function
async function display() {
    try {
        // Get IP and query the DB simultaneously
        const [ipData] = await Promise.all([
            fetch('https://api.ipify.org?format=json').then(response => response.json())
        ]);

        const ip = ipData.ip;
        const result = await Url.find({ ipadd: ip }).lean(); // Use .lean() to optimize query response

        return result || null;
    } catch (err) {
        throw new Error("Error fetching URL: " + err.message);
    }
}

// Optimized redirection function
async function redrct(req) {
    const srt = req.params.srt;
    try {
        const result = await Url.findOne({ shortid: srt }).lean(); // Use .lean() to return plain JavaScript object
        return result ? result.actualurl : null;
    } catch (err) {
        throw new Error("Error fetching redirection URL: " + err.message);
    }
}

module.exports = {
    converts,
    redrct,
    display
};

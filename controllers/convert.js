const fetch = require('node-fetch');
const mongoose = require('mongoose');
const shortid = require('shortid');
const Url = require('../models/url');
const { randomInt } = require('crypto');
const MANGODB_URI = process.env.MONGODB || "mongodb+srv://dbadmin:kashif5017@cluster0.asqex.mongodb.net/shorturl?retryWrites=true&w=majority";
mongoose.connect(MANGODB_URI);

async function converts(body, res) {
    if (!body.url) return res.status(400).render("home", { msg: "No URL Found" });

    let ip;

    try {
        // Fetch the IP address
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ip = data.ip;  // Ensure the IP is fetched successfully
    } catch (error) {
        console.error("Error fetching IP address:", error);
        return res.status(500).render("home", { msg: "Failed to get IP address" });
    }

    if (!ip) {
        return res.status(400).render("home", { msg: "IP address is required" });
    }

    // Create short ID and add entry in database
    const shrtid = shortid.generate();

    try {
        await Url.create({
            shortid: shrtid,
            actualurl: body.url,
            ipadd: ip  // Ensure ipadd is set correctly
        });
    } catch (err) {
        console.error("Error in URL creation:", err);
        return res.status(500).render("home", { msg: "Error in URL creation" });
    }

    const srt = "localhost:8000/" + shrtid;
    return srt;
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

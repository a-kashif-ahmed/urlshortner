const mongoose = require('mongoose');
const shortid = require('shortid');
const Url = require('../models/url');
const { randomInt } = require('crypto');
const { escape } = require('querystring');
// Assuming you're using node-fetch for IP fetching
const MANGODB_URI = process.env.MONGODB || "mongodb+srv://dbadmin:kashif5017@cluster0.asqex.mongodb.net/shorturl?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(MANGODB_URI);

// Optimized URL shortener function
async function converts(body, res) {
    if (!body.url) return res.status(400).render("home", { msg: "No URL Found" });

    try {
        var shrtid = shortid.generate();
        const srt = "https://urlshortner-puce-seven.vercel.app/" + shrtid;
        // Simultaneously create short ID and fetch the IP
        const [ipData] = await Promise.all([
            fetch('https://api.ipify.org?format=json').then(response => response.json()),
            ]);

        const ip = ipData.ip;
    
        // Save URL data to MongoDB
        await Url.create({
            shortid: shrtid,
            actualurl: body.url,
            ipadd: ip
        });

       
        return srt;

    } catch (err) {
        console.error("Error in URL creation:", err);
        return res.status(500).render("home", { msg: "Error in URL creation" });
    }
}

// Optimized display function
async function display() {
    try {
        // Fetch IP and query the database
        const ipData = await fetch('https://api.ipify.org?format=json').then(response => response.json());
        const ip = ipData.ip;

        const result = await Url.find({ ipadd: ip }); // .lean() to improve performance

        return result || null;
    } catch (err) {
        throw new Error("Error fetching URL: " + err.message);
    }
}

// Optimized redirection function
async function redrct(req) {
    const srt = req.params.srt;
    try {
        const result = await Url.findOne({ shortid: srt }).lean(); // .lean() improves query performance
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

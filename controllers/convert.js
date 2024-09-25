const fs = require('fs');
const mongoose = require('mongoose')
const shortid = require('shortid');
const Url = require('../models/url');
const { randomInt } = require('crypto');
const MANGODB_URI = process.env.MONGODB ?? "mongodb+srv://dbadmin:kashif501@7@cluster0.asqex.mongodb.net/shorturl?retryWrites=true&w=majority"
mongoose.connect(MANGODB_URI);

async function converts(body) {
    // const body = req.body;
    if (!body.url) return res.status(400).render("home", { msg: "No URL Found" });
    var shrtid = shortid();
    var ip;
    // var ide = randomInt(1000);
    const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ip = data.ip;

    await Url.create({
        shortid: shrtid,
        actualurl: body.url,
        ipadd:ip
    });

    var srt = "localhost:8000/" + shrtid;
    // console.log(srt);
    return srt;
}

async function display() {
    
 
    // var ide = randomInt(1000);
    const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
       const ip = data.ip;
        try {
            const result = await Url.find({ ipadd: ip });
    
            if (result) {
            //    console.log("Found URL:", result.actualurl);  // Log the result
                return result;

            } else {
                //  console.log("Shortid not found in the database.");
                return null;
            }
            
        } catch (err) {
            //  console.error("Error fetching URL from the database:", err);
            throw new Error("Database error");
        }
    
}


async function redrct(req) {
    const srt = req.params.srt;  // Get the shortid from URL params
    // console.log("Looking for shortid:", srt);  // Debugging step

    try {
        const result = await Url.findOne({ shortid: srt });

        if (result) {
            // console.log("Found URL:", result.actualurl);  // Log the result
            return result.actualurl;
        } else {
            // console.log("Shortid not found in the database.");
            return null;
        }
    } catch (err) {
        // console.error("Error fetching URL from the database:", err);
        throw new Error("Database error");
    }
}


module.exports = {
    converts,
    redrct,
    display


};
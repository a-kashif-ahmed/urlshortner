const mongoose = require('mongoose');
const shortid = require('shortid');
const Url = require('../models/url');
const { randomInt } = require('crypto');
const { escape } = require('querystring');
const PortfolioIp = require('../models/portfolioIp');
const admin = require('../models/admin');
const OtherIp = require('../models/otherIp');

const MANGODB_URI = process.env.MONGODB || "mongodb+srv://dbadmin:kashif5017@cluster0.asqex.mongodb.net/shorturl?retryWrites=true&w=majority";

// global variable to store connection (beginner approach)
let isConnected = false;

// function to connect to database
async function connectDB() {
  if (isConnected) {
    return;
  }
  
  try {
    // basic mongoose connection
    await mongoose.connect(MANGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    isConnected = true;
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log('Database connection failed:', error);
    throw error;
  }
}

const redirectMap = {
  linkedin: "https://www.linkedin.com/in/a-kashif-ahmed/",
  github: "https://www.github.com/a-kashif-ahmed/",
  mobile: "tel:+919121947486",
  email: "mailto:akashifahmed31@gmail.com",
  whatsapp: "https://wa.me/+919121947486",
  urlshort: "https://urlshortner-kashif.vercel.app/",
  zocosto: "https://zocosto.com"
};

// function to create short url
async function converts(body, res) {
  if (!body.url) {
    return res.status(400).render("home", { msg: "No URL Found" });
  }
  
  try {
    // connect to database first
    await connectDB();
    
    // generate short id
    var shrtid = shortid.generate();
    const srt = "https://urlshortner-kashif.vercel.app/" + shrtid;
    
    // get user IP address
    let ip = "unknown";
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ip = ipData.ip;
    } catch (err) {
      console.log("Could not get IP:", err);
      // continue without IP
    }
    
    // save to database
    const newUrl = new Url({
      shortid: shrtid,
      actualurl: body.url,
      ipadd: ip
    });
    
    await newUrl.save();
    
    return srt;
  } catch (err) {
    console.error("Error in URL creation:", err);
    return res.status(500).render("home", { msg: "Error in URL creation" });
  }
}

// function to get all urls for current user
async function display() {
  try {
    // connect to database
    await connectDB();
    
    // get user IP
    let ip = "unknown";
    try {
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      ip = ipData.ip;
    } catch (err) {
      console.log("Could not get IP:", err);
      return null;
    }
    
    // find urls for this IP
    const result = await Url.find({ ipadd: ip });
    console.log(result);
    return result;
  } catch (err) {
    console.log("Error getting URLs:", err);
    throw new Error("Error fetching URL: " + err.message);
  }
}

// function to redirect to actual url
async function redrct(req) {
  const srt = req.params.srt;
  
  try {
    // connect to database
    await connectDB();
    
    // find the url
    const result = await Url.findOne({ shortid: srt });
    
    if (result) {
      return result.actualurl;
    } else {
      return null;
    }
  } catch (err) {
    console.log("Error in redirect:", err);
    throw new Error("Error fetching redirection URL: " + err.message);
  }
}

// function to get user IP
async function getUserIP() {
  try {
    const response = await fetch("https://api.ipify.org?format=json");
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.log("Error getting IP:", error);
    return "unknown";
  }
}

// function to update counter
async function incrementCounter(key) {
  try {
    await connectDB();
    
    // find and update counter
    const result = await admin.findOne({ frm: key });
    
    if (result) {
      // if exists, increment
      result.cnt = result.cnt + 1;
      await result.save();
    } else {
      // if doesn't exist, create new
      const newCounter = new admin({
        frm: key,
        cnt: 1
      });
      await newCounter.save();
    }
  } catch (error) {
    console.log("Error updating counter:", error);
  }
}

// function for portfolio redirects
async function portfolioredirect(req) {
  const term = req.query.s;
  if (!term) {
    console.log("No term provided for portfolio redirect");
    return "/";
  }
  
  const termLower = term.toLowerCase();
  const redirectUrl = redirectMap[termLower];
  
  if (!redirectUrl) {
    console.log("No redirect URL found for term:", termLower);
    return "/";
  }
  
  try {
    await connectDB();
    
    // get user IP
    const ip = await getUserIP();
    
    // save to portfolio IP table
    const portfolioEntry = new PortfolioIp({
      frm: termLower + "portfolio",
      ip: ip
    });
    await portfolioEntry.save();
    
    // update counter
    await incrementCounter(termLower + "portfolio");
    
    return redirectUrl;
  } catch (error) {
    console.log("Error in portfolio redirect:", error);
    return redirectUrl; // still redirect even if logging fails
  }
}

// function for other redirects
async function otheredirect(req) {
  const term = req.query.s;
  const fr = req.query.f;
  
  if (!term) {
    console.log("No term provided for other redirect");
    return "/";
  }
  
  const termLower = term.toLowerCase();
  const frLower = fr ? fr.toLowerCase() : "";
  const redirectUrl = redirectMap[termLower];
  
  if (!redirectUrl) {
    console.log("No redirect URL found for term:", termLower);
    return "/";
  }
  
  try {
    await connectDB();
    
    // get user IP
    const ip = await getUserIP();
    
    // save to other IP table
    const otherEntry = new OtherIp({
      frm: "from " + frLower + " to " + termLower + " ",
      ip: ip
    });
    await otherEntry.save();
    
    // update counter
    await incrementCounter(termLower);
    
    return redirectUrl;
  } catch (error) {
    console.log("Error in other redirect:", error);
    return redirectUrl; // still redirect even if logging fails
  }
}

// export all functions
module.exports = {
  converts,
  redrct,
  display,
  portfolioredirect,
  otheredirect
};
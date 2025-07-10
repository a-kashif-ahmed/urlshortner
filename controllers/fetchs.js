const MANGODB_URI = process.env.MONGODB || "mongodb+srv://dbadmin:kashif5017@cluster0.asqex.mongodb.net/shorturl?retryWrites=true&w=majority";
const mongoose = require('mongoose');

const portfolioIp = require('../models/portfolioIp');
const admin = require('../models/admin');
const otherIp = require('../models/otherIp');
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

async function fetchall() {
    await connectDB();
    const visits = await admin.find({});
    const thorughp = await portfolioIp.find({});
    const thorughO = await otherIp.find({});
    if(!visits){
        return null;

    }
    return JSON.stringify({
        visits,
        thorughp,
        thorughO
    });
    
}


module.exports={
    fetchall
}
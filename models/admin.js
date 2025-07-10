const mongoose = require('mongoose');


const Admin = new mongoose.Schema(
    {
        cnt:{
            type:Number,
            required:true,
            default:0
        },
        frm:{
            type:String,
            required:true,
        }
    },{ timestamps: true }
);

const admins = mongoose.model('admins',Admin);

module.exports=admins;
const mongoose = require('mongoose');


const Sch = new mongoose.Schema(
    {
        shortid:{
            type:String,
            required:true,
            unique:true,
        },
        actualurl:{
            type:String,
            required:true
        },
        ipadd:{
            type:String,
            required:true
        },
        // id:{
        //     type:Number,
        //     required:true,
        //     unique:true
        // }
    },{ timestamps: true }
);

const url = mongoose.model('url',Sch);

module.exports=url;
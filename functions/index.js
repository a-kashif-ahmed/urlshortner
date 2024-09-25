// // const PORT = 8000;
// const fs = require('fs')
const path = require('path')
const {converts, redrct, display } = require('./convert');
// const serverless = require('serverless-http')
const express = require('express');
const app = express();
app.use(express.json());
app.set('view engine','ejs')
app.set("views", path.resolve("./views"))
app.use(express.urlencoded({extended:false}))


app.get("/", (req,res)=>{
    res.render("index");
})

app.post("/",  async (req, res)=>{
    const va = await converts(req.body);
    res.render("index", {
        convUrl: va ,
    });
    

})
app.post("/urls", async (req,res)=>{
 
    const urlss = await display();
    
    res.render("index",{
        result: urlss,
    })
})
app.get("/:srt",async (req,res)=>{
const va = await redrct(req);
// console.log(va);
res.redirect(va);
})
// app.listen(PORT,(req,res)=>{
//     console.log(`Server Live at :${PORT}`)
// })


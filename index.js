const PORT = 8000;
const fs = require('fs')
const path = require('path')
const {converts, redrct, display, log, sign, portfolioredirect, otheredirect,trackport } = require('./controllers/convert');
const {fetchall} = require('./controllers/fetchs');
const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.set('view engine','ejs')
app.set("views", path.resolve("./views"))
app.use(express.urlencoded({extended:false}))

app.use(cors({
  origin:'*',
  credentials: false,
}));
app.get("/", (req,res)=>{
    res.render("home");
})

app.post("/",  async (req, res)=>{
    const va = await converts(req.body, res); // pass res parameter
    if (va && !res.headersSent) {
        res.render("home", {
            convUrl: va ,
        });
    }
}); 

app.get('/ad',(req,res)=>{
    res.send("<h1>Space</h1>")
});

app.get('/favicon.ico', (req, res) => res.status(204));

app.post("/urls", async (req,res)=>{
    const urlss = await display();
    
    res.render("home",{
        result: urlss,
    })
});
app.get('/x', async (req, res) => {
  try {
    const all = await fetchall();

    if (!all) {
      return res.status(500).json({ error: "Failed to fetch data" });
    }

    // Send JSON response to client
    return res.status(200).send(all); // or res.json(JSON.parse(all)) if it's a stringified object
  } catch (err) {
    console.error("Error in /x route:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

app.get('/p', async (req,res)=>{
    console.log("Portfolio redirect requested");
    try {
        const por = await portfolioredirect(req);
        if(por && por !== "/") {
            return res.redirect(por);
        } else {
            return res.redirect("/"); // redirect to home instead of null
        }
    } catch (error) {
        console.log("Error in portfolio redirect:", error);
        return res.redirect("/");
    }
});

app.get('/o', async (req,res)=>{
    console.log("Other redirect requested");
    try {
        const kor = await otheredirect(req);
        if(kor && kor !== "/") {
            return res.redirect(kor);
        } else {
            return res.redirect("/"); // redirect to home instead of null
        }
    } catch (error) {
        console.log("Error in other redirect:", error);
        return res.redirect("/");
    }
});

app.get("/:srt", async (req,res)=>{
    console.log("Short URL requested:", req.params.srt);
    try {
        const va = await redrct(req);
        if(va) {
            res.redirect(va);
        } else {
            // if short URL not found, redirect to home page
            console.log("Short URL not found, redirecting to home");
            res.redirect("/");
        }
    } catch (error) {
        console.log("Error in redirect:", error);
        res.redirect("/");
    }
})

module.exports=app;
app.listen(PORT,(req,res)=>{
    console.log(`Server Live at :${PORT}`)
})
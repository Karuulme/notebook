const express = require("express");
const session = require("express-session");
const cors = require('cors');
const app = express();
app.use(cors());

//------------------------------------------------------------------- BAĞIMLILIKLAR
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
//------------------------------------------------------------------- SESSİON
app.use(session({
    secret:"7ğsxzf24823454!..asdı21184",
    cookie:{maxAge:1800000},
    saveUninitialized:false
}));
//------------------------------------------------------------------- DOSYA BAĞLANTILARI
const connection = require("./connection.js");
const signupAndLogin = require("./signupAndLogin.js");
const status = require("./NTSTATUS.js");
const model = require("./models.js");
//------------------------------------------------------------------- API İSTEKLERİ
var lastOpenTest;
app.post("/addFolder", (req, res) => {
    model.folderView(req.body).then((html)=>{
        res.send(html);
    }).catch(()=>{
        res.send("memet4");//res.send(status.unsuccessful);
    });
});
//-------------------------------------------------------------------
app.post("/addfile", (req, res) => {
    connection.setAddFile(req.body.param).then((data) => {
        res.send(data);
    });
});
//-------------------------------------------------------------------
app.post("/data", (req, res) => {
    lastOpenTest=req.body.param;
    connection.getTexts(req.body.param).then((data) => {
        res.send(data);
    });
});
//-------------------------------------------------------------------
app.post("/login", (req, res) => {
    var returnLogin=signupAndLogin.Login(req.body);
    if(returnLogin.success==status.success){
        req.session.authenticated=true;
        req.session.use=returnLogin.uid;
        res.redirect("/");
    }
    else{
        res.render("login",login=status.unsuccessful);
    }
});
//-------------------------------------------------------------------
app.use("/login", (req, res) => {
    if(req.session.authenticated) {   
        res.redirect("/");
    }
    else{
        res.render("login",{login:null});
    }
});
//-------------------------------------------------------------------
app.use("/signup", (req, res) => {
    if(req.session.authenticated) {   
        res.redirect("/");
    }
    else{
        res.render("signup",{signup:null});
    }
});
//-------------------------------------------------------------------
app.post("/signup", (req, res) => {
    if(req.session.authenticated) {   
        res.redirect("/");
    }
    else{
        var returnSingup=signupAndLogin.Signup(req.body)
        res.render("signup",{
            signup:returnSingup
        });
    }
});
//-------------------------------------------------------------------
app.use("/", (req, res) => {
    connection.fetchData().then((data) => {
        res.render("index",{folders:data,endTexts:lastOpenTest});
       /* if(req.session.authenticated) {   
            res.render("index",{folders:data});
        }
        else{
            res.redirect("login");
        }*/
    });

});
//-------------------------------------------------------------------
/*
app.get("/sse", (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    onValue(_db.realTimeDb, (snapshot) =>{
        const data = snapshot.val();
        res.write(`data: ${JSON.stringify(data)}\n\n`);
    });
});*/
//------------------------------------------------------------------- DİNLEYİCİ
app.listen(3000, () => {
    console.log("listening on port 3000");
});

const express = require('express');
const path = require("path");
const fs = require("fs");
const app = express();
const bodyParser = require('body-parser');

const morgan = require("morgan");

const db = require('./config');
const mysql = require("mysql");
const pool = mysql.createPool(db);

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, "views"));
app.set('view engine', "ejs");


//app.use(express.static(path.join(__dirname, "public")));
app.use('/public', express.static(path.join(__dirname, "/public")));
app.use('/css', express.static(path.join(__dirname, "/public/css")));
app.use('/js', express.static(path.join(__dirname, "/public/js")));

const log = fs.createWriteStream('error.log', {flags: 'a'});
app.use(morgan('combined', {stream: log}));


const session = require("express-session");

app.use(session({
    secret: 'test',
    resave: false,
    key : 'express.sid',
    saveUninitialized: true
}));


app.use("/", require('./router/index'));

/**
 * Model
 */

const User = require('./models/User/user')(pool);
const Messenger = require('./models/Messenger/messenger')(pool);

/**
 * Controllers
 */

const AuthController = require('./controllers/login/AuthController')(User);
const HomeController = require('./controllers/HomeController')();
const ProfileController = require('./controllers/ProfileController')(User);


const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

const StrategyLocal = require('passport-local');

passport.use("local", new StrategyLocal(function (username, password, done) {
    User.findByUserName(username, password, function (err, rows) {
        if (rows || rows.length === 1) {
            return done(err, rows[0]);
        } else {
            return done(null, false, {message: "incorected"});
        }
    });
}));

passport.use("admin", new StrategyLocal(function (username, password, done) {
    User.findByAdminName(username, password, function (err, rows) {
        if (rows || rows.length == 1) {
            return done(err, rows[0]);
        } else {
            return done(null, false, {message: "incorected"});
        }
    });
}));

passport.serializeUser(function (req,user, done) {
    return done(null, {
        id:user.id,
        url:req.originalUrl
    });
});

passport.deserializeUser(function (data, done) {
    var table = data.url === '/login' ? "users" : "admin";
    User.table = table;
    User.findById(data.id,table, function (err, rows) {
        if (rows || rows.length === 1) {
            return done(err, rows)
        } else {
            return done(null, false, {message: "Incorected"});
        }
    });
    console.log(data.url);
});


app.all('/messenger', function (req, res) {
    if (req.isAuthenticated()){
        req.on("data", function (chunk) {
            var data = JSON.parse(chunk.toString());
            Messenger.getMessages(req.user[0].id, call);
            function call(err, rows) {
                if (!err) {
                    res.send(200, {message: rows});
                }
            }
        });
    }

});

app.all('/chat', function (req, res) {
    req.on("data", function (chunk) {
        var data = JSON.parse(chunk.toString());
        Messenger.getChat(req.user[0].id, data.rId, call);
        function call(err, rows) {
          //  console.log("rows:" + rows);
            if (!err) {
                res.send(200, {message: rows});
            }
        }
    });
});


app.get('/login', AuthController.login);
app.post('/login', passport.authenticate('local',{ failureRedirect: '/login' }), AuthController.postLogin);

app.get('/adLogin', AuthController.adminLogin);
app.post('/adLogin', passport.authenticate('admin',{ failureRedirect: '/login' }), AuthController.postAdminLogin);

app.get('/logout', function (req, res) {

    req.session.destroy(function(){
        req.session = null;
        res.clearCookie('express.sid', { path: '/' });
        req.logout();
        res.redirect('/login');

    });

});

app.get('/home', HomeController.index);
app.get('/profile', ProfileController.index);

const server = app.listen(process.env.PORT || 8000, function () {
    console.log(`Server is listening ${server.address().port}`);
});

require('./socket/index')(server);



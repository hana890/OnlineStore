const express = require('express');
const router = express.Router();
const pool = require('../config/pool');
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/avatar/')
    },
    filename: function (req, file, cb) {
        var mime = file.mimetype.split("/");
        cb(null, file.fieldname + '-' + Date.now() + '.' + mime[1]);
    }
});

const upload = multer({storage: storage});

const session = require("express-session");

router.use(session({
    secret: 'test',
    resave: false,
    key : 'express.sid',
    saveUninitialized: true
}));


const localStorage = require('localStorage');

/**
 * Model
 */

const User = require('../models/User/user')(pool);
const Messenger = require('../models/Messenger/messenger')(pool);

/**
 * Controllers
 */

const AuthController = require('../controllers/login/AuthController')(User);
const HomeController = require('../controllers/HomeController')();
const SearchController = require('../controllers/SearchController')(User);
const ProfileController = require('../controllers/ProfileController')(User);
const CartController = require('../controllers/CartController.js')(localStorage);



const passport = require('passport');
router.use(passport.initialize());
router.use(passport.session());

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
    var token = data.url === '/login' ? "users" : "admin";
    User.token = token;
    if (token === 'users'){
        User.findById(data.id,cb);
        User.setIsLogin(data.id,1,function (err, rows) {
            console.log("err:" + err);
            // console.log(`req.rows: ${JSON.stringify(rows)}`)
        })
    }
    else User.findByAdminId(data.id,cb);

    function cb(err, rows) {
        if (rows || rows.length === 1) {
            return done(err, rows)
        } else {
            return done(null, false, {message: "Incorected"});
        }
    }
});


router.all('/messenger', function (req, res) {
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

router.all('/chat', function (req, res) {
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

router.get('/cart',CartController.index);
router.post('/cart',CartController.getCartVal);
router.post('/cart/remove',CartController.removeProduct);

router.get('/login', AuthController.login);
router.post('/login', passport.authenticate('local',{ failureRedirect: '/login' }), AuthController.postLogin);

router.get('/adLogin', AuthController.adminLogin);
router.post('/adLogin', passport.authenticate('admin',{ failureRedirect: '/login' }), AuthController.postAdminLogin);

router.get('/logout', function (req, res) {

    User.setIsLogin(req.user[0].id,0,function (err, rows) {
        console.log("errL:" + err);
        // console.log(`req.rows: ${JSON.stringify(rows)}`)
    });

    req.session.destroy(function(){
        req.session = null;
        res.clearCookie('express.sid', { path: '/' });
        req.logout();
        res.redirect('/login');
    });

});

router.get('/home', HomeController.index);
router.get('/search', SearchController.index);
router.get('/profile', ProfileController.index);
router.all('/addAvatar', upload.single('avatar'), ProfileController.uploadImg);
router.all('/getAvatar', ProfileController.getAvatar);
router.all('/searchUsers', SearchController.searchUsers);

module.exports = router;
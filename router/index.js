const express = require('express');
const router = express.Router();

const multer = require("multer");
const pool = require('../config/pool');

var stripe = require("stripe")("sk_test_zcOspggiLXx88YFmGOYRsEyT");

// stripe.balance.retrieveTransaction(
//     "txn_1Dh1zr2eZvKYlo2Cfjs29NDb",
//     function(err, balanceTransaction) {
//         // asynchronously called
//     }
// );


/**
 * Models
 */

const User = require('../models/User/user')(pool);
const Category = require('../models/Category/category')(pool);
const Product = require("../models/Product/product")(pool);

/**
 * Controllers
 */

const AuthController = require('../controllers/login/AuthController')(User);
const AddProductController = require('../controllers/AddProductController')(Category, Product);

const ProductsController = require('../controllers/ProductsController')(Product);


const AddCategoryController = require('../controllers/AddCategoryController');
const PasswordRecovery = require('../controllers/login/PasswordRecovery');
const ChangePasswordController = require('../controllers/login/ChangePasswordController');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        var mime = file.mimetype.split("/");
        cb(null, file.fieldname + '-' + Date.now() + '.' + mime[1]);
    }
});

const upload = multer({storage: storage});

router.get('/register', AuthController.register);
router.post('/register', AuthController.postRegister);

router.get('/passwordRecovery', PasswordRecovery.index);
router.post('/passwordRecovery', PasswordRecovery.index);

router.get('/changePassword', ChangePasswordController.index);
router.post('/changePassword', ChangePasswordController.index);


/*
load menu pages
 */

router.get('/products', ProductsController.index);
router.get('/products/:id', ProductsController.indexParams);

router.post('/charge', (req, res) => {
    const amount = parseInt(req.body.chargeAmount);

    // var keys = Object.keys('req.body:' + req.body);
    // for (let i in  req) {
    //     console.log(i);
    // }

    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
        .then(customer => stripe.charges.create({
            amount,
            description: 'Example charge',
            currency: 'amd',
            customer: customer.id
        }))
        .then(charge => res.send('The Purchase Transaction Was Successful'));
});

router.all('/filter', ProductsController.filter);


router.get('/addProduct', AddProductController.index);
router.all('/addProduct', upload.single('img'), AddProductController.addProduct);
router.get('/addCategory', AddCategoryController.index);

module.exports = router;


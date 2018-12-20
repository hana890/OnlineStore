const express = require('express');
const path = require("path");
const fs = require("fs");
const app = express();
const bodyParser = require('body-parser');

const morgan = require("morgan");

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', path.join(__dirname, "views"));
app.set('view engine', "ejs");


//app.use(express.static(path.join(__dirname,  "public")));
app.use('/public', express.static(path.join(__dirname,  "/public")));
app.use('/css', express.static(path.join(__dirname, "/public/css")));
app.use('/js', express.static(path.join(__dirname, "/public/js")));

const log = fs.createWriteStream('error.log', {flags: 'a'});
app.use(morgan('combined', {stream: log}));


app.use("/", require('./router/index'));
app.use("/", require('./router/user'));

const port = process.env.PORT || 7000;
const server = app.listen(port, function () {
    console.log(`Server is listening ${server.address().port}`);
});

require('./socket/index')(server);



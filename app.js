const express = require('express');
const app = express();
const bodyParser = require('body-parser'); // to send a req from frontend to deatabase
app.set('view engine','ejs')
app.use(express.static('views'));
app.use(express.static('upload'));
app.use(bodyParser.urlencoded({extended: true}));



const router = require('./controlar/auth');

app.use('/' , router)
app.listen(5500)



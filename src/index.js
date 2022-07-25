const express = require('express');
var bodyParser = require('body-parser');
const route = require('./routes/route.js');
const mongoose = require('mongoose')
const multer=require('multer');

const app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any())

mongoose.connect("mongodb+srv://Sajala1997:wbcDbgodbFCDVNuz@cluster0.yjgci.mongodb.net/Group3Database", { useNewUrlParser: true })
    .then(() => console.log('mongodb running on cluster ✔'))
    .catch(err => console.log(err))


app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port 🎧' + (process.env.PORT || 3000))
});
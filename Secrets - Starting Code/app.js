//jshint esversion:6
const express = require('express');
const app = express();

const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
const md5 = require('md5');

const port = 3000 || process.env.PORT;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect('mongodb://localhost:27017/userDB',
{ useNewUrlParser: true })
.then(() => {
    console.log('DB Connected successfully');
}).catch((error) => {
    console.log(error);
});

app.get('/', (req, res) => {
    res.render('home');
});

//login routes

app.route('/login')
.get((req, res) => {
    res.render('login');
})

.post(async (req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);

    const user = await User.findOne({ email: email });

    if (user) {
        if (user.password === password) {
            res.render('secrets');
        }
    } else {
        console.log('Not authorized');
    }
})

//register routes

app.route('/register')

.get((req, res) => {
    res.render('register');
})

.post((req, res) => {
    const email = req.body.email;
    const password = md5(req.body.password);

    const newUser = new User({ email, password });

    newUser.save()
    .then(() => {
        res.render('secrets');
    }).catch((error) => {
        console.log(error);
    });
})



app.listen(port, () => {
    console.log(`App is listening on port: ${port}`);
})
//jshint esversion:6
const express = require('express');
const app = express();

const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/user');
// const md5 = require('md5');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const findOrCreate = require('mongoose-findorcreate');

const port = 3000 || process.env.PORT;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'My little secret.',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect('mongodb://localhost:27017/userDB',
{ useNewUrlParser: true })
.then(() => {
    console.log('DB Connected successfully');
}).catch((error) => {
    console.log(error);
});

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch(err) {
        done(err, null);
    }
});

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/', (req, res) => {
    res.render('home');
});

//auth with google

app.get("/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

app.get("/auth/google/secrets", 
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  });

//login routes

app.route('/login')
.get((req, res) => {
    res.render('login');
});

// .post(async (req, res) => {
//     const email = req.body.email;
//     // const password = md5(req.body.password);
//     const password = req.body.password;

//     const user = await User.findOne({ email: email });

//     if (user) {
//         bcrypt.compare(password, user.password, (err, result) => {
//             if (result === true) {
//                 res.render('secrets');
//             }
//         });
//     } else {
//         console.log('Not authorized');
//     }
// })

// get secrets page

app.get('/secrets', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('secrets');
    } else {
        res.redirect('/login');
    }
});

//logout user

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
    });
    res.redirect('/');
});

//register routes

app.route('/register')

.get((req, res) => {
    res.render('register');
})

.post((req, res) => {
    User.register({username: req.body.username}, req.body.password, function(err, user) {
        if (err) {
            console.log('error registering the user.');
            console.log(err);
            res.redirect('/register');
        } else {
            passport.authenticate('local')(req, res, function() {
                res.redirect('/secrets');
            });
        }
    });
});

// .post((req, res) => {
//     // const password = md5(req.body.password);
//     bcrypt.hash(req.body.password, saltRounds, (err, hash) => {

//         const newUser = new User({ email: req.body.email, password: hash });

//         newUser.save()
//         .then(() => {
//             res.render('secrets');
//         }).catch((error) => {
//             console.log(error);
//         });
//     });
// })

app.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    req.login(user, function(err){
        if (err) {
            console.log(err);
        } else {
            passport.authenticate('local')(req, res, function(){
                res.redirect('/secrets');
            });
        }
    });
});



app.listen(port, () => {
    console.log(`App is listening on port: ${port}`);
})
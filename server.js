//include express (routing)
const express = require('express');
//include bodyparser (middleware)
const bodyParser = require('body-parser');
//include bcrypt (hash pwd)
const bcrypt = require('bcrypt');
//include jsonwebtoken (token for login)
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const User = require('./models/userModel.js');

//connect to mongoose
mongoose.connect('mongodb+srv://FrankZiWANG-dev:PetDBadmin1!@pets.og7dw.mongodb.net/Pets?retryWrites=true&w=majority');

//init server
const app = express();

//init body parser (parsing url encoded data from the body, without using Qs library)
app.use(bodyParser.urlencoded({extended: false}));

//init ejs engine
app.set('view-engine', 'ejs');

//route to Homepage (route path that sends a request, with a response that renders a file)
app.get('/', (req,res) =>{
    res.render('index.ejs', { name : 'Frank'});
});

//route to register page
app.get('/register', (req,res) =>{
    res.render('register.ejs');
});

//route to send info to server by post request, to register
app.post('/register', async(req, res) => {
    if(req.body.password == req.body.rePassword){
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            });
            user
                .save()
                .then(result =>{
                    console.log(result);
                    res.redirect('/login');
                })
                .catch(err => console.log(err));
           
        } catch{
            res.redirect('/register')
        }
    }
});

//route to login page
app.get('/login', (req,res) =>{
    res.render('login.ejs');
});
//route to send info to server to actually log in
app.post('/login', (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    User.findOne({'username':username})
    .then(user => {
        if(user){
            bcrypt.compare(password, user.password, function(err, result) {
                if(err) {
                    res.json({
                        error: err
                    })
                }
                else if(result){
                    console.log('Login successfull!');
                    res.redirect('/dashboard');

                } else {
                    res.json({
                        message: 'Password does not match'
                    })
                }  
            })
        } else {
            res.json({
                message: 'No user found!'
            })
        }
    });
});

//route to dashboard page
app.get('/dashboard', (req,res) =>{
    res.render('dashboard.ejs');
});

//define port
const port = 3001;
//function to listen to port
app.listen(port, () => console.log(`This app is listening on port ${port}`));
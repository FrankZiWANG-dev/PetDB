//include express and bodyparser (middleware) and ejs (js templates) and bcrypt (hash pwd) and passport for login validation
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');


//users array
const users =[];

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
    // if(req.body.password == req.body.rePassword){
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10)
            users.push({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            })
            res.redirect('/login')
        } catch{
            res.redirect('/register')
        }
    // }
});

//route to login page
app.get('/login', (req,res) =>{
    res.render('login.ejs');
});
//route to send info to server to actually log in
app.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    res.send(`Username: ${username} Password: ${password}`);
});

//define port
const port = 3001;
//function to listen to port
app.listen(port, () => console.log(`This app is listening on port ${port}`));
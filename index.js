// web framework, helps in structuring our code
const express = require('express');

// to read and write cookies
const cookieParser = require('cookie-parser');

// to initialize express
//app has all the functionalities of the libraries
const app= express(); 

// set up port for communication
const port = 8000;

//for dynamic scripts and styles
const expressLayouts = require('express-ejs-layouts');

//require database
const db= require('./config/mongoose');

//used for session cookie
const session = require('express-session');
//for authentication
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');

//to store session info into the db
const MongoStore = require('connect-mongo')(session);

// flash-message
const flash = require('connect-flash');

// require the flash  middleware
const customMware = require('./config/middleware');

app.use(express.urlencoded());
app.use(cookieParser());

// to access static files
app.use(express.static('./assets'));

//we need to tell the server to use them
app.use(expressLayouts);

//extract style and script from the subpages into the layout
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);


//to tell use ejs as view engine
//set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');


//add a middleware which takes session cookie and encrypts it
//mongo store is used to store the session in the db
app.use(session({
    name: 'regiStarr',
    secret: 'onething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        //in millisecs
        maxAge: (1000*60*100)
    },
    store: new MongoStore(
        {
        
            mongooseConnection: db,
            autoRemove: 'disabled'
        },

        // callback func if connection is not established
        function(err) {
            console.log(err || 'connect-mongodb setup ok');
        }
        )
}));

// tell the app to use passport
app.use(passport.initialize());
app.use(passport.session());

//setup current user usage
app.use(passport.setAuthenticatedUser);

// setup to use flash
app.use(flash());
// to use flash-middleware
app.use(customMware.setFlash);

//telling the app to use the exported router
app.use('/', require('./routes'));

//to make the app listen
app.listen(port, function(err){
    if(err) {
        console.log(`Error in running the server: ${err}`);
    }
        console.log(`Server is running on port: ${port}`);
});
// web framework, helps in structuring our code
const express = require('express');

// to run express funct
//app has all the functionalities of the libraries
const app= express(); 

// set up port for communication
const port = 8000;

//to make the app listen
app.listen(port, function(err){
    if(err) {
        console.log(`Error in running the server: ${err}`);
    }
        console.log(`Server is running on port: ${port}`);
});
const mongoose = require("mongoose");

if(process.argv.length < 3){
    console.log('give a password as an argument');
    process.exit(1)
}

const password = process.argv[2]


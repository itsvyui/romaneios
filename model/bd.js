const mongoose = require('mongoose');
require('dotenv').config();

module.exports = {
    connect(){
        return mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
          })
          .then(() => {console.log('Connected to database')})
          .catch(err => {console.log(err)});
    } 
}


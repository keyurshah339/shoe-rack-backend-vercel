const mongoose = require("mongoose")
const dotenv = require('dotenv');
dotenv.config();

async function initializeDBConnection() {
  try{
    await mongoose.connect(`mongodb+srv://keyur:Tristan1@newcluster.jaeko.mongodb.net/db?retryWrites=true&w=majority`,
     {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  console.log("Connected To Database")
  }catch(error){
    console.log(error, "error connecting to database")
  }
  
}

module.exports = { initializeDBConnection }


 
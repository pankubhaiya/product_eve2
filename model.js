
const mongoose = require("mongoose")
require("dotenv").config()

const userSchema = mongoose.Schema({
      name:{type:String},
      email:{type:String},
      password:{type:String},
      role:{type:String}
})

const usermodel = mongoose.model("user",userSchema)

module.exports = {usermodel}
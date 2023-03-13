const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { usermodel } = require("./model");
const fs = require("fs");
const { json } = require("body-parser");
const { decode } = require("punycode");

const userrouter = express.Router();
userrouter.use(express.json());

userrouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await usermodel.findOne({ email });
    console.log(user);

    if (user) {
      res.send({ mes: "user already register" });
    }

    bcrypt.hash(password, 5, async (err, hash) => {
      if (err) {
        res.send({ err: err.message });
      } else {
        const nuser = new usermodel({ name, email, password: hash });
        await nuser.save();

        res.send({ mes: "registratin successfull" });
      }
    });
  } catch (err) {
    res.send({ mes: err.message });
  }
});

userrouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await usermodel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          let token = jwt.sign({ userID: user._id }, process.env.secret, {
            expiresIn: "1m",
          });
          let refresh = jwt.sign({ userID: user._id }, process.env.refresh, {
            expiresIn: "5m",
          });
          res.send({
            mes: "login succesfull",
            token: token,
            refresh_token: refresh,
          });
        } else {
          res.send("wrong password");
        }
      });
    } else {
      res.send("user not found");
    }
  } catch (err) {
    res.send({ mes: err.message });
  }
});

userrouter.get("/logout", (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    if (token) {
      let file = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"));

      file.push(token);
      fs.writeFileSync("./blacklist.json", JSON.stringify(file));
      res.send("logout successfull");
    }
  } catch (err) {
    res.send({ mes: err.message });
  }
});


userrouter.post("/refresh",(req,res)=>{

    const refresh = req.headers.authorization.split(' ')[1]
    if(!refresh){
        res.send("pleace login first")
    }
        jwt.verify(refresh,process.env.refresh,(err,decoded)=>{
      if(err){
          res.send("wrong token")
      }else{
        let token= jwt.sign({ userId: decoded.userId}, process.env.secret, {expiresIn:"10s"})
        res.send({token:token})
      }
  })
     
})

module.exports = { userrouter };

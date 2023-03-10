const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models/user.model");
const { UserData } = require("../models/userData.model");
const { Address } = require("../models/address.model");
const { Orders } = require("../models/orders.model");
// const bodyParser = require('body-parser')
// const cors = require("cors")
// const app = express();

// app.use(express.json())
// app.use(cors())

const saltRounds = 10;
const secret =
  "gEf3gs2kMagd2CHDXpEjwGJlbVewlqE7ARhD2UIYUJsM8V9c71E4rYGI0AXIn5J2pAi2TrMQHD7FAJOTtLIYIShHDjZjTwvzHodjwutvbTcFCnksFiCBFpqpQqucxyairN4X3hQbmiuKqJQW9XSeblgU5v2BQrEZs86YhgrGxQtWujl3NMu9NRwa9x9noEY7OnuabuIAYNCmsnGC39iq32nBOPvtA4BP+sVuMKW6Qd6//lSr1pSzYHZ9KMYUDnTDvnXQ3q5uSpCGcRTS3//G/nfUdjxjcbz1z9B2hvL+Oh/RXNI1DeFdwphwP9pbJqICm81l1WUe0H7Vs/6irJEq6w==";

router
  .route("/signup")
  // Signup
  .post(async (req, res) => {
    try {
      const user = req.body;
      console.log(req.body);
      bcrypt.hash(user.password, saltRounds, async function (err, hash) {
        if(err){
          return res.status(404).json({err:err})
        }
        const NewUser = new User({ ...user, password: hash });
        await NewUser.save();
        const NewAddress = new Address();
        await NewAddress.save();

        const NewUserData = new UserData({
          userId: NewUser._id,
          address: NewAddress._id,
        });
        await NewUserData.save();

        res.json({
          status: "Signup successful",
          user: NewUser,
          userData: NewUserData,
        });
      });
    } catch (error) {
      res.status(404).json({ status: "failed to signup", message: error.message });
    }
  });

router.post("/login", async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName: userName });
    console.log(userName, password, req.body);
    bcrypt.compare(password, user.password, function (err, result) {
      console.log(err, result);
      if (result) {
        const token = jwt.sign({ userId: user._id }, secret, {
          expiresIn: "24h",
        });
        res.json({
          status: "login success",
          userId: user._id,
          token: token,
          user:user
        });
      } else {
        res.json({ status: "Your password is wrong", errorMessage: err });
      }
    });
  } catch (error) {
    res.json({ status: "User not found", errorMessage: error.message });
  }
});

module.exports = router;

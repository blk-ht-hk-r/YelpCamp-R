const express = require("express"),
      router  = express.Router(),
      bcrypt  = require("bcrypt"),
      jwt     = require("jsonwebtoken"),
      User    = require("../models/User");

//Getting the request for the sign up of a new user
router.post("/register", async (req, res) => {
   try {
      //Searching the database to check if a username exists with the same username
      const ExistingUser = await User.findOne({ username: req.body.username });

      if (ExistingUser) {
         return res.sendStatus(400).end();
      }
      const hashedPassword = await bcrypt.hashSync(req.body.password, 10);
      const createdUser = await User.create({
         ...req.body,
         password: hashedPassword,
      });
      const token = jwt.sign({ id: createdUser._id }, "Samyakjainismyname", {
         expiresIn: "30m",
      });
      req.io.emit("userLoggedIn", createdUser);
      res.json(token);
   } catch (err) {
      console.log(err);
   }
});

//Getting the user request fot login
router.post("/login", async (req, res) => {
   try {
      const foundUser = await User.findOne({ username: req.body.username });

      if (!foundUser) {
         return res.sendStatus(400);
      }
      const didMatch = bcrypt.compareSync(
         req.body.password,
         foundUser.password
      );
      if (!didMatch) {
         return res.sendStatus(401);
      }
      const token = jwt.sign({ id: foundUser._id }, "Samyakjainismyname", {
         expiresIn: "30m",
      });
      req.io.emit("userLoggedIn", foundUser);
      res.json(token);
   } catch (error) {
      console.log(error);
   }
});

//route for getting the loggedIn user
router.get("/getUser", async (req, res) => {
   try {
      let loggedInUser;
      const bearerToken = req.headers.authorisation.split(" ")[1];
      const payload = jwt.verify(bearerToken, "Samyakjainismyname");
      loggedInUser = await User.findById(payload.id);
      res.json(loggedInUser);
   } catch (error) {
      console.log(error);
      res.sendStatus(403).end();
   }
});
//Exporting the Landing page and Auth Routes
module.exports = router;

const express     = require("express"),
      router      = express.Router(),
      jwt         = require("jsonwebtoken"),
      verifyToken = require("../middleware"),
      User        = require("../models/User"),
      Campground  = require("../models/Campground");

//Campground page
router.get("/", async (req, res) => {
   try {
      let campgrounds = await Campground.find();
      res.json(campgrounds);
   } catch (err) {
      console.log(err);
   }
});

//post request handling of new campgorund creation
router.post("/", verifyToken, async (req, res) => {
   try {
      const loggedInUser = await User.findById(req.user.id);
      const campgroundData = {
         ...req.body,
         author: {
            id: loggedInUser._id,
            username: loggedInUser.username,
         },
      };
      const createdCampground = await Campground.create(campgroundData);
      res.json(createdCampground);
   } catch (error) {
      console.log(error);
      res.sendStatus(404).end()
   }
});

//campgrounds show page
router.get("/:id", async (req, res) => {
   try {
      let loggedInUser;
      let statusCode

      //extracting the bearer token from the header
      const bearerToken = req.headers.authorisation.split(" ")[1];
      const isToken = bearerToken !== "null";

      //conditional paths for the having or not, a token
      if (isToken) {
         try {
            const payload = jwt.verify(bearerToken, "Samyakjainismyname");
            loggedInUser = await User.findById(payload.id);
         } catch (error) {
            statusCode = 403
         }
      }

      Campground.findById(req.params.id)
         .populate("comments")
         .exec((err, foundCampground) => {
            if (isToken) {
               res.json({
                  foundCampground,
                  loggedInUser,
                  statusCode
               });
            } else {
               res.json({
                  foundCampground,
               });
            }
         });
   } catch (error) {
      console.log(error)
   }
});

//edit campground route
router.get("/:id/edit", async (req, res) => {
   try {
      foundCampground = await Campground.findById(req.params.id);
      res.json(foundCampground);
   } catch (err) {
      console.log(err);
   }
});

//Update campground route
router.put("/:id", async (req, res) => {
   try {
      await Campground.findByIdAndUpdate(req.params.id, req.body);
      res.sendStatus(200).end();
   } catch (err) {
      console.log(err);
   }
});

//Destroy Campground Route
router.delete("/:id", async (req, res) => {
   try {
      let foundCampground = await Campground.findById(req.params.id);
      await foundCampground.remove();
      res.sendStatus(200).end();
   } catch (err) {
      console.log(err);
   }
});

//Exporting all the Campground Routes
module.exports = router;

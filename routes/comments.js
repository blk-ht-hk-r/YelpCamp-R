const express     = require("express"),
      router      = express.Router({ mergeParams: true }),
      verifyToken = require("../middleware"),
      User        = require("../models/User"),
      Campground  = require("../models/Campground"),
      Comment     = require("../models/Comment");

//new comment post route
router.post("/", verifyToken, async (req, res) => {
   try {
      const loggedInUser = await User.findById(req.user.id);
      const newComment = {
         content: req.body.newComment,
         author: {
            id: req.user.id,
            username: loggedInUser.username,
         },
      };
      const createdComment = await Comment.create(newComment);
      const foundCampground = await Campground.findById(req.params.id);
      foundCampground.comments.push(createdComment);
      foundCampground.save();
      req.io.emit("commentsChanged");
      res.sendStatus(200).end();
   } catch (error) {
      console.log(error);
   }
});

//Comment Upgrade route
router.put("/:comment_id", verifyToken, async (req, res) => {
   try {
      await Comment.findByIdAndUpdate(req.params.comment_id, {
         content: req.body.EditComment,
      });
      req.io.emit("commentsChanged");
      res.sendStatus(200).end();
   } catch (err) {
      console.log(err);
   }
});

//Destroy Comment route
router.delete("/:comment_id", verifyToken, async (req, res) => {
   try {
      const foundComment = await Comment.findById(req.params.comment_id);
      foundComment.remove();
      req.io.emit("commentsChanged");
      res.sendStatus(200).end();
   } catch (error) {
      console.log(error);
   }
});

//Exporting all the Comments Routes
module.exports = router;

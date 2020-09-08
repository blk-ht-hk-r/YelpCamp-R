const verifyToken = require("../middleware");
const User = require("../models/User");
const { findById } = require("../models/User");

const express = require("express"),
      router = express.Router(),
      Campground = require("../models/Campground")
        

//Campground page
router.get("/", async (req, res) => {
    try{
    let campgrounds = await Campground.find();
    res.json(campgrounds)
    }
    catch(err){
        console.log(err)
    }

})

//new campground addintion page route
// router.get("/new" , middleware.isLoggedIn , (req , res) => {
//     res.render("campgrounds/new");
// })

//post request handling of new campgorund creation
router.post("/",  async (req, res) => {
    // Campground.create(req.body.newCampground)
    //  .then(newCampground => {
    //      newCampground.author.id = req.user._id;
    //      newCampground.author.username = req.user.username;
    //      newCampground.save();
    //      req.flash("success", "Campground was successfully added!")
    //      res.redirect("/campgrounds")
    //     })
    //  .catch(console.log);
    await Campground.create(req.body)
    res.status(200).end()
})

//campgrounds show page
router.get("/:id" ,verifyToken, async (req, res) =>{

    let loggedInUser

    if(req.user){
        loggedInUser = await User.findById(req.user.id)
    }
    
    Campground.findById(req.params.id)
     .populate("comments")
     .exec((err , foundCampground) => {
        //  res.render("campgrounds/show" , {campground : foundCampground})
        if(req.user){
            res.json({
                foundCampground,
                loggedInUser
            })
        }
        else{
            res.json({
                foundCampground
            })
        }
     })

});

//edit campground route
router.get("/:id/edit" , async (req, res) => {
    // Campground.findById(req.params.id)
    // .then(foundCampground => {
    //     res.render("campgrounds/edit" , {campground : foundCampground});
    // })
    // .catch(err => {
    //     console.log(err)
    //     res.redirect("/campgrounds")
    // })
    try{
        foundCampground = await Campground.findById(req.params.id)
        res.json(foundCampground)
    }catch(err){
        console.log(err)
    }
        
})

//Update campground route
router.put("/:id", async (req, res) => {
    // Campground.findByIdAndUpdate(req.params.id , req.body.newCampground)
    //  .then(campground => {
    //     req.flash("success", "Camground Was Successfully Updated!") 
    //     res.redirect(`/campgrounds/${req.params.id}`)
    // })
    //  .catch(err => {
    //      console.log(err);
    //      res.redirect("/campgrounds")
    //  })
    try{
        await Campground.findByIdAndUpdate(req.params.id, req.body)
        res.sendStatus(200).end()
    }catch(err){
        console.log(err)
    }
})

//Destroy Campground Route
router.delete("/:id", async (req , res) => {
    // try{
    //     let foundCampground = await Campground.findById(req.params.id);
    //     await foundCampground.remove();
    //     req.flash("success", "Campground was successfully removed!")
    //     res.redirect("/campgrounds")
    // }catch(err){
    //     console.log(err);
    //     res.redirect("/campgrounds");
    // }
    try{
        let foundCampground = await Campground.findById(req.params.id)
        await foundCampground.remove()
        res.sendStatus(200).end()
    }catch(err){
        console.log(err)
    }
})

//Exporting all the Campground Routes
module.exports = router;
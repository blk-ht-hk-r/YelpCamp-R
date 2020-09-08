const express = require("express"),
      router  = express.Router(),
      bcrypt  = require("bcrypt"),
      jwt     = require("jsonwebtoken"),
      User    = require("../models/User")

      //getting the request for the sign up of a new user
router.post("/register", async(req , res) => {
    // User.register(new User({username : req.body.username}) , req.body.password)
    //  .then(createdUser => {
    //      passport.authenticate("local")(req ,res , () => {
    //          req.flash("success", `Welcome to YelpCamp ${createdUser.username}`)
    //          res.redirect("/campgrounds")
    //      })
    //  })
    //  .catch(err => {
    //      console.log(err);
    //      req.flash("error", err.message)
    //      res.redirect("/register");
    //  })
    try{
        //Searching the database to check if a username exists with the same username
        const ExistingUser = await User.findOne({username : req.body.username})

        if(ExistingUser){
            return res.sendStatus(404).send("User Already exists")
        }
        const hashedPassword = await bcrypt.hashSync(req.body.password , 10)
        const createdUser = User.create({...req.body , password : hashedPassword})
        const token = jwt.sign({createdUser}, "Samyakjainismyname")
        res.json(token)


    }catch(err){
        console.log(err)
    }

})

//getting the user request fot login
// router.post("/login", passport.authenticate("local",
//     {
//         successRedirect : "/campgrounds",
//         failureRedirect : "/login"
//     })
// );
router.post("/login", async(req, res) => {
    try {
        const foundUser = await User.findOne({username : req.body.username})
        
        if(!foundUser){
            return res.sendStatus(404)
        }
        const didMatch = bcrypt.compareSync(req.body.password, foundUser.password)
        if(!didMatch){
            return res.sendStatus(404)
        }
        const token = jwt.sign({id : foundUser._id} , "Samyakjainismyname")
        res.json(token)

    } catch (error) {
        console.log(error)
    }

})

//route for the logout
router.get("/logout" , (req, res) => {
    req.flash("success", `Bye ${req.user.username}`)
    req.logout();
    res.redirect("/campgrounds");
})

//Exporting the Landing page and Auth Routes
module.exports = router;
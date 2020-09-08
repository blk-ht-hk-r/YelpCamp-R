// const Campground = require("../models/Campground"),
//       Comment    = require("../models/Comment");
const jwt = require("jsonwebtoken")

//All middleware goes here
// const middlewareObject = {};

// //Campground Ownership check
// middlewareObject.checkCampgroundOwnership = async (req, res, next) => {
//     try{
//         if(req.isAuthenticated()){
//             let foundCampground =await Campground.findById(req.params.id);
//             if(foundCampground.author.id.equals(req.user._id)){
//                 next();
//             }
//             else{
//                 req.flash("error", "You don't have permission to do this!")
//                 res.redirect("back");
//             }
//         }else{
//             req.flash("error" , "You must be Logged In to do this!")
//             res.redirect("back");
//         }
//     }catch(err){
//         req.flash("error", "Oops! Campground Not Found")
//         console.log(err)
//         res.redirect("/campgrounds")
//     }
    
// }

// //Comment Ownership Check
// middlewareObject.checkCommentOwnership = async (req, res, next) => {
//     try{
//         if(req.isAuthenticated()){
//             let foundComment = await Comment.findById(req.params.comment_id)
//             if(foundComment.author.id.equals(req.user._id)){
//                 next();
//             }else{
//                 req.flash("error", "You don't have permission to do this!")
//                 res.redirect("back")
//             }
//         }else{
//             req.flash("error", "You must be Logged In to do this!")
//             res.redirect("back")
//         }
//     }catch(err){
//         console.log(err)
//         res.redirect("/campgrounds")
//     }

// }

//Function to check wether a user is logged IN or not
async function verifyToken(req, res, next){
    // if(req.isAuthenticated()){
    //     return next();
    // }
    // req.flash("error", "You must be Logged In to do this!")
    // res.redirect("/login")
    try {
        const authorisationHeader = req.headers.authorisation
        const bearerToken = authorisationHeader.split(" ")[1]
        if(bearerToken === "null"){
            return next()
        }
        const payload = jwt.verify(bearerToken , "Samyakjainismyname")
        req.user = {id : payload.id}
        next()
    } catch (error) {
        res.send(404).end()
    }
}

//Exporting all the Middleware
module.exports = verifyToken;
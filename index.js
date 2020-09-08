const bodyParser            = require("body-parser"),
      mongoose              = require("mongoose"),
      express               = require("express"),
      Campground            = require("./models/Campground"),
      Comment               = require("./models/Comment"),
      User                  = require("./models/User"),
      bcrypt                = require("bcrypt"),
      jwt                   = require("jsonwebtoken")
      flash                 = require("connect-flash"),
      cors                  = require("cors")
	  app                   = express();

const campgroundRoutes = require("./routes/campgrounds"),
      commentRoutes    = require("./routes/comments"),
      indexRoutes      = require("./routes/index");
      
let url = process.env.DATABASE_URL || "mongodb://localhost:27017/yelpcamp";

mongoose.connect(url , {
	useNewUrlParser : true,
	useUnifiedTopology : true
})
.then(() => console.log("Connected to DB!"))
.catch(err => console.log(err.message));

app.use(cors());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}));
app.use(flash());

//passing the data of flash messages and the current user data to all the templates
// app.use( (req, res, next) => {
//     res.locals.currentUser = req.user;
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
//     next();
// })


app.use("/" , indexRoutes);
app.use("/campgrounds" , campgroundRoutes);
app.use("/campgrounds/:id/comments" , commentRoutes);






//configuring the port settings for heroku hosting
let port = process.env.PORT || 8080;

//Start the server
app.listen(port , () => {
	console.log("Server has started on port 8080!");
});

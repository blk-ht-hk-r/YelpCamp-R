const bodyParser            = require("body-parser"),
      mongoose              = require("mongoose"),
      express               = require("express"),
      Campground            = require("./models/Campground"),
      SocketIO              = require("socket.io"),
      Comment               = require("./models/Comment"),
      User                  = require("./models/User"),
      bcrypt                = require("bcrypt"),
      jwt                   = require("jsonwebtoken"),
      http                  = require("http"),
      helmet                = require("helmet")
      cors                  = require("cors"),
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

//Setting up all the socket.io stuff
const server = http.createServer(app)
const io = SocketIO(server)

//Getting our socket available on all routes by attaching to the req object
app.use((req, res, next) => {
    req.io = io
    next()
})

//starting the socket connection to start listening for the changes
io.on("connection", socket => {
})

app.use(cors());
app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : true}));

app.use("/" , indexRoutes);
app.use("/campgrounds" , campgroundRoutes);
app.use("/campgrounds/:id/comments" , commentRoutes);


//configuring the port settings for heroku hosting
let port = process.env.PORT || 8080;

//Start the server
server.listen(port , () => {
	console.log("Server has started on port 8080!");
});

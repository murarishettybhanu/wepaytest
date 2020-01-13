const expressEdge = require("express-edge");
const express = require("express");
const edge = require("edge.js");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const expressSession = require("express-session");
const connectMongo = require("connect-mongo");
const flash = require('express-flash');
const fs = require('fs');
const http = require('http');
const https = require('https');



const aboutPageController = require("./controllers/aboutPage");
const homePageController = require("./controllers/homePage");
const feedbackController = require("./controllers/feedback");
const sitemapController = require("./controllers/sitemap");
const tacController = require("./controllers/tac");
const storeUserController = require("./controllers/storeUser");
const supportController = require("./controllers/support");
const loginUserController = require("./controllers/loginUser");
const logoutController = require("./controllers/logout");
const contactController = require("./controllers/contact");
const privacyController = require("./controllers/privacy");
const dashboardController = require("./controllers/dashboard");
const registerController = require("./controllers/register");
const sgsadminregisterController = require("./controllers/sgsadminregister");
const profileController = require("./controllers/profile");
const adminDistributerProfileController = require("./controllers/adminDistributerProfile");
const transactionController = require("./controllers/transaction");
const topUpController = require("./controllers/topUp");
const distubitorsController = require("./controllers/distubitors");
const contactUsController = require("./controllers/contactUs");
const adminUserUpdateController = require("./controllers/adminUserUpdate");
const updateProfileController = require("./controllers/updateProfile");
const dthController = require("./controllers/dth");
const csController = require("./controllers/comingsoon");
const pgresponseController = require("./controllers/pgresponse");
const waterController = require("./controllers/water");
const gascontroller = require("./controllers/gas");
const electricitycontroller = require("./controllers/electricity");
const bordbandcontroller = require("./controllers/broadband");
const storeOrderController = require("./controllers/storeOrder");
const rechargeController = require("./controllers/recharge");
const changeStatusController = require("./controllers/changeStatus");
const deleteUserController = require("./controllers/deleteUser");

const app = new express();
mongoose.connect("mongodb://localhost/WEPAYS");


// const privateKey = fs.readFileSync('/etc/letsencrypt/live/www.srgservicesindia.com/privkey.pem', 'utf8');
// const certificate = fs.readFileSync('/etc/letsencrypt/live/www.srgservicesindia.com/cert.pem', 'utf8');
// const ca = fs.readFileSync('/etc/letsencrypt/live/www.srgservicesindia.com/chain.pem', 'utf8');

// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca
// };

// const httpsServer = https.createServer(credentials, app);
const mongoStore = connectMongo(expressSession);

app.use(
  expressSession({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({
      mongooseConnection: mongoose.connection
    })
  })
);

app.use(flash());

app.use(fileUpload());
app.use(express.static("public"));
app.use(expressEdge);
app.set("views", `${__dirname}/views`);

app.use("*", (req, res, next) => {
  edge.global("auth", req.session.userId);
  next();
});

app.use("*", (req, res, next) => {
  edge.global("Admin", req.session.role === 'admin');
  next();
});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const storePost = require("./middleware/storePost");
const auth = require("./middleware/auth");
const redirectIfAuthenticated = require("./middleware/redirectIfAuthenticated");

app.get("/", homePageController);
app.get("/sitemap", sitemapController);
app.get("/auth/logout", auth, logoutController);
app.get("/about", aboutPageController);
app.get("/feedback",feedbackController);
app.get("/support",supportController);
app.post("/users/login", redirectIfAuthenticated, loginUserController);
app.get("/termsandconditions",tacController);
app.get("/auth/login",auth,dashboardController);
app.get("/auth/viewprofile",auth,profileController);
app.get("/auth/transactions",auth,transactionController);
app.get("/register" ,registerController);
app.get("/privacy",privacyController);
app.get("/contact",contactController);
app.get("/wpadminregister",sgsadminregisterController);
app.post("/users/register" , storeUserController);
app.get("/topUp",auth,topUpController);
app.get("/auth/distubitors" , auth , distubitorsController );
app.get("/auth/contactUs",auth , contactUsController );
app.get("/userProfile/:id" , auth , adminDistributerProfileController);
app.get("/dth",dthController);
app.get("/water",waterController);
app.get("/gas",gascontroller);
app.get("/electricity",electricitycontroller);
app.get("/broadband",bordbandcontroller);
app.get("/recharge",rechargeController);
app.get("/deleteUser/:id",deleteUserController)

app.get("/changeStatus/:id",changeStatusController)


app.post("/AdmiUusers/update/:id",auth , adminUserUpdateController);
app.post("/updateProfile",auth , updateProfileController);
app.post("/pgresponse",pgresponseController);
app.post("/storeOrder",storeOrderController)
app.use((req, res) => res.render('not-found'));


// httpsServer.listen(443, () => {
// 	console.log('HTTPS Server running on port 443');
// });

// http.createServer(function (req, res) {
//   res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
//   res.end();
// },app).listen(80,()=>{
//       console.log("hey bhanu worked")}
// );


app.listen(80, () => {
  console.log("App listening on port 80");
});








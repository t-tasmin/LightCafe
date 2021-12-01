// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");


// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

//************************MENU ROUTE**************************************/
const menuRoutes = require("./routes/menus");
app.use("/menus", menuRoutes(db));
//**********************************************************************/

//************************ORDER ROUTE**************************************/
const orderRoutes = require("./routes/orders");
app.use("/orders", orderRoutes(db));
//**********************************************************************/

//************************INDEX ROUTE**************************************/
app.get("/", (req, res) => {
  res.render("index");
});
//**********************************************************************/

//*******DEMO ROUTE FOR CHECKOUT_ORDER PAGE *************/

app.get('/checkout', (req,res) => {
  res.render("order_checkout");
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

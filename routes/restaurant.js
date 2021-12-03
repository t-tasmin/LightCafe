const express = require('express');
const router  = express.Router();


module.exports = (db) => {

  /**
   *  GET route
   *  /restaurant
   *
   */

  // router.get("/", (req))


  router.post("/",(req,res) => {
    // console.log("Request coming as post");
    console.log("**********************");
    console.log("populating Queue -------------->", req.body);
    console.log("**********************");

  // let id = setInterval(() => {
  //

  //   } , 500);

  let queryString = `SELECT * FROM queue;`
    db.query(queryString)
    .then((data) => {
      if(data.rows.length !== 0) {
        const orderQueue = data.rows;
        return res.render('restaurant', {orderQueue});
      } else {
        clearInterval(id);
      }
    })
    .catch((err) => {
      console.log("Error:", err.message);
    })

  })
  return router;
}

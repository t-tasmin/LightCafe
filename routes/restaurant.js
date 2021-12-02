const express = require('express');
const router  = express.Router();


module.exports = (db) => {

  router.post("/",(req,res) => {
    console.log("Request coming as post");
    console.log("**********************");
    console.log("req.body", req.body);
    console.log("**********************");
    res.send("got it")
  })
  return router;
}

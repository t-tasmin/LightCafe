
const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get('/',(req,res) => {
    console.log("req.body", req.body);
    console.log("req.query", req.query);

    res.send('work in progress....')
  });


  return router;
}

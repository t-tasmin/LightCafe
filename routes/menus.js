/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM menu_dishes;`)
      .then(data => {
        const menus = data.rows;
        const menuVar= {menus};
        res.render("menus_show", menuVar);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    console.log("Body",req.body);
    console.log("params",req.params);
    console.log("query",req.query);
    res.send('Done');
  });

  
  return router;
};

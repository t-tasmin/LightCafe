/*
 * All routes for Menus are defined here
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

    let order = {};
    db.query(`SELECT * FROM menu_dishes;`)
    let itemName = req.body.itemName;
    let numbernumberOfItems = req.body.numberOfItems;
    numberOfItems = numbernumberOfItems.filter((a) => a); 

    for (let index in itemName)
    {
      order[itemName[index]] = numberOfItems[index];
    }

    console.log(order);
    res.render("index",order);
    
  });

  
  return router;
};

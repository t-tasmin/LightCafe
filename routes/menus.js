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
    let items = req.body.itemName;
    let itemNames=[];
    let unitPrice=[];

    for (let i in items){
      let s= items[i].split("+");
      itemNames.push(s[0]);
      unitPrice.push(s[1]);
    }

    let numbernumberOfItems = req.body.numberOfItems;
    numberOfItems = numbernumberOfItems.filter((a) => a); 

    for (let index in itemNames)
    {
      order[itemNames[index]] = numberOfItems[index]*unitPrice[index];
    }

    console.log(order);
   
    res.render("index",order);
    
  });

  
  return router;
};

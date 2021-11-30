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
    const queryString = `
    SELECT * 
    FROM menu_dishes;
    `;
  
    db.query(queryString)
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
   
    queryParams = ['('+itemNames.join(',')+')'];
    let queryString = `
    UPDATE menu_dishes
    SET number_available = number_available -1
    WHERE name in $1
     `;
    
    console.log(queryString, queryParams);
    res.render("index",order);
    
  });

  
  return router;
};

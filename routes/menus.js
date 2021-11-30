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

    
    let items = req.body.itemName;
    let numberOfItems = req.body.numberOfItems;
    numberOfItems = numberOfItems.filter((a) => a); 

    let itemNames=[];
    let unitPrices=[];
    let orders  = [];

    for (let i in items){
      let s= items[i].split("+");
      itemNames.push(s[0]);
      unitPrices.push(s[1]);
    }

    for (let index in itemNames)
    {
      orders[index] ={itemName: itemNames[index], unitPrice: unitPrices[index], totalPrice:numberOfItems[index]*unitPrices[index]};
    }

    console.log(orders);
    let orderVar = {orders};
    res.render("order_checkout",orderVar);
   
    queryParams = ['('+itemNames.join(',')+')'];
    let queryString = `
    UPDATE menu_dishes
    SET number_available = number_available -1
    WHERE name in $1
     `;
    console.log(queryString, queryParams);
    
  });

  
  return router;
};

/*
 * All routes for Menus are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const {countSubTotal, countTax, rounded} = require('../utils/index');
module.exports = (db) => {

  //**************************GET ROUTE***************************/
  router.get("/", (req, res) => {
    const queryString = `
    SELECT *
    FROM menu_dishes;
    `;

    db.query(queryString)
      .then(data => {
        const menus = data.rows;
        const menuVar = {menus};
        res.render("menus_show", menuVar);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  //**************************POST ROUTE***************************/
  router.post("/", (req, res) => {

    let itemNames = req.body.itemName;
    let noOfItemsOrdered = req.body.numberOfItems;
    noOfItemsOrdered = noOfItemsOrdered.filter((a) => a);

    if (typeof itemNames === 'string') {
      itemNames = [itemNames];
    }

    //Query to select unit prices for each selected menu_dishes
    let queryString = `
    SELECT number_available, unit_price
    FROM menu_dishes
    WHERE name in (
    `;

    const queryParams = [];

    for (let i = 0; i < itemNames.length; i++) {
      if (i === itemNames.length - 1) {
        queryParams.push(`${itemNames[i]}`);
        queryString += `$${queryParams.length});`;
      } else {
        queryParams.push(`${itemNames[i]}`);
        queryString += `$${queryParams.length}, `;
      }
    }

    
    
    db.query(queryString, queryParams)

      .then(data => {
        
        const menuArray = data.rows;
        let unitPrices = menuArray.map(function(element) {
          return element.unit_price;
        });

        let noOfItemsAvailable = menuArray.map(function(element) {
          return element.number_available;
        });

        console.log(unitPrices);
        console.log(noOfItemsAvailable);
        console.log(noOfItemsOrdered);

        let errorMessage = "";
        let error = false;
        for (let i in noOfItemsAvailable) {
          if (noOfItemsOrdered[i] > noOfItemsAvailable[i]) {
            error = true;
            errorMessage += `Sorry, You ordered for ${noOfItemsOrdered[i]} of ${itemNames[i]},\n We have only ${noOfItemsAvailable[i]} left`;
          }
        }
        if (error) {
          console.log(errorMessage);
          res.render("last",{errorMessage});
        } else {
          let orders  = [];
          for (let index in itemNames) {
            orders[index] = {
              itemName: itemNames[index],
              unitPrice: unitPrices[index],
              numberOfItem: noOfItemsOrdered[index] ,
              totalPrice: noOfItemsOrdered[index] * unitPrices[index]
            };
          }

          // console.log(orders); //-----------------------------------------------x
          //subTotal
          let subTotal = countSubTotal(orders);
          //tax calculation
          let tax = countTax(subTotal)();
          //Total bill
          let totalAmount = rounded(subTotal + tax);

          let orderVar = {orders, subTotal, tax, totalAmount};
          let a = JSON.stringify(orderVar);
          res.redirect(`/orders/${a}`);
        }
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
    
  });//End of Post route
    
  return router;
};



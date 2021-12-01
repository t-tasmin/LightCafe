/*
 * All routes for Menus are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const {countSubTotal, countTax} = require('../utils/index')

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

    //console.log('this order ====>',req.body); //===================x

    let itemNames = req.body.itemName;
    let numberOfItems = req.body.numberOfItems;
    numberOfItems = numberOfItems.filter((a) => a);

    if (typeof itemNames === 'string'){
      itemNames = [itemNames]; 
    }

    //Query to update number_available for each menu_dishes
    let queryString1 = `UPDATE menu_dishes SET number_available = CASE `;
 
    for (let i = 0; i < itemNames.length; i++) {
      queryString1 += `WHEN name = '${itemNames[i]}'  THEN number_available -${numberOfItems[i]} `;
    }

    queryString1 += `END `;
    queryString1 += `WHERE name IN (`;

    for (let i = 0; i < itemNames.length; i++) {
      if (i === itemNames.length - 1) {
        queryString1 += `'${itemNames[i]}') RETURNING *;`;
      } else {
        queryString1 += `'${itemNames[i]}', `;
      }
    }
    
    db.query(queryString1)
      .then(data => {
         console.log("QUERYY",data.rows); // Display which items are updated //-------------------------------x

        //Query to select unit prices for each selected menu_dishes
        let queryString2 = `
        SELECT unit_price
        FROM menu_dishes
        WHERE name in ( 
        `;
        for (let i = 0; i < itemNames.length; i++) {
          if (i === itemNames.length - 1) {
            queryString2 += `'${itemNames[i]}');`;
          } else {
            queryString2 += `'${itemNames[i]}', `;
          }
        }
    
        db.query(queryString2)
          .then(data => {
            const unitPriceObj = data.rows;
            let unitPrices = unitPriceObj.map(function(element) {
              return element.unit_price;
            });
        
            let orders  = [];
            for (let index in itemNames) {
              orders[index] = {
                itemName: itemNames[index],
                unitPrice: unitPrices[index],
                numberOfItem: numberOfItems[index] ,
                totalPrice: numberOfItems[index] * unitPrices[index]
              };
            }

            // console.log(orders); //-----------------------------------------------x
            //subTotal
        let subTotal = countSubTotal(orders);
        //tax calculation
        let tax = countTax(subTotal)();
        //Total bill
        let totalAmount = subTotal + tax;

        //console.log('subTotal', subTotal);
        //console.log('tax', tax);
        //console.log('totalAmount', totalAmount);

        let orderVar = {orders, subTotal, tax, totalAmount};
           let a=JSON.stringify(orderVar);
           res.redirect(`/orders/${a}`);
          })
          .catch(err => {
            res
              .status(500)
              .json({ error: err.message });
          });
      
      })
      .catch(err => console.error('query error', err.stack));

    
    
  });


  return router;
};



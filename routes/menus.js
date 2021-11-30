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

    let itemNames = req.body.itemName;
    let numberOfItems = req.body.numberOfItems;
    numberOfItems = numberOfItems.filter((a) => a);

    let queryString = `
    SELECT unit_price
    FROM menu_dishes
    WHERE name in (
     `;
     for (let i=0; i<itemNames.length; i++)
     {
       if (i === itemNames.length-1)
       {queryString+=`'${itemNames[i]}');`;}
       else
       {queryString+=`'${itemNames[i]}', `;}
     }

    console.log(queryString);

    db.query(queryString)
      .then(data => {
        const unitPriceObj = data.rows;
        let unitPrices= unitPriceObj.map(function (element){
          return element.unit_price;
        });

        let orders  = [];
        for (let index in itemNames)
        {
          orders[index] = {
            itemName: itemNames[index],
            unitPrice: unitPrices[index],
            numberOfItem: numberOfItems[index] ,
            totalPrice: numberOfItems[index] * unitPrices[index]
          };
        }

        console.log('orders', orders);

        //subTotal
        let subTotal = countSubTotal(orders);
        //tax calculation
        let tax = countTax(subTotal)();
        //Total bill
        let totalAmount = subTotal + tax;

        console.log('subTotal', subTotal);
        console.log('tax', tax);
        console.log('totalAmount', totalAmount);

        let orderVar = {orders, subTotal, tax, totalAmount};
        res.render("order_checkout",orderVar);

      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });


  });


  return router;
};

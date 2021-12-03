const express = require('express');
const { sendSMS } = require('../helpers');
const router  = express.Router();


module.exports = (db) => {
  /**
   * POST route
   */

  router.post("/", (req,res) => {
    console.log("=============");
    console.log("reqBody", req.body);
    console.log("=============");
    const queueID = Number(req.body.order);
    const query0 = `SELECT * FROM queue WHERE  id = $1;`;
    const templateVar0 = [queueID];

    db.query(query0, templateVar0)
      .then( data => {
          // update the order tabel
          const customerOrder_id= JSON.parse(data.rows[0].customer_order)[0].id;
          console.log("orderID:", customerOrder_id);
          const query_order_change = `UPDATE orders SET end_time = NOW() WHERE id = $1  RETURNING *;`;
          db.query( query_order_change , [customerOrder_id])
            .then(result => {
              const text = [];
              const itemNameArr = JSON.parse(result.rows[0].item_names);
              const menuItemArr = JSON.parse(result.rows[0].menu_items);
              const cname = result.rows[0].customer_name;
              const phone = result.rows[0].customer_phone;
              for( let i = 0 ; i < itemNameArr.length; i++) {
                text.push(`[${itemNameArr[i]}-($${menuItemArr[i][2]}) -- ${menuItemArr[i][1]} -- $${Number(menuItemArr[i][1]) * menuItemArr[i][2]}]`)
              };

              let clientText_B = `Your order is ready! ${text}, Name: ${cname} , Phone: ${phone}. You can come for pickup. Enjoy it!`;

              // SEND message to customer
               sendSMS(phone, clientText_B);

              // DELETE the order from the queue
              const query_for_delete = `DELETE FROM queue WHERE  id = $1;`;
              const templateVar1 = [queueID];

              db.query(query_for_delete, templateVar1)
                .then(data => {
                  res.redirect("/restaurant");
                })
                .catch(err => {
                  console.log("Error :", err.message);
                })
            });
      })

      // db.query(`SELECT * FROM queue ;`)
      // .then(result => {
      //   const orderQueue = result.rows;
      //   res.redirect("/restaurant");
      // })


  });



  return router;
}

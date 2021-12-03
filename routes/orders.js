const express = require('express');
const { max } = require('pg/lib/defaults');

const router  = express.Router();

//--------------------------------------------------------------------------------------------------------------------------------
const { sendSMS } = require('../helpers')
//--------------------------------------------------------------------------------------------------------------------------------

module.exports = (db) => {

 //**************************GET ROUTE***************************/
 router.get("/:a", (req, res) => {
  let orderVar = JSON.parse(req.params.a);
  res.render("order_checkout", orderVar);

});

//**************************POST ROUTE***************************/
  router.post("/", (req, res) => {

    const order = req.body;
    if (order.telephone.length !== 10) {
        const templateVars = {
            script: 'Oops! Please resubmit your order and enter a valid phone number at checkout to finalise. We await you. Thank you!'
        }
        res.render('index', templateVars)
    } else {
        let phone = order.telephone;
        let cname = order.cname
        let orderf = JSON.parse(order.order);
        console.log(orderf); //----------------------------------------------x
//--------------------------------------------------------------------------------------------------------------------------------
        let queue_timing = [];
        let order_items_ids = [];
        let order_items_names = [];
//--------------------------------------------------------------------------------------------------------------------------------
        let order_items_info = [];

        for (let j of orderf) {
          let qstring0 =`SELECT * FROM menu_dishes WHERE name = $1 ;`;
          db.query(qstring0, [j.itemName])
            .then((data) => {
              order_items_info.push(data.rows[0]);
            })
            .catch(err => {
              console.log(err.message);
              res.status(500);
            });
        }

        setTimeout(() => {

//--------------------------------------------------------------------------------------------------------------------------------
          for (let i of orderf) {
            let qstring0 = `UPDATE menu_dishes SET number_available = number_available - $1
                            WHERE name = $2 RETURNING *;`;
            let templateVars0 = [i.numberOfItem, i.itemName];
            db.query(qstring0, templateVars0)
              .then((data) => {
                console.log('this insert1 =====>',data.rows); //----------------------------------xl
              })
              .catch(err => {
                console.log(err.message);
              });
          }
//--------------------------------------------------------------------------------------------------------------------------------
          let gttl = 0;
          let ttl_prep_time = [];
          let text = [];
          for (let i = 0; i < orderf.length; i++ ) {
             let ph = [];
             gttl += orderf[i].totalPrice;
             ttl_prep_time.push(order_items_info[i].prep_time);
             ph.push(order_items_info[i].id);
             ph.push(orderf[i].numberOfItem);
             ph.push(order_items_info[i].unit_price);
             order_items_ids.push(ph)
             text.push(`[${orderf[i].itemName}-($${orderf[i].unitPrice}) -- ${orderf[i].numberOfItem} -- $${orderf[i].totalPrice}]`)
             ph = [];
             order_items_names.push(order_items_info[i].name);
          }
          text.push(`SUBTOTAL = $${gttl}, Tax = 13%, GRAND TOTAL = $${gttl + (gttl*0.13)}`);
//--------------------------------------------------------------------------------------------------------------------------------
          let est_pickup_time = 0;
          if (queue_timing.length !== 0) {
            est_pickup_time = new Date(Date.now() + (Math.max(...ttl_prep_time) + queue_timing[queue_timing.length - 1])*60000);
          } else {
            est_pickup_time = new Date(Date.now() + Math.max(...ttl_prep_time)*60000);
          }
//--------------------------------------------------------------------------------------------------------------------------------

          let qstring1 = `INSERT INTO orders (
            menu_items,
            item_names,
            customer_name ,
            customer_phone ,
            total_paid ,
            start_time ,
            end_time
          )
          VALUES
          ($1 , $2 , $3, $4 , $5, $6, $7) RETURNING *;`;
          let templateVars1 = [JSON.stringify(order_items_ids), JSON.stringify(order_items_names), cname, phone, gttl, new Date(Date.now()), est_pickup_time];
          db.query(qstring1, templateVars1)
            .then((data) => {
              console.log('this insert2 =====>',data.rows); //=================================================x
              let qstring2 = `INSERT INTO queue (
                customer_phone,
                customer_name,
                customer_order,
                est_pickup_time
              )
              VALUES ($1, $2, $3, $4) RETURNING *;`;
              let templateVars2 = [ phone, cname, JSON.stringify(data.rows), est_pickup_time ];
              db.query(qstring2, templateVars2)
                .then((data) => {
                  console.log('this insert3 =====>',data.rows); //`~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~===>++

                  let clientText_A = `Thank you for your order! ${text}, Name: ${cname} , Phone: ${phone} .  Estimated pickup time: ${est_pickup_time}!`;
                  let restaurantText = `${text}, Name: ${cname} , Phone: ${phone} .  Estimated pickup time: ${est_pickup_time}`;
                  let r_phone = '9052135569'; // restaurant phone number //--------------------- pending twilio fix
                  sendSMS(phone, clientText_A);
                  sendSMS(r_phone, restaurantText);
                  console.log('-----------------------------------------------------------------------') //-------------------x
                  console.log('clientText_A ==>',clientText_A);
                  console.log('-----------------------------------------------------------------------')
                  // console.log('clientText_B ==>',clientText_B);
                  console.log('-----------------------------------------------------------------------')
                  console.log('restaurantText ==>',restaurantText)
                  console.log('-----------------------------------------------------------------------')
                })
                .catch(err => {
                  console.log(err.message);
                  res.status(500);
                });
            })
            .catch(err => {
              console.log(err.message);
              res.status(500);
            });
//--------------------------------------------------------------------------------------------------------------------------------
        queue_timing.push(Math.max(...ttl_prep_time));
        ttl_prep_time = [];
//--------------------------------------------------------------------------------------------------------------------------------
        }, 500);


    }
//--------------------------------------------------------------------------------------------------------------------------------
  const templateVars = {
    script: 'Thank you for your order! Check your SMS for estimated time to pickup.'
  }
  res.render('index', templateVars)

  });
  return router;
};

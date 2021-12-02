//node-postgres is a library that allows us to connect to our PostgreSQL database, directly from our node applications.
const {Pool} = require('pg');

const pool = new Pool({
  user: 'labber',
  password: 'labber',
  host: 'localhost',
  database: 'test'
});

const itemNames =    ['Curry Chicken', 'Goat Curry', 'Vegetable Salad'];


let queryString = `
SELECT prep_time
FROM menu_dishes 
WHERE name IN (`;


for (let i = 0; i < itemNames.length; i++) {
  if (i === itemNames.length - 1) {
    queryString += `'${itemNames[i]}');`;
  } else {
    queryString += `'${itemNames[i]}', `;
  }
}
    
console.log(queryString);
   
pool.query(queryString)
  .then(data => {
    console.log(data.rows);

    let max_time =data.rows[0].prep_time;

    for (let i=0; i< data.rows.length ; i++){
       if (data.rows[i].prep_time>max_time){
         max_time=data.rows[i].prep_time;
       }
    }
    console.log("Meal Preparation Time: ", max_time);
    // https://stackoverflow.com/questions/5416920/timestamp-to-human-readable-format
    var date = new Date();

    datevalues = [ date.getHours(),  date.getMinutes()];
    console.log(datevalues);

  })
  .catch(err => console.error('query error', err.stack));

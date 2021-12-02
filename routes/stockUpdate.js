
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
      })
      .catch(err => console.error('query error', err.stack));
const countSubTotal = (orderArr) => {
    //getting totalPrice of each items and store in array
    let totalPriceArr = orderArr.map(el =>  el['totalPrice']);
    let subTotal = totalPriceArr.reduce((acc,curr) => {
      return acc + curr
    },0);
    return subTotal;
};

const countTax = (subTotal) => {
  const tax = 0.13;
  return () => {
    return Math.round((subTotal * tax) * 100) / 100;
  }
};

module.exports = {countSubTotal, countTax};

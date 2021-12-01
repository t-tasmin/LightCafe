const rounded = (num) => {
  return Math.round(num * 100) / 100;
}


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
    return rounded(subTotal * tax);
  }
};



module.exports = {countSubTotal, countTax, rounded};

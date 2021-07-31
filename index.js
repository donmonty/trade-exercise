
let sellers = [
  { units: 10.4, price: 10 },
  { units: 8.5, price: 11},
  { units: 12.7, price: 12}
]

let buyers = [
  { units: 3.3, price: 13 },
  { units: 12.5, price: 12}, 
  { units: 11.3, price: 11 }
]

let sortedBuyers = [];
let sortedSellers = [];

const myStock = {
  stock: 0,
  price: null
}

let profit = 0;
let sales = 0;
let cogs = 0;

function sellersWithStock(sellers) {
  const withStock = sellers.map(seller => {
      if(seller.units !== 0) return seller
  })
  return withStock;
}

function buyersWithOrders(buyers) {
  const withOrders = buyers.map(buyer => {
      if(buyer.units !== 0) return buyer
  })
  return withOrders;
}

function round(number, decimalPlaces) {
  const factorOfTen = Math.pow(10, decimalPlaces)
  return Math.round(number * factorOfTen) / factorOfTen;
}

function trade() {

  // Check buyers with purchase orders available
  const availableBuyers = buyersWithOrders(buyers);

  // Check sellers with available stock
  const availableSellers = sellersWithStock(sellers);

  // While there are buyers available, trade
  while (availableBuyers.length !== 0 ) {

    // If there are buyers available, but no sellers, stop trade
    if (availableSellers.length === 0) break;

    // Pick the buyer with the highest price
    sortedBuyers = availableBuyers.sort((a, b) => {
      return b.price - a.price
    })
    const maxPriceBuyer = sortedBuyers.shift();

    // Pick the seller with the lowest price
    sortedSellers = availableSellers.sort((a, b) => {
      return a.price - b.price;
    })
    const minPriceSeller = sortedSellers.shift();

    // If seller's price >= buyer's price, don't trade
    if (minPriceSeller.price >= maxPriceBuyer.price) break;

    // Trade
    // Case 1: Seller stock < buyer demand
    if (minPriceSeller.units < maxPriceBuyer.units) {

      const unitsSold = minPriceSeller.units;
      sales += unitsSold * maxPriceBuyer.price;
      cogs += unitsSold * minPriceSeller.price;

      // Update inventory
      maxPriceBuyer.units = round((maxPriceBuyer.units - unitsSold), 1);
      //maxPriceBuyer.units = maxPriceBuyer.units - unitsSold;
      minPriceSeller.units = 0;
      buyers = [...sortedBuyers];
      sellers = [...sortedSellers];
      buyers.push(maxPriceBuyer);
      sellers.push(minPriceSeller);

    } else if (minPriceSeller.units >= maxPriceBuyer.units) {
      
      // Case 2: Seller stock >= buyer demand
      const unitsSold = maxPriceBuyer.units;
      sales += unitsSold * maxPriceBuyer.price;
      cogs += unitsSold * minPriceSeller.price;

      // Update inventory
      maxPriceBuyer.units = 0;
      minPriceSeller.units = round((minPriceSeller.units - unitsSold), 1)
      //minPriceSeller.units = minPriceSeller.units - unitsSold;
      buyers = [...sortedBuyers];
      sellers = [...sortedSellers];
      buyers.push(maxPriceBuyer);
      sellers.push(minPriceSeller); 

    }

  }

  // Calculate profit
  sales = round(sales, 1);
  cogs = round(cogs, 1);
  profit = round((sales - cogs), 1);
  
  return { sales, cogs, profit };

}

trade();
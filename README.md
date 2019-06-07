# Bamazon-App
Amazon-like storefront app made with Node.js, Inquier, CLI-Table, and MySQL

This app takes in orders from customers and depletes stock from the store's inventory

When the user runs: node bamazonCustomer.js in their terminal, they are shown a 
table of a mysql database and then given this prompt.

<img src="images/firstPrompt.png" width="400">

After the user answers which item id they'd like to purchase, the next prompt asks 
how many. Once an amount is chosen, the products database is updated to reflect the 
sale and the customer is given the total price.

<img src="images/secondPrompt.png" width="400">

The app also deals with orders placed where there is not enough of an item in stock
to fulfill an order.

<img src="images/thirdPrompt.png" width="400">

Additional functionality prevents orders from being placed if the customer inputs an invalid id.

<img src="images/fourthPrompt.png" width="400">





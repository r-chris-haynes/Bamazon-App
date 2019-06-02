var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table');


var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Wilmajo35$",
  database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    showItems();
  });

//   ===========================================================

function showItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if(err) throw err;

        var table = new Table({
            head: ["Item Id", "Product Name", "Price", "Quantity"],
            colWidths: [10, 20, 10, 10]
        });
        for (let i = 0; i < res.length; i++) {
            table.push(
                [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]
            );
        };
        
        console.log(table.toString());
    });
    setTimeout(purchase, 1000); 
};



  
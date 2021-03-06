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

connection.connect(function (err) {
    if (err) throw err;
    showItems();
});

// =======================================================================================

function showItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

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

// =======================================================================================

function purchase() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        var ids = [];
        
        for(var i = 0; i < res.length; i++) {
            ids.push(res[i].item_id);
           }
    inquirer.prompt([
        {
            name: "buy",
            type: "input",
            message: "Please enter the id of the item you would like to purchase.",
            
            validate: function (value) {
                if (isNaN(value) == false && value <= ids.length) {
                    return true;
                } else {
                    console.log(" Invalid entry. Please try again.")
                }
            }
        },
        {
            name: "amount",
            type: "input",
            message: "How many would you like to purchase?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    console.log(" Invalid entry. Please try again.")
                }
            }
        }
    ])
        .then(function (answers) {
            var chosenId = answers.buy.toString();
            var numToBuy = answers.amount.toString();
            // var inst = `SELECT * FROM products WHERE item_id = '` +  chosenId + `'`;
            connection.query(`SELECT * FROM products WHERE item_id = '` +  chosenId + `'`, function(err, res){
                if (err) throw err;
         
                if (numToBuy > res[0].stock_quantity) {
                    console.log("Sorry, we don't have that many in stock. Please try again.");
                    purchase();
                } else {
                    var newQuantity = res[0].stock_quantity - numToBuy;
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                          {
                            stock_quantity: newQuantity
                          },
                          {
                            item_id: chosenId
                          }
                        ],
                        function(err) {
                          if (err) throw err;
                          console.log("Thanks for your order! Your total is $" + numToBuy * res[0].price);
                          showItems();
                         
                        }
                    );
                };
           })
        });
    }
)};
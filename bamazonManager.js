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
//    console.log("hi");
});

// =======================================================================================

setTimeout(promptQuestion, 1000);

function promptQuestion(){
    inquirer.prompt([
        {
            name: "choices",
            type: "list",
            message: "Please select an option.",
            choices: ["View products for sale", "View low inventory", "Add inventory", "Add a new product"]
        }
    ])
        .then(function(answers){
            if (answers.choices === "View products for sale") {
                showItems();
                setTimeout(promptQuestion, 1000);
            }
            else if (answers.choices === "View low inventory") {
                showLowInventory();
                setTimeout(promptQuestion, 1000);
            } 
            else if (answers.choices === "Add inventory") {
                setTimeout(addInventory, 1000);
            }
            else if (answers.choices === "Add a new product") {
                setTimeout(addNewProduct, 1000);
            } 
            
        })
};

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
};

// =======================================================================================

function showLowInventory() {
    connection.query(`SELECT * FROM products WHERE stock_quantity < '` + 5 + `'`, function (err, res) {
        if (err) throw err;

       var lowInvTable = new Table({
            head: ["Item Id", "Product Name", "Price", "Quantity"],
            colWidths: [10, 20, 10, 10]
        });
        
        for (let i = 0; i < res.length; i++) {
            lowInvTable.push(
                [res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity]
            );
        };
        console.log(lowInvTable.toString());
    });
};

// =======================================================================================

function addInventory() {
    showItems();
    setTimeout(managerQuestions, 1000);
    function managerQuestions() {
        inquirer.prompt([
            {
                name: "id",
                type: "input",
                message: "Please select an item id.",
                validate: function(value) {
                    if (isNaN(value) == false) {
                        return true;
                    } else {
                        console.log(" Invalid entry. Please try again.")
                    }
                }
            },
            {
                name: "amount",
                type: "input",
                message: "How many would you like to add?",
                validate: function(value) {
                    if (isNaN(value) == false) {
                        return true;
                    } else {
                        console.log(" Invalid entry. Please try again.")
                    }
                }
            }
        ])
        .then(function(answers){
            var chosenId = answers.id;
            var amountToAdd = answers.amount;
            
            connection.query(`SELECT * FROM products WHERE item_id = '` +  chosenId + `'`, function(err,res){
                if(err) throw err;
                
                var stockQuantity = res[0].stock_quantity;
                var newQuantity = parseInt(amountToAdd) + parseInt(stockQuantity);
                
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
                      console.log("Your inventory has been updated. The new amount is: " + newQuantity);
                      showItems();
                     setTimeout(promptQuestion, 1000);
                    }
                );
            });
        });
       
    };
};

// =======================================================================================

function addNewProduct() {
    inquirer.prompt([
        {
            name: "product",
            type: "input",
            message: "Please enter the product you'd like to add. "
        },
        {
            name: "department",
            type: "input",
            message: "What department?"   
        },
        {
            name: "price",
            type: "input",
            message: "Please enter the price. "    
        },
        {
            name: "quantity",
            type: "input",
            message: "Please enter the quantity. "
        }
    ])
    .then(function(answers){
      console.log(answers)  
    })
}


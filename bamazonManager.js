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
            choices: ["View products for sale", "View low inventory", "Add to inventory", "Add a new product"]
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
            else if (answers.choices === "Add to inventory") {
                setTimeout(addInventory, 1000);
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
                name: "manager",
                type: "input",
                message: "Please select the item id where you'd like to add inventory.",
                validate: function(value) {
                    if (isNaN(value) == false) {
                        return true;
                    } else {
                        console.log(" Invalid entry. Please try again.")
                    }
                }
            }
        ])
        .then(function(answer){
            var managerChoice = answer.manager.toString();
            var inst = `SELECT * FROM products WHERE item_id = '` +  managerChoice + `'`;
            console.log(inst);
           
        })
    }
}


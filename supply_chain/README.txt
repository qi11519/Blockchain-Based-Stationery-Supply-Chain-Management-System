--Start Up React.js Webpage in VSCODE--

Make sure directory is changed beforehand. (cd supply_chain)

Configuration:-
1. Move to "src/backend/server.js"
2. Replace "<Your Project Directory On Linux/Ubuntu WSL>" with your corresponding directory of "supplychain_fabric" in your Linux device/Virtual Machine.
3. Un-comment line '//var mongoDB = "<Your MongoDB Access Link>";', then replace "<Your MongoDB Access Link>" with your actual MongoDB database link.

MongoDB Configuration:-
1. Database Object Structure for User Account:
user_account {
  Account_ID "String",
  Address "String",
  Password "String",
  User_Type "String", //companybranch & stationerycompany & supplier & deliverycompany
}

Node.js:-
1.1. Create another terminal.
1.2. Change the directory to "cd ./src"
1.3. run "node backend/server.js"

Front-End:-
2.1. Create another terminal.
2.2. run "npm start"


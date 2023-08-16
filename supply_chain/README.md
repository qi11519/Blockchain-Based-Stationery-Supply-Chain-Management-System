--Start Up React.js Webpage in VSCODE--<br>

Make sure directory is changed beforehand. (cd supply_chain)<br>

Configuration:-
1. Move to "src/backend/server.js"
2. Replace "<Your Project Directory On Linux/Ubuntu WSL>" with your corresponding directory of "supplychain_fabric" in your Linux device/Virtual Machine.<br>
3. Un-comment line '//var mongoDB = "<Your MongoDB Access Link>";', then replace "<Your MongoDB Access Link>" with your actual MongoDB database link.<br>


MongoDB Configuration:-
1. Database Object Structure for User Account:<br>
user_account {<br>
  Account_ID "String",<br>
  Address "String",<br>
  Password "String",<br>
  User_Type "String", //companybranch & stationerycompany & supplier & deliverycompany<br>
}


Node.js:-

1.1. Create another terminal.<br>
1.2. Change the directory to "cd ./src"<br>
1.3. run "node backend/server.js"<br>


Front-End:-

2.1. Create another terminal.<br>
2.2. run "npm start"


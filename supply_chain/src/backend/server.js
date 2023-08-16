const mongoose = require('mongoose');
const express = require('express');


const path = require('path');
const fs = require('fs');

const app = express();

const cors = require('cors');

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Replace with your allowed origin
  allowedHeaders: 'Content-Type, Authorization'
}));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

//var mongoDB = "<Your MongoDB Access Link>";

mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;

var db = mongoose.connection;

//////////////////////////////////////////////////////////////
//Mongodb Connection Matters
db.on('connected', function() {
    console.log('Mongoose default connection done');
});

db.on('error', function(err) {
    console.log('Mongoose default connection error: ' + err);
});

//////////////////////////////////////////////////////////////

const deleteFilesInFolder = () => {
  fs.readdir(path.resolve(__dirname, 'wallet'), (err, files) => {
    if (err) {
      console.error('Error reading folder:', err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(path.resolve(__dirname, 'wallet'), file);
      
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
          return;
        }
        
        console.log('File deleted:', filePath);
      });
    });
  });
};

// Call the function to delete files when the server starts
deleteFilesInFolder();

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

//////////////////////////////////////////////////////////////
// FABRIC
// Connection to Hyperledger Fabric
const { Wallets, Gateway } = require('fabric-network');

async function connectToFabric(user) {
  try {
    // Load connection profile and wallet
    let orgName;
    if (user.User_Type === 'companybranch') {
      orgName = 'companybranch';
    }
    else if (user.User_Type === 'stationerycompany') {
      orgName = 'stationerycompany';
    }
    else if (user.User_Type === 'supplier') {
      orgName = 'supplier';
    }
    else if (user.User_Type === 'deliverycompany') {
      orgName = 'deliverycompany';
    } else {
      orgName = 'companybranch';
    }

    // Load connection profile and wallet /mnt/wsl.localhost/Ubuntu
    const ccpPath = `\\\\<Your Project Directory On Linux/Ubuntu WSL>\\supplychain_fabric\\test-network\\organizations\\peerOrganizations\\${orgName}.example.com\\connection-${orgName}.json`;
    const ccpFile = fs.readFileSync(ccpPath, 'utf8');
    const ccp = JSON.parse(ccpFile.toString());

    ccp.peers[`peer0.${orgName}.example.com`].tlsCACerts.pem = ccp.certificateAuthorities[`ca.${orgName}.example.com`].tlsCACerts.pem[0];

    const walletPath = path.resolve(__dirname, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    // Check if identity exists in the wallet
    const userIdentity = `Admin@${orgName}.example.com`;

    let identity = await wallet.get(userIdentity);
    if (!identity) {
      console.log('Identity not found in the wallet. Creating a new identity...');
      identity = await createIdentity(wallet, userIdentity, orgName);
    }

    // Create a new gateway for connecting to the network
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: userIdentity,
      discovery: { enabled: true, asLocalhost: true },
    });

    return gateway;
  } catch (error) {
    console.error(`Failed to connect to Fabric network: ${error}`);
    throw error;
  }
}

async function createIdentity(wallet, userIdentity, orgName) {
  try {
    // Generate or obtain the necessary cryptographic materials for the identity
    const certificatePath = `\\\\<Your Project Directory On Linux/Ubuntu WSL>\\supplychain_fabric\\test-network\\organizations\\peerOrganizations\\${orgName}.example.com\\users\\Admin@${orgName}.example.com\\msp\\signcerts\\Admin@${orgName}.example.com-cert.pem`;
    const privateKeyPath = `\\\\<Your Project Directory On Linux/Ubuntu WSL>\\test-network\\organizations\\peerOrganizations\\${orgName}.example.com\\users\\Admin@${orgName}.example.com\\msp\\keystore\\priv_sk`;
    
    // Read the contents of the certificate and private key files
    const certificate = await readFile(certificatePath);
    const privateKey = await readFile(privateKeyPath);

    let msp;
    if (orgName === 'companybranch') {
      msp = 'CompanyBranchMSP';
    }
    else if (orgName === 'stationerycompany') {
      msp = 'StationeryCompanyMSP';
    }
    else if (orgName === 'supplier') {
      msp = 'SupplierMSP';
    }
    else if (orgName === 'deliverycompany') {
      msp = 'DeliveryCompanyMSP';
    } 
    // Create an identity object with the necessary properties
    const identity = {
      credentials: {
        certificate,
        privateKey,
      },
      mspId: msp,
      type: 'X.509',
    };
    // Store the identity in the wallet
    await wallet.put(userIdentity, identity);
    console.log(`Identity for ${userIdentity} created and stored in the wallet.`);
  } catch (error) {
    console.error(`Error creating identity: ${error}`);
    throw error;
  }
}

async function readFile(filePath) {
  // Implement a function to read the contents of a file asynchronously
  // and return it as a string or buffer
  // Example: using the 'fs' module
  const fs = require('fs');
  return fs.promises.readFile(filePath, 'utf8');
}

// Get All Orders
async function getAllOrders(gateway, user) {
  try {
    // Get the network and contract instances
    const network = await gateway.getNetwork('channel2');
    const contract = network.getContract('basic');

    const result = await contract.submitTransaction('GetAllOrders', user);

    return result.toString();
  } catch (error) {
    console.error(`Failed to submit Fabric transaction: ${error}`);
    throw error;
  }
}

// Get All Delivery
async function GetAllDeliveryRecords(gateway, user) {
  try {
    // Get the network and contract instances
    const network = await gateway.getNetwork('channel3');
    const contract = network.getContract('basic');

    const result = await contract.submitTransaction('GetAllDeliveryRecords', user);
    
    return result.toString();
  } catch (error) {
    console.error(`Failed to submit Fabric transaction: ${error}`);
    throw error;
  }
}

// Get Order Preset by Branch
async function GetAllInventoryRecords(gateway, user) {
  try {
    // Get the network and contract instances
    const network = await gateway.getNetwork('channel1');
    const contract = network.getContract('basic');

    const result = await contract.submitTransaction('GetAllInventory', user);
    
    return result.toString();
  } catch (error) {
    console.error(`Failed to submit Fabric transaction: ${error}`);
    throw error;
  }
}

// Get Order Preset by Branch
async function GetAllOrderPresets(gateway, user) {
  try {
    // Get the network and contract instances
    const network = await gateway.getNetwork('channel1');
    const contract = network.getContract('basic');

    const result = await contract.submitTransaction('GetAllOrderPresets', user);
    
    return result.toString();
  } catch (error) {
    console.error(`Failed to submit Fabric transaction: ${error}`);
    throw error;
  }
}


// Update Order Preset
async function UpdateOrderPresets(gateway, user, orderPresetID, minimumLimit, presetQuantity) {
  try {
    // Get the network and contract instances
    const network = await gateway.getNetwork('channel1');
    const contract = network.getContract('basic');

    const result = await contract.submitTransaction('UpdateOrderPreset', orderPresetID, minimumLimit, presetQuantity);
    
    return result;
  } catch (error) {
    console.error(`Failed to submit Fabric transaction: ${error}`);
    throw error;
  }
}

// Update Inventory
async function UpdateOrderStatus(gateway, user, orderID, status, remark, prefixDeliveryId) {
  try {
    const results={};

    // Get the network and contract instances
    const network = await gateway.getNetwork('channel2');
    const contract = network.getContract('basic');

    const result1 = await contract.submitTransaction('UpdateOrder', orderID, status, remark);
    results.resukt1 = result1;

    if (status === "CONFIRMED"){
  
      const orderResult = await contract.submitTransaction('ReadOrder', orderID);
      const orderJson = JSON.parse(orderResult.toString());
      const orderString = JSON.stringify(orderJson);

      const network3 = await gateway.getNetwork('channel3');
      const contract3 = network3.getContract('basic');

      const result2 = await contract3.submitTransaction('CreateDeliveryRecord', orderString, remark, prefixDeliveryId);
      results.result2 = result2;
    }
    
    return results;
  } catch (error) {
    console.error(`Failed to submit Fabric transaction: ${error}`);
    throw error;
  }
}

// Update Delivery Status
async function UpdateDeliveryStatus(gateway, user, deliveryID, status, remark) {
  try {
    const results={};

    // Get the network and contract instances
    const network = await gateway.getNetwork('channel3');
    const contract = network.getContract('basic');

    const result1 = await contract.submitTransaction('UpdateDeliveryRecord', deliveryID, status, remark);
    results.result1 = result1;

    const deliveryRecordResult = await contract.submitTransaction('ReadDeliveryRecord', deliveryID);
    const deliveryRecordJSON = JSON.parse(deliveryRecordResult.toString());

    if (status === "COMPLETED"){
      const user2 = {
        User_Type: "companybranch",
      }

      const gateway2 = await connectToFabric(user2);
      const network2 = await gateway2.getNetwork('channel2');
      const contract2 = network2.getContract('basic');

      const result2 = await contract2.submitTransaction('UpdateOrder', deliveryRecordJSON.orderID, status, remark);
      
      results.result2 = result2;

      const orderResult = await contract2.submitTransaction('ReadOrder', deliveryRecordJSON.orderID);
      const orderJSON = JSON.parse(orderResult.toString());

      const network1 = await gateway2.getNetwork('channel1');
      const contract1 = network1.getContract('basic');

      const inventoryResult = await contract1.submitTransaction('ReadInventory', orderJSON.inventoryID);
      const inventoryJSON = JSON.parse(inventoryResult.toString());

      const finalInventoryQuantity = parseInt(inventoryJSON.inventoryQuantity) + parseInt(orderJSON.orderQuantity);

      const result3 = await contract1.submitTransaction('UpdateInventory', orderJSON.inventoryID, finalInventoryQuantity);
      results.result3 = result3;
    } else if (status === "FAILED"){
      const user2 = {
        User_Type: "companybranch",
      }

      const gateway2 = await connectToFabric(user2);
      const network1 = await gateway2.getNetwork('channel2');
      const contract1 = network1.getContract('basic');

      const result2 = await contract1.submitTransaction('UpdateOrder', deliveryRecordJSON.orderID, status, remark);
      results.result2 = result2;
    }
    
    return results;
  } catch (error) {
    console.error(`Failed to submit Fabric transaction: ${error}`);
    throw error;
  }
}

// Update Inventory
async function UpdateInventory(gateway, user, inventoryID, inventoryQuantity, prefixOrderId) {
  try {
    const results = {};
    // Get the network and contract instances

    const network = await gateway.getNetwork('channel1');
    const contract = network.getContract('basic');

    const result = await contract.submitTransaction('UpdateInventory', inventoryID, inventoryQuantity);
    results.result1 = result;

    const orderPresetResult = await contract.submitTransaction('GetAllOrderPresets', user);
    const orderPresetJson = JSON.parse(orderPresetResult.toString());
    const newOrderPresetJson = orderPresetJson.filter(obj => obj["branch"] === user.user.Account_ID);

    const minimumLimit = newOrderPresetJson[0].minimumLimit;

    if (inventoryQuantity < minimumLimit){
      const orderPresetString = JSON.stringify(newOrderPresetJson[0]);

      const inventoryResult = await contract.submitTransaction('ReadInventory', inventoryID);
      const inventoryString = JSON.stringify(JSON.parse(inventoryResult.toString()));

      const address = user.user.Address;

      const network2 = await gateway.getNetwork('channel2');
      const contract2 = network2.getContract('basic');
      const result2 = await contract2.submitTransaction('CreateOrder', orderPresetString, inventoryString, address, "Restock", prefixOrderId);
      results.result2=result2;
    }
    
    return results;
  } catch (error) {
    console.error(`Failed to submit Fabric transaction: ${error}`);
    throw error;
  }
}

// Get Order Preset by Branch
async function AddOrder(gateway, user, inventoryID, remark, prefixOrderId) {
  try {
    // Get the network and contract instances

    const network1 = await gateway.getNetwork('channel1');
    const contract1 = network1.getContract('basic');
    
    const network2 = await gateway.getNetwork('channel2');
    const contract2 = network2.getContract('basic');

    const orderPresetResult = await contract1.submitTransaction('GetAllOrderPresets', user);
    const orderPresetJson = JSON.parse(orderPresetResult.toString());
    const newOrderPresetJson = orderPresetJson.filter(obj => obj["branch"] === user.user.Account_ID);
    const orderPresetString = JSON.stringify(newOrderPresetJson[0]);

    const inventoryResult = await contract1.submitTransaction('ReadInventory', inventoryID);
    const inventoryString = JSON.stringify(JSON.parse(inventoryResult.toString()));

    const address = user.user.Address;

    const result = await contract2.submitTransaction('CreateOrder', orderPresetString, inventoryString, address, remark, prefixOrderId);
    
    return result.toString();
  } catch (error) {
    console.error(`Failed to submit Fabric transaction: ${error}`);
    throw error;
  }
}
//////////////////////////////////////////////////////////////
//Login
app.post('/api/login', cors(), (req, res) => {
  const { Account_ID, Password } = req.body;

  // Perform user validation against MongoDB
  const usersCollection = db.collection('user_account');

  usersCollection.findOne({ Account_ID, Password }, async (err, user) => {
    if (err) {
      return res.status(500).json({ message: 'Internal server error' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Connect to Fabric network with user
    try {
      await connectToFabric(user);
      //await getOrder(gateway, user);
    } catch (error) {
      console.error(`Error connecting to Hyperledger Fabric: ${error}`);
    }
    
    return res.status(200).json(user);
  });
});
//////////////////////////////////////////////////////////////
app.post('/api/orders', async (req, res) => {
  try {
    const { user } = req.body;

    const gateway = await connectToFabric(user);
    const result = await getAllOrders(gateway, user);

    // Process the response data (assuming the response is in JSON format)
    const ordersData = JSON.parse(result);

    // Send the orders data as a response
    return res.status(200).json(ordersData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});
//////////////////////////////////////////////////////////////
app.post('/api/deliveryrecords', async (req, res) => {
  try {
    const { user } = req.body;

    const gateway = await connectToFabric(user);
    const result = await GetAllDeliveryRecords(gateway, user);

    // Process the response data (assuming the response is in JSON format)
    const deliveryRecordsData = JSON.parse(result);

    // Send the orders data as a response
    return res.status(200).json(deliveryRecordsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch delivery records' });
  }
});
//////////////////////////////////////////////////////////////
app.post('/api/inventoryrecords', async (req, res) => {
  try {
    const { user } = req.body;

    const gateway = await connectToFabric(user);
    const result = await GetAllInventoryRecords(gateway, user);

    // Process the response data (assuming the response is in JSON format)
    const inventoryRecords = JSON.parse(result);

    // Send the orders data as a response
    return res.status(200).json(inventoryRecords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch inventory records' });
  }
});
//////////////////////////////////////////////////////////////\
app.post('/api/orderpreset', async (req, res) => {
  try {
    const { user } = req.body;

    const gateway = await connectToFabric(user);
    const result = await GetAllOrderPresets(gateway, user);

    // Process the response data (assuming the response is in JSON format)
    const orderPreset = JSON.parse(result);

    // Send the orders data as a response
    return res.status(200).json(orderPreset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch order preset' });
  }
});
//////////////////////////////////////////////////////////////
app.post('/api/updateorderpreset', async (req, res) => {
  try {
    const { user, orderPresetID, minimumLimit, presetQuantity } = req.body;

    const gateway = await connectToFabric(user);
    const result = await UpdateOrderPresets(gateway, user, orderPresetID, minimumLimit, presetQuantity );

    // Send the orders data as a response
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update order preset' });
  }
});
//////////////////////////////////////////////////////////////
app.post('/api/updateinventory', async (req, res) => {
  try {
    const { user, inventoryID, InventoryUpdateValue, prefixOrderId } = req.body;
    
    const gateway = await connectToFabric(user);
    const result = await UpdateInventory(gateway, user, inventoryID, InventoryUpdateValue, prefixOrderId);

    // Send the orders data as a response
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});
//////////////////////////////////////////////////////////////
app.post('/api/updateorderstatus', async (req, res) => {
  try {
    const { user, currentOrderID, statusChoice, remark, prefixDeliveryId } = req.body;

    const gateway = await connectToFabric(user);
    const result = await UpdateOrderStatus(gateway, user, currentOrderID, statusChoice, remark, prefixDeliveryId);

    // Send the orders data as a response
    return res.status(200).json(result);
    //return res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});
//////////////////////////////////////////////////////////////
app.post('/api/updatedeliverystatus', async (req, res) => {
  try {
    const { user, currentDeliveryID, statusChoice, remark} = req.body;

    const gateway = await connectToFabric(user);
    const result = await UpdateDeliveryStatus(gateway, user, currentDeliveryID, statusChoice, remark);

    // Send the orders data as a response
    return res.status(200).json(result);
    //return res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});
//////////////////////////////////////////////////////////////
app.post('/api/addorder', async (req, res) => {
  try {
    const { user, inventoryChoice, remark, prefixOrderId } = req.body;

    const gateway = await connectToFabric(user);
    const result = await AddOrder(gateway, user, inventoryChoice, remark, prefixOrderId);

    // Send the orders data as a response
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update inventory' });
  }
});
//////////////////////////////////////////////////////////////
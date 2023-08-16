package chaincode

import (
	"encoding/json"
	"fmt"
	"time"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// SmartContract provides functions for managing an Asset
type SmartContract struct {
	contractapi.Contract
}

//CHANNEL 1: Company Branch
//Inventory & Order Preset Record

type OrderPreset struct {
	PresetID        string    `json:"presetID"`
	BranchID        string    `json:"branch"`
	MinimumLimit    int       `json:"minimumLimit"`
	PresetQuantity  int       `json:"presetQuantity"`
}

type Inventory struct {
	InventoryID     string    `json:"inventoryID"`
	InventoryName	string	  `json:"inventoryName"`
	BranchID        string    `json:"branch"`
	SupplierID		string	  `json:"supplier"`
	Timestamp		string	  `json:"time"`
	InventoryQuantity int     `json:"inventoryQuantity"`
}

//CHANNEL 2 : Company Branch, Stationery Company, Supplier
//Order Record

type Order struct {
	OrderID         string    `json:"orderID"`
	InventoryID     string    `json:"inventoryID"`
	BranchID        string    `json:"branch"`
	SupplierID      string    `json:"supplier"`
	Timestamp		string 	  `json:"time"`
	BranchAddress	string	  `json:"branchAddress"`
	OrderQuantity   int       `json:"orderQuantity"`
	OrderStatus     string    `json:"orderStatus"`
	Remark          string    `json:"remark"`
}

//CHANNEL 3 : Company Branch, Supplier, Delivery Company
//Delivery Record

type Delivery struct {
	DeliveryID      string    `json:"deliveryID"`
	OrderID         string    `json:"orderID"`
	BranchID        string    `json:"branch"`
	SupplierID      string    `json:"supplier"`
	Timestamp		string	  `json:"time"`
	Destination		string	  `json:"destination"`
	DeliveryStatus  string    `json:"deliveryStatus"`
	Remark          string    `json:"remark"`
}


/////////////////////////////////////////////////////////////////////////////////
// Initialization of Ledger per Channel
// InitLedger adds a base set of assets to the ledger for each channel
func (s *SmartContract) InitLedger(ctx contractapi.TransactionContextInterface) error {

	channelID := ctx.GetStub().GetChannelID()

	// Channel 1: Company Branch
	if channelID == "channel1" {
		orderPresets := []OrderPreset{
			{ PresetID: "OP0001", BranchID: "CB0001", MinimumLimit: 25, PresetQuantity: 50},
			{ PresetID: "OP0002", BranchID: "CB0002", MinimumLimit: 25, PresetQuantity: 50},
		}

		for _, preset := range orderPresets {
			presetJSON, err := json.Marshal(preset)
			if err != nil {
				return err
			}

			err = ctx.GetStub().PutState(preset.PresetID, presetJSON)
			if err != nil {
				return fmt.Errorf("failed to put order preset to world state: %v", err)
			}
		}

		inventories := []Inventory{
			{ InventoryID: "IN0001", InventoryName: "FABRE-CASTELL GRAPHITE PENCIL TRI-GRIP 2B", BranchID: "CB0001", SupplierID: "SP0001", InventoryQuantity: 64, Timestamp: "2023-05-27 10:57"},
			{ InventoryID: "IN0002", InventoryName: "FABRE-CASTELL GRAPHITE PENCIL 1323 2B", BranchID: "CB0001", SupplierID: "SP0002", InventoryQuantity: 52, Timestamp: "2023-06-02 14:02"},
			{ InventoryID: "IN0003", InventoryName: "FABRE-CASTELL PITT GRAPHITE PURE PENCIL. HB", BranchID: "CB0002", SupplierID: "SP0001", InventoryQuantity: 102, Timestamp: "2023-06-05 12:43"},
			{ InventoryID: "IN0004", InventoryName: "FABRE-CASTELL PITT GRAPHITE PURE PENCIL. HB", BranchID: "CB0001", SupplierID: "SP0001", InventoryQuantity: 72, Timestamp: "2023-06-09 11:06"},
			{ InventoryID: "IN0005", InventoryName: "FABRE-CASTELL GRAPHITE PENCIL TRI-GRIP 2B", BranchID: "CB0002", SupplierID: "SP0001", InventoryQuantity: 86, Timestamp: "2023-06-14 10:30"},
			{ InventoryID: "IN0006", InventoryName: "FABRE-CASTELL GRAPHITE PENCIL 1323 2B", BranchID: "CB0002", SupplierID: "SP0002", InventoryQuantity: 52, Timestamp: "2023-06-17 11:44"},
		}

		for _, inventory := range inventories {
			inventoryJSON, err := json.Marshal(inventory)
			if err != nil {
				return err
			}
			
			err = ctx.GetStub().PutState(inventory.InventoryID, inventoryJSON)
			if err != nil {
				return fmt.Errorf("failed to put order preset to world state: %v", err)
			}
		}

	} else if channelID == "channel2" { // Channel 2: Company Branch, Stationery Company, Supplier
		orders := []Order{
			{OrderID: "OR0001", InventoryID: "IN0001", BranchID: "CB0001", BranchAddress : "Teluk Intan", SupplierID: "SP0001", Timestamp: "2023-05-15 11:23", OrderQuantity: 20, OrderStatus: "FAILED", Remark: "-"},
			{OrderID: "OR0002", InventoryID: "IN0003", BranchID: "CB0002", BranchAddress : "Teluk Intan", SupplierID: "SP0001", Timestamp: "2023-05-18 14:55", OrderQuantity: 40, OrderStatus: "COMPLETED", Remark: "Urgent delivery requested"},
			{OrderID: "OR0003", InventoryID: "IN0002", BranchID: "CB0001", BranchAddress : "Ipoh", SupplierID: "SP0002", Timestamp: "2023-05-20 10:32", OrderQuantity: 60, OrderStatus: "CONFIRMED", Remark: "Special packaging requested."},
			{OrderID: "OR0004", InventoryID: "IN0005", BranchID: "CB0002", BranchAddress : "Ipoh", SupplierID: "SP0001", Timestamp: "2023-05-22 16:18", OrderQuantity: 80, OrderStatus: "CONFIRMED", Remark: "-"},
			{OrderID: "OR0005", InventoryID: "IN0003", BranchID: "CB0002", BranchAddress : "Teluk Intan", SupplierID: "SP0001", Timestamp: "2023-05-23 12:46", OrderQuantity: 100, OrderStatus: "CONFIRMED", Remark: "Special customization required."},
			{OrderID: "OR0006", InventoryID: "IN0001", BranchID: "CB0001", BranchAddress : "Teluk Intan", SupplierID: "SP0001", Timestamp: "2023-05-25 15:09", OrderQuantity: 25, OrderStatus: "APPROVED", Remark: "Additional items requested."},
			{OrderID: "OR0007", InventoryID: "IN0001", BranchID: "CB0001", BranchAddress : "Teluk Intan", SupplierID: "SP0001", Timestamp: "2023-05-27 10:57", OrderQuantity: 40, OrderStatus: "DECLINED", Remark: "Out of stock item."},
			{OrderID: "OR0008", InventoryID: "IN0002", BranchID: "CB0001", BranchAddress : "Ipoh", SupplierID: "SP0002", Timestamp: "2023-05-28 13:24", OrderQuantity: 60, OrderStatus: "REJECTED", Remark: "Cancelation of order."},
			{OrderID: "OR0009", InventoryID: "IN0002", BranchID: "CB0001", BranchAddress : "Ipoh", SupplierID: "SP0002", Timestamp: "2023-05-31 11:38", OrderQuantity: 80, OrderStatus: "REQUESTED", Remark: "-"},
			{OrderID: "OR0010", InventoryID: "IN0003", BranchID: "CB0002", BranchAddress : "Teluk Intan", SupplierID: "SP0001", Timestamp: "2023-06-02 14:02", OrderQuantity: 100, OrderStatus: "REQUESTED", Remark: "-"},
		}

		for _, order := range orders {
			orderJSON, err := json.Marshal(order)
			if err != nil {
				return err
			}

			err = ctx.GetStub().PutState(order.OrderID, orderJSON)
			if err != nil {
				return fmt.Errorf("failed to put order to world state: %v", err)
			}
		}

	} else if channelID == "channel3" { // Channel 3: Company Branch, Supplier, Delivery Company
		assets := []Delivery{
			{DeliveryID: "DR0001", OrderID: "OR0001", BranchID: "CB0001", SupplierID: "SP0001", Timestamp: "2023-06-09 11:06", Destination: "Teluk Intan", DeliveryStatus: "FAILED", Remark: "Unsuccessful delivery attempt made."},
			{DeliveryID: "DR0002", OrderID: "OR0002", BranchID: "CB0002", SupplierID: "SP0001", Timestamp: "2023-06-12 14:48", Destination: "Ipoh", DeliveryStatus: "COMPLETED", Remark: "Delivered on scheduled time."},
			{DeliveryID: "DR0003", OrderID: "OR0003", BranchID: "CB0001", SupplierID: "SP0002", Timestamp: "2023-06-16 13:52", Destination: "Teluk Intan", DeliveryStatus: "IN TRANSIT", Remark: "Special packaging requested."},
			{DeliveryID: "DR0004", OrderID: "OR0004", BranchID: "CB0002", SupplierID: "SP0001", Timestamp: "2023-06-17 11:44", Destination: "Teluk Intan", DeliveryStatus: "IN TRANSIT", Remark: "-"},
			{DeliveryID: "DR0005", OrderID: "OR0005", BranchID: "CB0002", SupplierID: "SP0001", Timestamp: "2023-06-22 12:19", Destination: "Ipoh", DeliveryStatus: "SHIPPING", Remark: "Special customization required."},
		}

		for _, asset := range assets {
			assetJSON, err := json.Marshal(asset)
			if err != nil {
				return err
			}

			err = ctx.GetStub().PutState(asset.DeliveryID, assetJSON)
			if err != nil {
				return fmt.Errorf("failed to put to world state. %v", err)
			}
		}
	} 
	return nil
}

/////////////////////////////////////////////////////////////////////////////////
// Creation of Object
// Create Order Preset : Company Branch
func (s *SmartContract) CreateOrderPreset(ctx contractapi.TransactionContextInterface, presetID string, branchID string, minimumLimit int, presetQuantity int) error {
	// Check if the channel ID matches the expected value for order preset creation
	channelID := ctx.GetStub().GetChannelID()
	if channelID != "channel1" {
		return fmt.Errorf("order preset creation not allowed on this channel")
	}

	// Create the order preset object
	orderPreset := OrderPreset{
		PresetID:       presetID,
		BranchID:       branchID,
		MinimumLimit:   minimumLimit,
		PresetQuantity: presetQuantity,
	}

	// Marshal the order preset object to JSON
	orderPresetJSON, err := json.Marshal(orderPreset)
	if err != nil {
		return fmt.Errorf("failed to marshal order preset JSON: %v", err)
	}

	// Put the order preset object to the world state
	err = ctx.GetStub().PutState(presetID, orderPresetJSON)
	if err != nil {
		return fmt.Errorf("failed to put order preset to world state: %v", err)
	}

	return nil
}

// Create Inventory Record : Company Branch
func (s *SmartContract) CreateInventory(ctx contractapi.TransactionContextInterface, inventoryID string, branchID string, inventoryQuantity int) error {
	// Check if the channel ID matches the expected value for inventory creation
	channelID := ctx.GetStub().GetChannelID()
	if channelID != "channel1" {
		return fmt.Errorf("inventory creation not allowed on this channel")
	}

	location, err := time.LoadLocation("Asia/Singapore")
	
	// Create the inventory object
	inventory := Inventory{
		InventoryID:       inventoryID,
		BranchID:          branchID,
		Timestamp:         time.Now().In(location).Format("2006-01-02 15:04"),
		InventoryQuantity: inventoryQuantity,
	}

	// Marshal the inventory object to JSON
	inventoryJSON, err := json.Marshal(inventory)
	if err != nil {
		return fmt.Errorf("failed to marshal inventory JSON: %v", err)
	}

	// Put the inventory object to the world state
	err = ctx.GetStub().PutState(inventoryID, inventoryJSON)
	if err != nil {
		return fmt.Errorf("failed to put inventory to world state: %v", err)
	}

	return nil
}

// Create Order Record : Company Branch
func (s *SmartContract) CreateOrder(ctx contractapi.TransactionContextInterface, orderPresetStr string, inventoryStr string, address string, remark string, orderID string) error {
	// Check if the channel ID matches the expected value for order creation
	channelID := ctx.GetStub().GetChannelID()
	if channelID != "channel2" {
		return fmt.Errorf("order creation not allowed on this channel")
	}

	// Deserialize orderPresetStr into OrderPreset struct
	var orderPreset OrderPreset
	err := json.Unmarshal([]byte(orderPresetStr), &orderPreset)
	if err != nil {
		return fmt.Errorf("failed to unmarshal orderPreset: %v", err)
	}

	// Deserialize inventoryStr into Inventory struct
	var inventory Inventory
	err = json.Unmarshal([]byte(inventoryStr), &inventory)
	if err != nil {
		return fmt.Errorf("failed to unmarshal inventory: %v", err)
	}

	location, err := time.LoadLocation("Asia/Singapore")

	// Create the order object
	order := Order{
		OrderID:        orderID,
		InventoryID:    inventory.InventoryID,
		BranchID:       orderPreset.BranchID,
		BranchAddress:	address,
		SupplierID:     inventory.SupplierID,
		Timestamp:      time.Now().In(location).Format("2006-01-02 15:04"),
		OrderQuantity:  orderPreset.PresetQuantity,
		OrderStatus:    "REQUESTED",
		Remark:         remark,
	}

	// Marshal the order object to JSON
	orderJSON, err := json.Marshal(order)
	if err != nil {
		return fmt.Errorf("failed to marshal order JSON: %v", err)
	}

	// Put the order object to the world state
	err = ctx.GetStub().PutState(orderID, orderJSON)
	if err != nil {
		return fmt.Errorf("failed to put order to world state: %v", err)
	}

	return nil
}

// Create Delivery Record : Delivery Company
func (s *SmartContract) CreateDeliveryRecord(ctx contractapi.TransactionContextInterface, orderString string, remark string, deliveryID string) error {

	// Deserialize orderPresetStr into Order struct
	var order Order
	err := json.Unmarshal([]byte(orderString), &order)
	if err != nil {
		return fmt.Errorf("failed to unmarshal orderPreset: %v", err)
	}
	
	location, err := time.LoadLocation("Asia/Singapore")

	// Create the delivery record object
	deliveryRecord := Delivery{
		DeliveryID:      deliveryID,
		OrderID:         order.OrderID,
		BranchID:        order.BranchID,
		SupplierID:      order.SupplierID,
		Timestamp:       time.Now().In(location).Format("2006-01-02 15:04"),
		Destination:	 order.BranchAddress,
		DeliveryStatus:  "IN TRANSIT",
		Remark:			 remark,
	}

	// Marshal the delivery record object to JSON
	deliveryJSON, err := json.Marshal(deliveryRecord)
	if err != nil {
		return fmt.Errorf("failed to marshal delivery record JSON: %v", err)
	}

	// Put the delivery record object to the world state
	err = ctx.GetStub().PutState(deliveryID, deliveryJSON)
	if err != nil {
		return fmt.Errorf("failed to put delivery record to world state: %v", err)
	}

	return nil
}


/////////////////////////////////////////////////////////////////////////////////
// Reading of Object
// Read Order Preset : Company Branch
func (s *SmartContract) ReadOrderPreset(ctx contractapi.TransactionContextInterface, orderpreset string) (*OrderPreset, error) {
	// Get the order preset object from the world state
	orderPresetJSON, err := ctx.GetStub().GetState(orderpreset)
	if err != nil {
		return nil, fmt.Errorf("failed to read order preset from world state: %v", err)
	}
	if orderPresetJSON == nil {
		return nil, fmt.Errorf("order preset does not exist")
	}

	// Unmarshal the order preset JSON into a struct object
	var orderPreset OrderPreset
	err = json.Unmarshal(orderPresetJSON, &orderPreset)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal order preset JSON: %v", err)
	}

	return &orderPreset, nil
}

// Read Inventory : Company Branch
func (s *SmartContract) ReadInventory(ctx contractapi.TransactionContextInterface, inventoryID string) (*Inventory, error) {
	// Get the inventory object from the world state
	inventoryJSON, err := ctx.GetStub().GetState(inventoryID)
	if err != nil {
		return nil, fmt.Errorf("failed to read inventory from world state: %v", err)
	}
	if inventoryJSON == nil {
		return nil, fmt.Errorf("inventory does not exist")
	}

	// Unmarshal the inventory JSON into a struct object
	var inventory Inventory
	err = json.Unmarshal(inventoryJSON, &inventory)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal inventory JSON: %v", err)
	}

	return &inventory, nil
}

// Read Order : Company Branch, Stationery Company, Supplier
func (s *SmartContract) ReadOrder(ctx contractapi.TransactionContextInterface, orderID string) (*Order, error) {
	// Get the order object from the world state
	orderJSON, err := ctx.GetStub().GetState(orderID)
	if err != nil {
		return nil, fmt.Errorf("failed to read order from world state: %v", err)
	}
	if orderJSON == nil {
		return nil, fmt.Errorf("order does not exist")
	}

	// Unmarshal the order JSON into a struct object
	var order Order
	err = json.Unmarshal(orderJSON, &order)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal order JSON: %v", err)
	}

	return &order, nil
}

//Read Delivery Record : Company Branch, Supplier, Delivery Company
func (s *SmartContract) ReadDeliveryRecord(ctx contractapi.TransactionContextInterface, deliveryID string) (*Delivery, error) {
	// Get the delivery record object from the world state
	deliveryJSON, err := ctx.GetStub().GetState(deliveryID)
	if err != nil {
		return nil, fmt.Errorf("failed to read delivery record from world state: %v", err)
	}
	if deliveryJSON == nil {
		return nil, fmt.Errorf("delivery record does not exist")
	}

	// Unmarshal the delivery record JSON into a struct object
	var delivery Delivery
	err = json.Unmarshal(deliveryJSON, &delivery)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal delivery record JSON: %v", err)
	}

	return &delivery, nil
}


/////////////////////////////////////////////////////////////////////////////////
// Update of Object
// Update Order Preset
func (s *SmartContract) UpdateOrderPreset(ctx contractapi.TransactionContextInterface, orderpreset string, minimumLimit int, presetQuantity int) error {
	exists, err := s.OrderPresetExists(ctx, orderpreset)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the order preset %s does not exist", orderpreset)
	}

	// Retrieve the existing order preset
	orderPreset, err := s.ReadOrderPreset(ctx, orderpreset)
	if err != nil {
		return err
	}

	// Update the order preset attributes
	orderPreset.MinimumLimit = minimumLimit
	orderPreset.PresetQuantity = presetQuantity

	// Save the updated order preset
	orderPresetJSON, err := json.Marshal(orderPreset)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(orderpreset, orderPresetJSON)
}

// UpdateInventory updates the inventory stock quantity for a specific inventory record.
func (s *SmartContract) UpdateInventory(ctx contractapi.TransactionContextInterface, inventoryID string, inventoryQuantity int) error {
	exists, err := s.InventoryExists(ctx, inventoryID)
	if err != nil {
		return err
	}
	
	if !exists {
		return fmt.Errorf("the inventory %s does not exist", inventoryID)
	}
	
	// Retrieve the existing order preset
	inventory, err := s.ReadInventory(ctx, inventoryID)
	if err != nil {
		return err
	}
	
	location, err := time.LoadLocation("Asia/Singapore")
	
	// Update the inventory stock quantity
	inventory.InventoryQuantity = inventoryQuantity
	inventory.Timestamp = time.Now().In(location).Format("2006-01-02 15:04")

	// Save the updated inventory record to the world state
	inventoryJSON, err := json.Marshal(inventory)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(inventoryID, inventoryJSON)
}

//Update Order
func (s *SmartContract) UpdateOrder(ctx contractapi.TransactionContextInterface, orderID string, orderStatus string, remark string) error {
	exists, err := s.OrderExists(ctx, orderID)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the order %s does not exist", orderID)
	}

	// Retrieve the existing order record
	order, err := s.ReadOrder(ctx, orderID)
	if err != nil {
		return err
	}

	location, err := time.LoadLocation("Asia/Singapore")

	// Update the order attributes
	order.OrderStatus = orderStatus
	order.Timestamp = time.Now().In(location).Format("2006-01-02 15:04")
	order.Remark = remark

	// Save the updated order record
	orderJSON, err := json.Marshal(order)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(orderID, orderJSON)
}

//Update Delivery Record
func (s *SmartContract) UpdateDeliveryRecord(ctx contractapi.TransactionContextInterface, deliveryID string, deliveryStatus string, remark string) error {
	exists, err := s.DeliveryRecordExists(ctx, deliveryID)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the delivery record %s does not exist", deliveryID)
	}

	// Retrieve the existing delivery record
	deliveryRecord, err := s.ReadDeliveryRecord(ctx, deliveryID)
	if err != nil {
		return err
	}
	
	location, err := time.LoadLocation("Asia/Singapore")

	// Update the delivery record attribute
	deliveryRecord.DeliveryStatus = deliveryStatus
	deliveryRecord.Remark = remark
	deliveryRecord.Timestamp = time.Now().In(location).Format("2006-01-02 15:04")

	// Save the updated delivery record
	deliveryRecordJSON, err := json.Marshal(deliveryRecord)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(deliveryID, deliveryRecordJSON)
}


/////////////////////////////////////////////////////////////////////////////////
// Delete of Object
// Delete Order Preset
func (s *SmartContract) DeleteOrderPreset(ctx contractapi.TransactionContextInterface, presetID string) error {
	exists, err := s.OrderPresetExists(ctx, presetID)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the order preset %s does not exist", presetID)
	}

	return ctx.GetStub().DelState(presetID)
}

// Delete Inventory
func (s *SmartContract) DeleteInventory(ctx contractapi.TransactionContextInterface, inventoryID string) error {
	exists, err := s.InventoryExists(ctx, inventoryID)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the inventory %s does not exist", inventoryID)
	}

	return ctx.GetStub().DelState(inventoryID)
}

// Delete Order Record
func (s *SmartContract) DeleteOrder(ctx contractapi.TransactionContextInterface, orderID string) error {
	exists, err := s.OrderExists(ctx, orderID)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the order %s does not exist", orderID)
	}

	return ctx.GetStub().DelState(orderID)
}

// Delete Delivery Record
func (s *SmartContract) DeleteDeliveryRecord(ctx contractapi.TransactionContextInterface, deliveryID string) error {
	exists, err := s.DeliveryRecordExists(ctx, deliveryID)
	if err != nil {
		return err
	}
	if !exists {
		return fmt.Errorf("the delivery record %s does not exist", deliveryID)
	}

	return ctx.GetStub().DelState(deliveryID)
}


/////////////////////////////////////////////////////////////////////////////////
// Checking Existance of Object
// Check Order Preset Exist
func (s *SmartContract) OrderPresetExists(ctx contractapi.TransactionContextInterface, branch string) (bool, error) {
	orderPresetJSON, err := ctx.GetStub().GetState(branch)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return orderPresetJSON != nil, nil
}

// Check Inventory Exist
func (s *SmartContract) InventoryExists(ctx contractapi.TransactionContextInterface, inventoryID string) (bool, error) {
	inventoryJSON, err := ctx.GetStub().GetState(inventoryID)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return inventoryJSON != nil, nil
}

// Check Order Exist
func (s *SmartContract) OrderExists(ctx contractapi.TransactionContextInterface, orderID string) (bool, error) {
	orderJSON, err := ctx.GetStub().GetState(orderID)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return orderJSON != nil, nil
}

// Check Delivery Record Exist
func (s *SmartContract) DeliveryRecordExists(ctx contractapi.TransactionContextInterface, deliveryID string) (bool, error) {
	deliveryRecordJSON, err := ctx.GetStub().GetState(deliveryID)
	if err != nil {
		return false, fmt.Errorf("failed to read from world state: %v", err)
	}

	return deliveryRecordJSON != nil, nil
}


/////////////////////////////////////////////////////////////////////////////////
// Transfer of Object //Didn't use this
// TransferAsset updates the owner field of asset with given id in world state.
/*
func (s *SmartContract) TransferAsset(ctx contractapi.TransactionContextInterface, id string, newOwner string) error {
	asset, err := s.ReadAsset(ctx, id)
	if err != nil {
		return err
	}

	asset.Owner = newOwner
	assetJSON, err := json.Marshal(asset)
	if err != nil {
		return err
	}

	return ctx.GetStub().PutState(id, assetJSON)
}
*/
/////////////////////////////////////////////////////////////////////////////////
// Get All Object From Ledger

//Get All Orders
func (s *SmartContract) GetAllOrders(ctx contractapi.TransactionContextInterface) ([]*Order, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var orders []*Order
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var order Order
		err = json.Unmarshal(queryResponse.Value, &order)
		if err != nil {
			return nil, err
		}
		orders = append(orders, &order)
	}

	return orders, nil
}

//Get All Delivery Records
func (s *SmartContract) GetAllDeliveryRecords(ctx contractapi.TransactionContextInterface) ([]*Delivery, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var deliveryRecords []*Delivery
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var deliveryRecord Delivery
		err = json.Unmarshal(queryResponse.Value, &deliveryRecord)
		if err != nil {
			return nil, err
		}
		deliveryRecords = append(deliveryRecords, &deliveryRecord)
	}

	return deliveryRecords, nil
}


//Get All Inventory
func (s *SmartContract) GetAllInventory(ctx contractapi.TransactionContextInterface) ([]*Inventory, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var inventories []*Inventory
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var inventory Inventory
		err = json.Unmarshal(queryResponse.Value, &inventory)
		if err != nil {
			return nil, err
		}
		if inventory.InventoryID != "" {
			inventories = append(inventories, &inventory)
		}
	}

	return inventories, nil
}

// Get All Order Presets
func (s *SmartContract) GetAllOrderPresets(ctx contractapi.TransactionContextInterface) ([]*OrderPreset, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange("", "")
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var orderPresets []*OrderPreset
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var orderPreset OrderPreset
		err = json.Unmarshal(queryResponse.Value, &orderPreset)
		if err != nil {
			return nil, err
		}
		
		if orderPreset.PresetID != "" {
			orderPresets = append(orderPresets, &orderPreset)
		}

	}

	return orderPresets, nil
}
//////////////////////////////////////////////////////////////////////////////////////////
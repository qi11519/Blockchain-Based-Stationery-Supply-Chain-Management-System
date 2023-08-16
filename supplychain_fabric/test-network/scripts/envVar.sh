#!/bin/bash
#
# Copyright IBM Corp All Rights Reserved
#
# SPDX-License-Identifier: Apache-2.0
#

# This is a collection of bash functions used by different scripts

# imports
. scripts/utils.sh

export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export PEER0_CompanyBranch_CA=${PWD}/organizations/peerOrganizations/companybranch.example.com/peers/peer0.companybranch.example.com/tls/ca.crt
export PEER0_StationeryCompany_CA=${PWD}/organizations/peerOrganizations/stationerycompany.example.com/peers/peer0.stationerycompany.example.com/tls/ca.crt
export PEER0_Supplier_CA=${PWD}/organizations/peerOrganizations/supplier.example.com/peers/peer0.supplier.example.com/tls/ca.crt
export PEER0_DeliveryCompany_CA=${PWD}/organizations/peerOrganizations/deliverycompany.example.com/peers/peer0.deliverycompany.example.com/tls/ca.crt
export PEER0_ORG3_CA=${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt

# Set environment variables for the peer org
setGlobals() {
  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi
  infoln "Using organization ${USING_ORG}"
  if [ $USING_ORG -eq 1 ]; then
    export CORE_PEER_LOCALMSPID="CompanyBranchMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_CompanyBranch_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/companybranch.example.com/users/Admin@companybranch.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
  elif [ $USING_ORG -eq 2 ]; then
    export CORE_PEER_LOCALMSPID="StationeryCompanyMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_StationeryCompany_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/stationerycompany.example.com/users/Admin@stationerycompany.example.com/msp
    export CORE_PEER_ADDRESS=localhost:8051
  elif [ $USING_ORG -eq 3 ]; then
    export CORE_PEER_LOCALMSPID="SupplierMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_Supplier_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/supplier.example.com/users/Admin@supplier.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
  elif [ $USING_ORG -eq 4 ]; then
    export CORE_PEER_LOCALMSPID="DeliveryCompanyMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_DeliveryCompany_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/deliverycompany.example.com/users/Admin@deliverycompany.example.com/msp
    export CORE_PEER_ADDRESS=localhost:10051

  elif [ $USING_ORG -eq 5 ]; then
    export CORE_PEER_LOCALMSPID="Org3MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_ORG3_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org3.example.com/users/Admin@org3.example.com/msp
    export CORE_PEER_ADDRESS=localhost:11051
  else
    errorln "ORG Unknown"
  fi

  if [ "$VERBOSE" == "true" ]; then
    env | grep CORE
  fi
}

# Set environment variables for use in the CLI container 
setGlobalsCLI() {
  setGlobals $1

  local USING_ORG=""
  if [ -z "$OVERRIDE_ORG" ]; then
    USING_ORG=$1
  else
    USING_ORG="${OVERRIDE_ORG}"
  fi
  
  if [ $USING_ORG -eq 1 ]; then
    export CORE_PEER_ADDRESS=peer0.companybranch.example.com:7051
  elif [ $USING_ORG -eq 2 ]; then
    export CORE_PEER_ADDRESS=peer0.stationerycompany.example.com:8051
  elif [ $USING_ORG -eq 3 ]; then
    export CORE_PEER_ADDRESS=peer0.supplier.example.com:9051
  elif [ $USING_ORG -eq 4 ]; then
    export CORE_PEER_ADDRESS=peer0.deliverycompany.example.com:10051
  elif [ $USING_ORG -eq 5 ]; then
    export CORE_PEER_ADDRESS=peer0.org3.example.com:11051
  else
    errorln "ORG Unknown"
  fi
}

# parsePeerConnectionParameters $@
# Helper function that sets the peer connection parameters for a chaincode
# operation
parsePeerConnectionParameters() {
  PEER_CONN_PARMS=""
  PEERS=""
  while [ "$#" -gt 0 ]; do
    setGlobals $1
	echo "Currently is $1"
    if [ $1 -eq 1 ]; then
      PEER="peer0.companybranch"
      TLSINFO="--tlsRootCertFiles $PEER0_CompanyBranch_CA"
    elif [ $1 -eq 2 ]; then
      PEER="peer0.stationerycompany"
      TLSINFO="--tlsRootCertFiles $PEER0_StationeryCompany_CA"
    elif [ $1 -eq 3 ]; then
      PEER="peer0.supplier"
      TLSINFO="--tlsRootCertFiles $PEER0_Supplier_CA"
    elif [ $1 -eq 4 ]; then
      PEER="peer0.deliverycompany"
      TLSINFO="--tlsRootCertFiles $PEER0_DeliveryCompany_CA"
    elif [ $1 -eq 5 ]; then
      PEER="peer0.org3"
      TLSINFO="--tlsRootCertFiles $PEER0_ORG3_CA"
    else
      echo "Invalid organization: $USING_ORG"
      return 1
    fi
    
    ## Set peer addresses
    PEERS="$PEERS $PEER"
    PEER_CONN_PARMS="$PEER_CONN_PARMS --peerAddresses $CORE_PEER_ADDRESS"
    PEER_CONN_PARMS="$PEER_CONN_PARMS $TLSINFO"
    
    # Shift by one to get to the next organization
    shift
  done
  
  # Remove leading space for output
  PEERS="$(echo -e "$PEERS" | sed -e 's/^[[:space:]]*//')"
}



verifyResult() {
  if [ $1 -ne 0 ]; then
    fatalln "$2"
  fi
}

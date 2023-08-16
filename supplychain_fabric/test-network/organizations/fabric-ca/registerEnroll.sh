#!/bin/bash

function createCompanyBranch() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/companybranch.example.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/companybranch.example.com/

  set -x
  fabric-ca-client enroll -u https://companybranchadmin:companybranchadminpw@localhost:7054 --caname ca-companybranch --tls.certfiles ${PWD}/organizations/fabric-ca/companybranch/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-companybranch.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-companybranch.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-companybranch.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-7054-ca-companybranch.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/companybranch.example.com/msp/config.yaml

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-companybranch --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/companybranch/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-companybranch --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/companybranch/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-companybranch --id.name companybranchadmin --id.secret companybranchadminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/companybranch/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-companybranch -M ${PWD}/organizations/peerOrganizations/companybranch.example.com/peers/peer0.companybranch.example.com/msp --csr.hosts peer0.companybranch.example.com --tls.certfiles ${PWD}/organizations/fabric-ca/companybranch/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/companybranch.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/companybranch.example.com/peers/peer0.companybranch.example.com/msp/config.yaml

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:7054 --caname ca-companybranch -M ${PWD}/organizations/peerOrganizations/companybranch.example.com/peers/peer0.companybranch.example.com/tls --enrollment.profile tls --csr.hosts peer0.companybranch.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/companybranch/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/companybranch.example.com/peers/peer0.companybranch.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/companybranch.example.com/peers/peer0.companybranch.example.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/companybranch.example.com/peers/peer0.companybranch.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/companybranch.example.com/peers/peer0.companybranch.example.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/companybranch.example.com/peers/peer0.companybranch.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/companybranch.example.com/peers/peer0.companybranch.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/companybranch.example.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/companybranch.example.com/peers/peer0.companybranch.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/companybranch.example.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/companybranch.example.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/companybranch.example.com/peers/peer0.companybranch.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/companybranch.example.com/tlsca/tlsca.companybranch.example.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/companybranch.example.com/ca
  cp ${PWD}/organizations/peerOrganizations/companybranch.example.com/peers/peer0.companybranch.example.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/companybranch.example.com/ca/ca.companybranch.example.com-cert.pem

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:7054 --caname ca-companybranch -M ${PWD}/organizations/peerOrganizations/companybranch.example.com/users/User1@companybranch.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/companybranch/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/companybranch.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/companybranch.example.com/users/User1@companybranch.example.com/msp/config.yaml

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://companybranchadmin:companybranchadminpw@localhost:7054 --caname ca-companybranch -M ${PWD}/organizations/peerOrganizations/companybranch.example.com/users/Admin@companybranch.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/companybranch/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/companybranch.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/companybranch.example.com/users/Admin@companybranch.example.com/msp/config.yaml
}

function createStationeryCompany() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/stationerycompany.example.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/stationerycompany.example.com/

  set -x
  fabric-ca-client enroll -u https://stationerycompanyadmin:stationerycompanyadminpw@localhost:8054 --caname ca-stationerycompany --tls.certfiles ${PWD}/organizations/fabric-ca/stationerycompany/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-stationerycompany.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-stationerycompany.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-stationerycompany.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-8054-ca-stationerycompany.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/stationerycompany.example.com/msp/config.yaml

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-stationerycompany --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/stationerycompany/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-stationerycompany --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/stationerycompany/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-stationerycompany --id.name stationerycompanyadmin --id.secret stationerycompanyadminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/stationerycompany/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-stationerycompany -M ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/peers/peer0.stationerycompany.example.com/msp --csr.hosts peer0.stationerycompany.example.com --tls.certfiles ${PWD}/organizations/fabric-ca/stationerycompany/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/peers/peer0.stationerycompany.example.com/msp/config.yaml

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:8054 --caname ca-stationerycompany -M ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/peers/peer0.stationerycompany.example.com/tls --enrollment.profile tls --csr.hosts peer0.stationerycompany.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/stationerycompany/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/peers/peer0.stationerycompany.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/peers/peer0.stationerycompany.example.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/peers/peer0.stationerycompany.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/peers/peer0.stationerycompany.example.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/peers/peer0.stationerycompany.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/peers/peer0.stationerycompany.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/peers/peer0.stationerycompany.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/peers/peer0.stationerycompany.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/tlsca/tlsca.stationerycompany.example.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/ca
  cp ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/peers/peer0.stationerycompany.example.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/ca/ca.stationerycompany.example.com-cert.pem

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:8054 --caname ca-stationerycompany -M ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/users/User1@stationerycompany.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/stationerycompany/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/users/User1@stationerycompany.example.com/msp/config.yaml

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://stationerycompanyadmin:stationerycompanyadminpw@localhost:8054 --caname ca-stationerycompany -M ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/users/Admin@stationerycompany.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/stationerycompany/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/stationerycompany.example.com/users/Admin@stationerycompany.example.com/msp/config.yaml
}

function createSupplier() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/supplier.example.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/supplier.example.com/

  set -x
  fabric-ca-client enroll -u https://supplieradmin:supplieradminpw@localhost:9054 --caname ca-supplier --tls.certfiles ${PWD}/organizations/fabric-ca/supplier/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-supplier.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-supplier.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-supplier.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-supplier.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/supplier.example.com/msp/config.yaml

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-supplier --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/supplier/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-supplier --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/supplier/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-supplier --id.name supplieradmin --id.secret supplieradminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/supplier/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:9054 --caname ca-supplier -M ${PWD}/organizations/peerOrganizations/supplier.example.com/peers/peer0.supplier.example.com/msp --csr.hosts peer0.supplier.example.com --tls.certfiles ${PWD}/organizations/fabric-ca/supplier/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/supplier.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/supplier.example.com/peers/peer0.supplier.example.com/msp/config.yaml

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:9054 --caname ca-supplier -M ${PWD}/organizations/peerOrganizations/supplier.example.com/peers/peer0.supplier.example.com/tls --enrollment.profile tls --csr.hosts peer0.supplier.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/supplier/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/supplier.example.com/peers/peer0.supplier.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/supplier.example.com/peers/peer0.supplier.example.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/supplier.example.com/peers/peer0.supplier.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/supplier.example.com/peers/peer0.supplier.example.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/supplier.example.com/peers/peer0.supplier.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/supplier.example.com/peers/peer0.supplier.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/supplier.example.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/supplier.example.com/peers/peer0.supplier.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/supplier.example.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/supplier.example.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/supplier.example.com/peers/peer0.supplier.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/supplier.example.com/tlsca/tlsca.supplier.example.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/supplier.example.com/ca
  cp ${PWD}/organizations/peerOrganizations/supplier.example.com/peers/peer0.supplier.example.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/supplier.example.com/ca/ca.supplier.example.com-cert.pem

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:9054 --caname ca-supplier -M ${PWD}/organizations/peerOrganizations/supplier.example.com/users/User1@supplier.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/supplier/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/supplier.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/supplier.example.com/users/User1@supplier.example.com/msp/config.yaml

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://supplieradmin:supplieradminpw@localhost:9054 --caname ca-supplier -M ${PWD}/organizations/peerOrganizations/supplier.example.com/users/Admin@supplier.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/supplier/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/supplier.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/supplier.example.com/users/Admin@supplier.example.com/msp/config.yaml
}

function createDeliveryCompany() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/peerOrganizations/deliverycompany.example.com/

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/peerOrganizations/deliverycompany.example.com/

  set -x
  fabric-ca-client enroll -u https://deliverycompanyadmin:deliverycompanyadminpw@localhost:10054 --caname ca-deliverycompany --tls.certfiles ${PWD}/organizations/fabric-ca/deliverycompany/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-10054-ca-deliverycompany.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-10054-ca-deliverycompany.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-10054-ca-deliverycompany.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-10054-ca-deliverycompany.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/peerOrganizations/deliverycompany.example.com/msp/config.yaml

  infoln "Registering peer0"
  set -x
  fabric-ca-client register --caname ca-deliverycompany --id.name peer0 --id.secret peer0pw --id.type peer --tls.certfiles ${PWD}/organizations/fabric-ca/deliverycompany/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering user"
  set -x
  fabric-ca-client register --caname ca-deliverycompany --id.name user1 --id.secret user1pw --id.type client --tls.certfiles ${PWD}/organizations/fabric-ca/deliverycompany/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering the org admin"
  set -x
  fabric-ca-client register --caname ca-deliverycompany --id.name deliverycompanyadmin --id.secret deliverycompanyadminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/deliverycompany/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Generating the peer0 msp"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:10054 --caname ca-deliverycompany -M ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/peers/peer0.deliverycompany.example.com/msp --csr.hosts peer0.deliverycompany.example.com --tls.certfiles ${PWD}/organizations/fabric-ca/deliverycompany/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/peers/peer0.deliverycompany.example.com/msp/config.yaml

  infoln "Generating the peer0-tls certificates"
  set -x
  fabric-ca-client enroll -u https://peer0:peer0pw@localhost:10054 --caname ca-deliverycompany -M ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/peers/peer0.deliverycompany.example.com/tls --enrollment.profile tls --csr.hosts peer0.deliverycompany.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/deliverycompany/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/peers/peer0.deliverycompany.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/peers/peer0.deliverycompany.example.com/tls/ca.crt
  cp ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/peers/peer0.deliverycompany.example.com/tls/signcerts/* ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/peers/peer0.deliverycompany.example.com/tls/server.crt
  cp ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/peers/peer0.deliverycompany.example.com/tls/keystore/* ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/peers/peer0.deliverycompany.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/msp/tlscacerts
  cp ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/peers/peer0.deliverycompany.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/msp/tlscacerts/ca.crt

  mkdir -p ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/tlsca
  cp ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/peers/peer0.deliverycompany.example.com/tls/tlscacerts/* ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/tlsca/tlsca.deliverycompany.example.com-cert.pem

  mkdir -p ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/ca
  cp ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/peers/peer0.deliverycompany.example.com/msp/cacerts/* ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/ca/ca.deliverycompany.example.com-cert.pem

  infoln "Generating the user msp"
  set -x
  fabric-ca-client enroll -u https://user1:user1pw@localhost:10054 --caname ca-deliverycompany -M ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/users/User1@deliverycompany.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/deliverycompany/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/users/User1@deliverycompany.example.com/msp/config.yaml

  infoln "Generating the org admin msp"
  set -x
  fabric-ca-client enroll -u https://deliverycompanyadmin:deliverycompanyadminpw@localhost:10054 --caname ca-deliverycompany -M ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/users/Admin@deliverycompany.example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/deliverycompany/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/msp/config.yaml ${PWD}/organizations/peerOrganizations/deliverycompany.example.com/users/Admin@deliverycompany.example.com/msp/config.yaml
}


function createOrderer() {
  infoln "Enrolling the CA admin"
  mkdir -p organizations/ordererOrganizations/example.com

  export FABRIC_CA_CLIENT_HOME=${PWD}/organizations/ordererOrganizations/example.com

  set -x
  fabric-ca-client enroll -u https://admin:adminpw@localhost:9054 --caname ca-orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  echo 'NodeOUs:
  Enable: true
  ClientOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: client
  PeerOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: peer
  AdminOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: admin
  OrdererOUIdentifier:
    Certificate: cacerts/localhost-9054-ca-orderer.pem
    OrganizationalUnitIdentifier: orderer' >${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml

  infoln "Registering orderer"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name orderer --id.secret ordererpw --id.type orderer --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Registering the orderer admin"
  set -x
  fabric-ca-client register --caname ca-orderer --id.name ordererAdmin --id.secret ordererAdminpw --id.type admin --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  infoln "Generating the orderer msp"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp --csr.hosts orderer.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/config.yaml

  infoln "Generating the orderer-tls certificates"
  set -x
  fabric-ca-client enroll -u https://orderer:ordererpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls --enrollment.profile tls --csr.hosts orderer.example.com --csr.hosts localhost --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/ca.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/signcerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.crt
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/keystore/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/server.key

  mkdir -p ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem

  mkdir -p ${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts
  cp ${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/tls/tlscacerts/* ${PWD}/organizations/ordererOrganizations/example.com/msp/tlscacerts/tlsca.example.com-cert.pem

  infoln "Generating the admin msp"
  set -x
  fabric-ca-client enroll -u https://ordererAdmin:ordererAdminpw@localhost:9054 --caname ca-orderer -M ${PWD}/organizations/ordererOrganizations/example.com/users/Admin@example.com/msp --tls.certfiles ${PWD}/organizations/fabric-ca/ordererOrg/tls-cert.pem
  { set +x; } 2>/dev/null

  cp ${PWD}/organizations/ordererOrganizations/example.com/msp/config.yaml ${PWD}/organizations/ordererOrganizations/example.com/users/Admin@example.com/msp/config.yaml
}

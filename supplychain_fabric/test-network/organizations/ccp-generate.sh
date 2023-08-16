#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
		-e "s/\${ORGNAME}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.json
}

function yaml_ccp {
    local PP=$(one_line_pem $4)
    local CP=$(one_line_pem $5)
    sed -e "s/\${ORG}/$1/" \
		-e "s/\${ORGNAME}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        organizations/ccp-template.yaml | sed -e $'s/\\\\n/\\\n          /g'
}

ORG=companybranch
ORGNAME=CompanyBranch
P0PORT=7051
CAPORT=7054
PEERPEM=organizations/peerOrganizations/companybranch.example.com/tlsca/tlsca.companybranch.example.com-cert.pem
CAPEM=organizations/peerOrganizations/companybranch.example.com/ca/ca.companybranch.example.com-cert.pem

echo "$(json_ccp $ORG $ORGNAME $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/companybranch.example.com/connection-companybranch.json
echo "$(yaml_ccp $ORG $ORGNAME $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/companybranch.example.com/connection-companybranch.yaml

ORG=stationerycompany
ORGNAME=StationeryCompany
P0PORT=8051
CAPORT=8054
PEERPEM=organizations/peerOrganizations/stationerycompany.example.com/tlsca/tlsca.stationerycompany.example.com-cert.pem
CAPEM=organizations/peerOrganizations/stationerycompany.example.com/ca/ca.stationerycompany.example.com-cert.pem

echo "$(json_ccp $ORG $ORGNAME $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/stationerycompany.example.com/connection-stationerycompany.json
echo "$(yaml_ccp $ORG $ORGNAME $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/stationerycompany.example.com/connection-stationerycompany.yaml

ORG=supplier
ORGNAME=Supplier
P0PORT=9051
CAPORT=9054
PEERPEM=organizations/peerOrganizations/supplier.example.com/tlsca/tlsca.supplier.example.com-cert.pem
CAPEM=organizations/peerOrganizations/supplier.example.com/ca/ca.supplier.example.com-cert.pem

echo "$(json_ccp $ORG $ORGNAME $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/supplier.example.com/connection-supplier.json
echo "$(yaml_ccp $ORG $ORGNAME $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/supplier.example.com/connection-supplier.yaml

ORG=deliverycompany
ORGNAME=DeliveryCompany
P0PORT=10051
CAPORT=10054
PEERPEM=organizations/peerOrganizations/deliverycompany.example.com/tlsca/tlsca.deliverycompany.example.com-cert.pem
CAPEM=organizations/peerOrganizations/deliverycompany.example.com/ca/ca.deliverycompany.example.com-cert.pem

echo "$(json_ccp $ORG $ORGNAME $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/deliverycompany.example.com/connection-deliverycompany.json
echo "$(yaml_ccp $ORG $ORGNAME $P0PORT $CAPORT $PEERPEM $CAPEM)" > organizations/peerOrganizations/deliverycompany.example.com/connection-deliverycompany.yaml

#!/bin/bash

# imports  
. scripts/envVar.sh
. scripts/utils.sh

CHANNEL_NAME="$1"
DELAY="$2"
MAX_RETRY="$3"
VERBOSE="$4"
: ${CHANNEL_NAME:="channel1"}
: ${DELAY:="3"}
: ${MAX_RETRY:="5"}
: ${VERBOSE:="false"}

if [ ! -d "channel-artifacts" ]; then
	mkdir channel-artifacts
fi

createChannelTx() {
	set -x
	
	if [[ "$CHANNEL_NAME" == "channel1" ]]; then
		configtxgen -profile OrgsChannel1 -outputCreateChannelTx ./channel-artifacts/${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME
	elif [[ "$CHANNEL_NAME" == "channel2" ]]; then
		configtxgen -profile OrgsChannel2 -outputCreateChannelTx ./channel-artifacts/${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME
	elif [[ "$CHANNEL_NAME" == "channel3" ]]; then
		configtxgen -profile OrgsChannel3 -outputCreateChannelTx ./channel-artifacts/${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME
	else
		configtxgen -profile OrgsChannel1 -outputCreateChannelTx ./channel-artifacts/${CHANNEL_NAME}.tx -channelID $CHANNEL_NAME
	fi
	
	res=$?
	{ set +x; } 2>/dev/null
  verifyResult $res "Failed to generate channel configuration transaction..."
}

createChannel() {
	setGlobals 1
	# Poll in case the raft leader is not set yet
	local rc=1
	local COUNTER=1
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
		sleep $DELAY
		set -x
		peer channel create -o localhost:7050 -c $CHANNEL_NAME --ordererTLSHostnameOverride orderer.example.com -f ./channel-artifacts/${CHANNEL_NAME}.tx --outputBlock $BLOCKFILE --tls --cafile $ORDERER_CA >&log.txt
		res=$?
		{ set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "Channel creation failed"
}

# joinChannel ORG
joinChannel() {
  FABRIC_CFG_PATH=$PWD/../config/
  ORG=$1
  setGlobals $ORG
	local rc=1
	local COUNTER=1
	## Sometimes Join takes time, hence retry
	while [ $rc -ne 0 -a $COUNTER -lt $MAX_RETRY ] ; do
    sleep $DELAY
    set -x
    peer channel join -b $BLOCKFILE >&log.txt
    res=$?
    { set +x; } 2>/dev/null
		let rc=$res
		COUNTER=$(expr $COUNTER + 1)
	done
	cat log.txt
	verifyResult $res "After $MAX_RETRY attempts, peer0.org${ORG} has failed to join channel '$CHANNEL_NAME' "
}

setAnchorPeer() {
  ORG=$1
  docker exec cli ./scripts/setAnchorPeer.sh $ORG $CHANNEL_NAME 
}

FABRIC_CFG_PATH=${PWD}/configtx

## Create channeltx
infoln "Generating channel create transaction '${CHANNEL_NAME}.tx'"
createChannelTx

FABRIC_CFG_PATH=$PWD/../config/
BLOCKFILE="./channel-artifacts/${CHANNEL_NAME}.block"

## Create channel
infoln "Creating channel ${CHANNEL_NAME}"
createChannel
successln "Channel '$CHANNEL_NAME' created"

## Join all the peers to the channel
if [[ "$CHANNEL_NAME" == "channel1" ]]; then
	infoln "Joining company branch peer to the channel..."
	joinChannel 1
	
elif [[ "$CHANNEL_NAME" == "channel2" ]]; then
	infoln "Joining company branch peer to the channel..."
	joinChannel 1
	
	infoln "Joining stationery company peer to the channel..."
	joinChannel 2
	
	infoln "Joining supplier peer to the channel..."
	joinChannel 3

elif [[ "$CHANNEL_NAME" == "channel3" ]]; then
	infoln "Joining company branch peer to the channel..."
	joinChannel 1
	
	infoln "Joining stationery company peer to the channel..."
	joinChannel 2
	
	infoln "Joining supplier peer to the channel..."
	joinChannel 3
	
	infoln "Joining delivery company peer to the channel..."
	joinChannel 4
else
	infoln "Joining company branch peer to the channel..."
	joinChannel 1
fi

## Set the anchor peers for each org in the channel
if [[ "$CHANNEL_NAME" == "channel1" ]]; then
	infoln "Setting anchor peer for company branch..."
	setAnchorPeer 1
	
elif [[ "$CHANNEL_NAME" == "channel2" ]]; then
	infoln "Setting anchor peer for company branch..."
	setAnchorPeer 1
	
	infoln "Setting anchor peer for stationery company..."
	setAnchorPeer 2
	
	infoln "Setting anchor peer for supplier..."
	setAnchorPeer 3
	
elif [[ "$CHANNEL_NAME" == "channel3" ]]; then
	infoln "Setting anchor peer for company branch..."
	setAnchorPeer 1
	
	infoln "Setting anchor peer for stationery company..."
	setAnchorPeer 2
	
	infoln "Setting anchor peer for supplier..."
	setAnchorPeer 3
	
	infoln "Setting anchor peer for delivery company..."
	setAnchorPeer 4
	
else
	infoln "Setting anchor peer for company branch..."
	setAnchorPeer 1
	
fi

successln "Channel '$CHANNEL_NAME' joined"

require("dotenv").config();
const {
  AccountId,
  PrivateKey,
  Client,
  TokenCreateTransaction,
  TokenType,
  TokenSupplyType,
  TokenMintTransaction,
  TokenAssociateTransaction,
  AccountBalanceQuery,
  TransferTransaction,
} = require("@hashgraph/sdk");

// Configure accounts and client, and generate needed keys
const operatorId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
const operatorKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
const treasuryId = AccountId.fromString(process.env.TREASURY_ID);
const treasuryKey = PrivateKey.fromString(process.env.TREASURY_KEY);
const aliceId = AccountId.fromString(process.env.ALICE_ID);
const aliceKey = PrivateKey.fromString(process.env.ALICE_KEY);

const client = Client.forTestnet().setOperator(operatorId, operatorKey);

const supplyKey = PrivateKey.generate();

const express = require("express");
const path = require("path");
const app = express(),
  bodyParser = require("body-parser");
port = 80;

async function main(details) {
  //Create the NFT
  let tokenCreate = await new TokenCreateTransaction()
    .setTokenName(details.name)
    .setTokenSymbol(details.symbol)
    .setTokenType(TokenType.FungibleCommon)
    .setDecimals(0)
    .setInitialSupply(0)
    .setTreasuryAccountId(treasuryId)
    .setSupplyType(TokenSupplyType.Finite)
    .setMaxSupply(250)
    .setSupplyKey(supplyKey)
    .freezeWith(client);

  //Sign the transaction with the treasury key
  let tokenCreateTxSign = await tokenCreate.sign(treasuryKey);

  //Submit the transaction to a Hedera network
  let tokenCreateSubmit = await tokenCreateTxSign.execute(client);

  //Get the transaction receipt
  let tokenCreateRx = await tokenCreateSubmit.getReceipt(client);

  //Get the token ID
  let tokenId = tokenCreateRx.tokenId;

  //Log the token ID
  console.log(`This is created tokenId: ${tokenId}`);
  console.log(`This is name: ${details.name}`);
  console.log(`This is symbol: ${details.symbol}`);
}

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../my-app/build")));

app.post("/api/createNft", (req, res) => {
  console.log("reached here api...");
  console.log(req.body);
  // console.log(`from server ${nftDetails.name}`);
  main(req.body);
  // res.json(users);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../my-app/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

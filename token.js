const { Client, PrivateKey, AccountId } = require("@hashgraph/sdk");

// Comptes utilisés dans l'exercice
const myAccountId1 = AccountId.fromString("0.0.4593895");
const myPrivateKey1 = PrivateKey.fromString(
  "3030020100300706052b8104000a04220420e047ba2ba7c5f5637c1b563db706f6e224c9f31c0ab60bda6643f00ca8387424"
);
const myAccountId2 = AccountId.fromString("0.0.82272");
const myPrivateKey2 = PrivateKey.fromString(
  "302e020100300506032b6570042204202666c62c6d72af090350e41ebc08082f6dce941478e16eb8b8b8599e9020a274"
);
const myAccountId3 = AccountId.fromString("0.0.82268");
const myPrivateKey3 = PrivateKey.fromString(
  "3030020100300706052b8104000a042204206688e40e0d1ab09384c7cc5615032b856a98f599be1f14bb024a7896439f9d0f"
);

async function main() {
  // Initialiser le client Hedera
  const client = Client.forTestnet();

  // Configuration des clés
  const adminPrivateKey = myPrivateKey1;
  const supplyPrivateKey = myPrivateKey2;
  const feeSchedulePrivateKey = myPrivateKey3;

  // Configuration des royalties
  const royaltyFee = {
    numerator: 5,
    denominator: 100,
  };

  // Créer une collection de NFT avec les options spécifiées
  const nft = await new TokenCreateTransaction()
    .setTokenName("Ma collection NFT")
    .setTokenSymbol("NFT")
    .setTokenType(TokenType.NON_FUNGIBLE_UNIQUE)
    .setSupplyKey(supplyPrivateKey.publicKey)
    .setAdminKey(adminPrivateKey.publicKey)
    .setFreezeKey(adminPrivateKey.publicKey)
    .setWipeKey(adminPrivateKey.publicKey)
    .setKycKey(adminPrivateKey.publicKey)
    .setSupplyType(TokenSupplyType.FINITE)
    .setMaxSupply(10)
    .setCustomFees([
      {
        amount: royaltyFee,
        collectorAccountId: myAccountId3,
      },
    ])
    .setFeeScheduleKey(feeSchedulePrivateKey.publicKey)
    .setMemo("Mon premier NFT")
    .execute(client);

  // Attendre la confirmation de la transaction et récupérer l'identifiant du NFT créé
  const receipt = await nft.getReceipt(client);
  const tokenId = receipt.tokenId;

  // Afficher les informations du NFT créé
  console.log(`NFT créé avec l'identifiant: ${tokenId}`);
  const tokenInfo = await new TokenInfoQuery()
    .setTokenId(tokenId)
    .execute(client);
  console.log("Informations sur le NFT créé:", tokenInfo);

  // Modifier le mémo du NFT
  const updatedMemo = "Mon NFT mis à jour";
  await new TokenUpdateTransaction()
    .setTokenId(tokenId)
    .setMemo(updatedMemo)
    .execute(client);

  // Afficher les informations du NFT avec la modification effectuée
  const updatedTokenInfo = await new TokenInfoQuery()
    .setTokenId(tokenId)
   

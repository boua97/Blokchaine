 const { Client, TopicCreateTransaction, TopicInfoQuery, TopicUpdateTransaction, TopicMessageSubmitTransaction, TopicMessageQuery } = require("@hashgraph/sdk");

// Remplacez les valeurs ci-dessous par les vôtres
const myAccountId = "0.0.4593895";
const myPrivateKey = "3030020100300706052b8104000a04220420e047ba2ba7c5f5637c1b563db706f6e224c9f31c0ab60bda6643f00ca8387424";

async function main() {
  // Initialiser le client
  const client = Client.forTestnet();
  client.setOperator(myAccountId, myPrivateKey);

  // Créer un topic avec une adminKey et une submitKey différentes
  const createTopicTx = await new TopicCreateTransaction()
    .setTopicMemo("Mon premier topic")
    .setAdminKey(client.generateEd25519PrivateKey())
    .setSubmitKey(client.generateEd25519PrivateKey())
    .execute(client);

  // Récupérer le TopicId et le mémo
  const topicId = createTopicTx.getReceipt(client).topicId;
  const topicInfo = await new TopicInfoQuery()
    .setTopicId(topicId)
    .execute(client);

  console.log(`TopicId: ${topicId}`);
  console.log(`Mémo: ${topicInfo.topicMemo}`);

  // Modifier le mémo du topic
  await new TopicUpdateTransaction()
    .setTopicId(topicId)
    .setTopicMemo("Mon premier topic (modifié)")
    .execute(client);

  // Récupérer le nouveau mémo
  const updatedTopicInfo = await new TopicInfoQuery()
    .setTopicId(topicId)
    .execute(client);

  console.log(`Nouveau mémo: ${updatedTopicInfo.topicMemo}`);

  // Soumettre un message au topic
  const message = "Hello, Hedera!";
  const submitMessageTx = await new TopicMessageSubmitTransaction()
    .setTopicId(topicId)
    .setMessage(message)
    .execute(client);

  const transactionReceipt = await submitMessageTx.getReceipt(client);

  // Récupérer le message soumis sur le topic
  const messageQuery = await new TopicMessageQuery()
    .setTopicId(topicId)
    .setSequenceNumber(transactionReceipt.topicSequenceNumber)
    .execute(client);

  console.log(`Message publié: ${messageQuery.contents}`);
}

main();


  
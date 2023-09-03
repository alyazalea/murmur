module.exports = {
  name: "ping",
  description: "Check the bot's ping to the Discord server.",
  execute(message, args) {
    message.channel.send("Pinging...").then((sentMessage) => {
      const ping = sentMessage.createdTimestamp - message.createdTimestamp;
      sentMessage.edit(
        `Pong! Bot latency is ${ping}ms. API latency is ${message.client.ws.ping}ms.`
      );
    });
  },
};

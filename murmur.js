const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");

require("dotenv").config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

if (!fs.existsSync("./commands")) {
  fs.mkdirSync("./commands");
}

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

// Event handler for when the bot is ready
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Event handler for incoming messages
client.on("messageCreate", (message) => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot)
    return;

  const args = message.content
    .slice(process.env.PREFIX.length)
    .trim()
    .split(/ +/);
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply("There was an error while executing this command.");
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  const command = commands.find((cmd) => cmd.name === commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

// Log in with the bot token from the environment variable
client.login(process.env.BOT_TOKEN);

const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { startNovel } = require('./functions/vn');

const client = new Client({
	intents: [GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildPresences,
	],
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    if (commandName === 'startvn') {
        await interaction.deferReply();
        await startNovel(interaction);
    }
});

const data = {
    name: 'startvn',
    description: 'Starts the visual novel!',
};

client.once(Events.ClientReady, async c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);

    await client.application.commands.create(data);
});

client.login(token);
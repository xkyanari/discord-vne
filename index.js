const { Client, Events, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, StringSelectMenuOptionBuilder, StringSelectMenuBuilder } = require('discord.js');
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
    if (interaction.isChatInputCommand()) {
        const { commandName } = interaction;

        if (commandName === 'startvn') {
            const embed = new EmbedBuilder()
                .setColor('Blurple')
                .setTitle('Welcome!')
                .setDescription('Thank you for trying our visual novel engine for the first **DDevs Buildathon**!\n\nThis is a story between Hiroshi and Aoi meeting at a local coffee shop. You can start the story by choosing the chapter below.')
                .setImage('https://res.cloudinary.com/dnjaazvr7/image/upload/v1698906492/discord-buildathon/discord-logo_yeyfyx.png');

            const select = new ActionRowBuilder().setComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('chapter')
                    .setPlaceholder('Choose a chapter.')
                    .addOptions(
                        new StringSelectMenuOptionBuilder()
                            .setLabel('DDevs Demo')
                            .setValue('demo'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Chapter 1')
                            .setValue('chapter-01'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Chapter 2')
                            .setValue('chapter-02'),
                        new StringSelectMenuOptionBuilder()
                            .setLabel('Chapter 3 - FIN')
                            .setValue('chapter-03'),
                    )
            );

            await interaction.reply({
                embeds: [embed],
                components: [select],
            });
        }
    }

    if (interaction.isStringSelectMenu()) {
        const { customId } = interaction;

        if (customId === 'chapter') {
            await interaction.deferReply();
            await startNovel(interaction, interaction.values[0]);
        }
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
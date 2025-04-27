const {
    readFile
} = require('fs/promises');
const path = require('path');
require('dotenv').config();
const {
    Client,
    GatewayIntentBits,
    REST,
    Routes,
    SlashCommandBuilder,
    TextDisplayBuilder,
    ContainerBuilder,
    MessageFlags,
    ButtonBuilder,
    SectionBuilder,
    ButtonStyle,
    SeparatorSpacingSize,
    FileBuilder,
    AttachmentBuilder
} = require('discord.js');

const {
    TOKEN,
    CLIENT_ID
} = process.env;

const client = new Client({
    intents: [Object.keys(GatewayIntentBits)],
});

const rest = new REST({
    version: '10'
}).setToken(TOKEN);

const commands = [
    new SlashCommandBuilder()
    .setName('test')
    .setDescription('Testing command.')
    .toJSON(),
];

async function init() {
    await rest.put(Routes.applicationCommands(CLIENT_ID), {
        body: commands
    });
    console.log('Commands registered.');
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.username}!`);
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;
    if (interaction.commandName !== 'test') return;

    const FileContent = path.join(__dirname, 'NiNJA.xex');
    const Path = await readFile(FileContent, 'utf8');

    const component = new ContainerBuilder();

    const s1 = new SectionBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent('Hello world!\nThis is a test message.')
        )
        .setButtonAccessory(
            new ButtonBuilder()
            .setLabel('Click me!')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('test1')
        );

    const s2 = new SectionBuilder()
        .addTextDisplayComponents(
            new TextDisplayBuilder().setContent('Hello world! 1\nThis is a test message. 2')
        )
        .setButtonAccessory(
            new ButtonBuilder()
            .setLabel('Click me!')
            .setStyle(ButtonStyle.Danger)
            .setCustomId('test2')
        );

    const hintText = new TextDisplayBuilder()
        .setContent("-# small little hello world!\n");

    component.addSectionComponents(s1);
    component.addSeparatorComponents(s => s.setSpacing(SeparatorSpacingSize.Small));
    component.addSectionComponents(s2);
    component.addSeparatorComponents(s => s.setSpacing(SeparatorSpacingSize.Small));
    component.addTextDisplayComponents(hintText);
    component.addFileComponents(
        new FileBuilder().setURL('attachment://NiNJA.xex')
    );

    await interaction.reply({
        components: [component],
        files: [new AttachmentBuilder(Buffer.from(Path), {
            name: 'NiNJA.xex',
        })],
        flags: MessageFlags.IsComponentsV2,
    });
});

init().then(() => client.login(TOKEN));
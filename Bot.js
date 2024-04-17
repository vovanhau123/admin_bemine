const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, EmbedBuilder, ChannelType } = require('discord.js');
const token = '';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);

    // Tạo một lệnh slash mới
    const chatCommand = new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Gửi một embed đến kênh cụ thể.')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('Tiêu đề của embed.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Nội dung của embed.')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('image')
                .setDescription('URL hình ảnh cho embed.')
                .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('Chọn kênh để gửi embed.')
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText) // Chỉ cho phép chọn kênh văn bản
        );

    // Đăng ký lệnh slash với Discord API
    const rest = new REST({ version: '10' }).setToken(token);
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            Routes.applicationGuildCommands(client.user.id, '1229484289855324220'), // Thay 'YOUR_GUILD_ID' bằng ID của server
            { body: [chatCommand.toJSON()] }
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'chat') {
        const title = interaction.options.getString('title');
        const text = interaction.options.getString('text');
        const imageUrl = interaction.options.getString('image');
        const channel = interaction.options.getChannel('channel');

        try {
            // Tạo một embed mới
            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(text)
                .setImage(imageUrl)
                .setColor(FF0000); // 'Random' để chọn một màu ngẫu nhiên

            await channel.send({ embeds: [embed] });
            await interaction.reply({ content: 'Tin nhắn gửi thành công', ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Có lỗi xảy ra khi gửi embed.', ephemeral: true });
        }
    }
});

client.login(token);
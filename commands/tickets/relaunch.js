const { ActionRowBuilder, SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const button = require('../modules/buttons.js');
const { categories } = require('../config.json');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('relaunch')
        .setDescription('Relaunch user on his ticket.')
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
    async execute(interaction) {
        if (!interaction.channel.parentId === categories.tickets) return interaction.reply({ content: 'This command can be used only in a ticket channel.', ephemeral: true });
        const lock = new ActionRowBuilder()
            .addComponents(
                button("ticketlock", "Lock", "Secondary", null, false)
            )
        await interaction.reply({ content: 'Member has been relaunch!', ephemeral: true });
        interaction.channel.send({ content: `>>>Has the ticket been resolved?\nIf yes, press the button.`, components: [lock] });
    },
};
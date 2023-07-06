const { ActionRowBuilder, PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const embed = require("../modules/embed.js");
const button = require("../modules/buttons.js");
const { informations, channels } = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Send the embed for ticket")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        if (interaction.channelId != channels.ticket) {
            interaction.reply({ content: `The command are only available in <#${channels.ticket}>`, ephemeral: true })
            return;
        }
        const ticketEmbed = embed(":envelope: Ticket", "#0394fc", "To open a ticket, press the button.", null, informations.name, informations.logo);
        var buttons = new ActionRowBuilder()
			    .addComponents(
                    button("ticketopen", "Open", "Primary", null, false)
                );
        await interaction.deferReply({ ephemeral: true });
        await interaction.channel.send({  embeds: [ticketEmbed], components: [buttons]  });
        await interaction.editReply("Message sent!");
    },
}
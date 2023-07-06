const { SlashCommandBuilder } = require("discord.js");
const { informations } = require('../config.json');
const embed = require("../modules/embed.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("removemember")
        .setDescription("Remove a member of the ticket.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Select a member.")
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.channel.name.startsWith("ticket-")) return;
        let user = interaction.options.getUser("user");
        interaction.channel.permissionOverwrites.create(user.id, { ViewChannel: false });
        const embedRemovedMember = embed(`Delete ${user.username}`, "#0afc0e", `${user.username} has been deleted from the ticket!`, null, informations.name, informations.logo)
        await interaction.channel.send({embeds: [embedRemovedMember]})
        await interaction.reply("Member deleted!");
        await interaction.deleteReply();
    }
}
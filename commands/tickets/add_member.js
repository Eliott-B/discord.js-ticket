const { SlashCommandBuilder } = require("discord.js");
const { informations } = require('../config.json');
const embed = require("../modules/embed.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("addmember")
        .setDescription("Add a member to a ticket.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Select a member.")
                .setRequired(true)),
    async execute(interaction) {
        if (!interaction.channel.name.startsWith("ticket-")) return;
        let user = interaction.options.getUser("user");
        interaction.channel.permissionOverwrites.create(user.id, { ViewChannel: true });
        const embedAddedMember = embed(`Added ${user.username}`, "#0afc0e", `${user.username} has been added to the ticket!`, null, informations.name, informations.logo)
        await interaction.channel.send({embeds: [embedAddedMember]})
        await interaction.reply("Member added!");
        await interaction.deleteReply();
    }
}
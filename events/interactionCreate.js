const { ActionRowBuilder, ChannelType, PermissionsBitField } = require("discord.js");
const { informations, roles, channels, categories } = require('../config.json');
const fs = require('fs');
const embed = require("../modules/embed.js");
const button = require("../modules/buttons.js");

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        if (interaction.member.id == informations.clientId) return;

        // Button interaction
        if (interaction.isButton()){
            try {
                console.log(`${interaction.user.tag} used a button in #${interaction.channel.name}.`);
    
                if (interaction.customId == "ticketopen") {
                    const role_staff = interaction.guild.roles.cache.find(r => r.id === roles.moderator);
                    const channelTicket = interaction.guild.channels.cache.find(channel => channel.name === `ticket-${interaction.user.username.toLowerCase()}`);
                    if (channelTicket === undefined) {
                        interaction.guild.channels.create({
                            name: `ticket-${interaction.user.username}`,
                            type: ChannelType.GuildText,
                            parent: categories.ticket,
                            permissionOverwrites: [
                                {
                                    id: interaction.guild.id,
                                    deny: [PermissionsBitField.Flags.ViewChannel],
                                },
                                {
                                    id: interaction.user.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel],
                                },
                                {
                                    id: role_staff.id,
                                    allow: [PermissionsBitField.Flags.ViewChannel],
                                },
                            ],
                        }).then(async channel => {
                            await interaction.reply({ content: `Your ticket has been created: <#${channel.id}>!`, ephemeral: true });
                            const openTicketEmbed = embed(`${channel.name.split("-")[1]}'s ticket`, "#0afc0e", "A moderator will be coming.\nIn the meantime, you can provide all the information you need to solved the ticket.", null, informations.name, informations.logo);
                            var buttons = new ActionRowBuilder()
                                .addComponents(
                                    button("ticketlock", "Lock", "Secondary", null, false)
                                );
                                await channel.send({  embeds: [openTicketEmbed], components: [buttons]  });
                        });
                    } else {
                        await interaction.reply({ content: `A ticket has already open: <#${channelTicket.id}>`, ephemeral: true});
                    }
                }
    
                if (interaction.customId === "ticketlock") {
                    interaction.channel.permissionOverwrites.create(interaction.channel.guild.roles.everyone, { SendMessages: false, ViewChannel: false });
                    const lockTicketEmbed = embed(`Locking ${interaction.channel.name} ticket`, "#0afc0e", `${interaction.member} has locked the ticket.\nYou can reopen it, save it or close it (option reserved for moderators).`, null, informations.name, informations.logo);
                    const buttons = new ActionRowBuilder()
                    .addComponents(
                        button("ticketreopen", "Reopen", "Secondary", null, false),
                        button("ticketsave", "Save", "Success", null, false),
                        button("ticketclose", "Close", "Danger", null, false)
                    )
                    interaction.reply({  embeds: [lockTicketEmbed], components: [buttons]  });
                }
    
                if (interaction.customId === "ticketreopen") {
                    interaction.channel.permissionOverwrites.create(interaction.channel.guild.roles.everyone, { SendMessages: true, ViewChannel: false });
                    interaction.message.delete();
                    await interaction.deferUpdate();
                }
    
                if (interaction.customId == "ticketclose") {
                    if (!interaction.member.roles.cache.some(role => role.id === roles.moderator)) {
                        interaction.reply({ content: `Only moderator, can close a ticket!`, ephemeral: true });
                        return;
                    };
                    const logs = interaction.guild.channels.cache.find(channel => channel.id === channels.logs);
                    let logsEmbed = embed(`Closing ${interaction.channel.name} ticket`, "#e01a16", `${interaction.member} has closed the ticket.`, null, informations.name, informations.logo);
                    await logs.send({ embeds: [logsEmbed] });
                    interaction.channel.delete();
                    await interaction.deferUpdate();
                }
    
                if (interaction.customId == "ticketsave") {
                    await interaction.channel.messages.fetch().then(async messages => {
                        let stream = fs.createWriteStream(`tickets/save-${interaction.channel.name.split("-")[1]}.txt`);
                        let msgs = [];
                        for (let message of messages.values()) {
                            if (message.content !== "") {
                                msgs.push(message);
                            }
                        }
                        msgs = msgs.reverse();
                        msgs.forEach(message => {
                            const date = new Date(message.createdTimestamp);
                            stream.write(`(${date.getUTCMonth()}-${date.getUTCDate()}-${date.getUTCHours()}h-${date.getUTCMinutes()}m) ${message.author.username}: ${message.content}\n\n`);
                        });
                        stream.end();
                        await interaction.user.send({ files: [`tickets/save-${interaction.channel.name.split("-")[1]}.txt`]  });
                    });
                    await interaction.reply({ content: "The save is available in your private message.", ephemeral: true });
                }
    
            } catch (err) {
                console.error(err);
                await interaction.reply({ content: 'An error has occurred during execution of the command. Contact a server administrator.', ephemeral: true });
            }
        }
    },
};
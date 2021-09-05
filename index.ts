import Discord, { TextChannel } from 'discord.js';
import dotEnv from 'dotenv';

dotEnv.config();

if (!process.env.TOKEN) {
    console.error("No bot token detected!");
    process.exit(1);
}

const client = new Discord.Client({
    intents: ["GUILD_MESSAGES", "GUILDS"]
});

const channelsToMessage: Discord.TextChannel[] = [];

function sendBananas (): void {
    channelsToMessage.forEach(channel => {
        if (!channel.send) {
            console.error("No send :(")
            debugger;
            return;
        }

        (channel as TextChannel).send(banana);
    });
}

function refreshChannels() {
    client.channels.cache.forEach(channel => {
        if (!channel.isText()) {
            return;
        }

        if (!channel.hasOwnProperty("name")) {
            return;
        }

        if ((channel as Discord.GuildChannel).name.toLowerCase().includes("general")) {
            channelsToMessage.push(channel as Discord.TextChannel);
        }
    });
}

const banana = "🍌"

client.on('ready', () => {
    console.log("Ready!");
    
    refreshChannels()
    console.log("Channels to send messages to: " + channelsToMessage.map(e => e.name).join(", "));

    sendBananas();

    setInterval(sendBananas, 3600000);
});

client.on('guildCreate', guild => {
    guild.channels.cache.forEach(channel => {
        if (channel.name.toLowerCase().includes("general")) {
            if (channel.type === "GUILD_TEXT") {
                channelsToMessage.push(channel as TextChannel);
                (channel as TextChannel).send(banana)
            }
        }
    })
})

client.on('guildDelete', refreshChannels)

client.login(process.env.TOKEN);
import {Client, Collection, GatewayIntentBits, REST, Routes} from "discord.js";
import {readdirSync} from "fs";
import * as path from "path";
import ChatCommand from "../command";
import config from "../config/bot.json";
import DiscordEvent from "../event";

const CommandPath = path.join(__dirname, '..', 'command')
const CommandFolders = readdirSync(CommandPath).filter(folder => !folder.endsWith('.ts'));

const EventPath = path.join(__dirname, '..', 'event')
const EventFiles = readdirSync(EventPath).filter(file => file.endsWith('.ts') && file != 'index.ts');

export class CLIENT extends Client {
    readonly commands: Collection<string, ChatCommand> = new Collection()

    constructor() {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers
            ]
        });

        this.initCommands()
        this.registerCommands()
        this.registerEvents()
    }

    async start() {
        await this.login(config.token);
    }

    async stop() {
        await this.destroy();
    }

    private initCommands() {
        for (const folder of CommandFolders) {
            const commandFiles = readdirSync(path.join(CommandPath, folder)).filter(file => file.endsWith('.ts'));
            for (const file of commandFiles) {
                try {
                    const loader = require(path.join(CommandPath, folder, file)).default;
                    const command = new loader() as ChatCommand;
                    this.commands.set(command.data.name, command);
                } catch (error) {
                    console.error(error);
                    console.log(`올바르지 않은 파일 ${file}은 무시되었습니다. 해당 위치는 ChatCommand 타입만 가능합니다!`)
                }
            }
        }
    }

    private registerCommands() {
        const commandDatas = this.commands.map(command => command.data.toJSON());
        const rest = new REST().setToken(config.token)
        rest.put(
            config.guildId == "" ? Routes.applicationCommands(config.clientId) : Routes.applicationGuildCommands(config.clientId, config.guildId),
            {body: commandDatas}
        ).then(() => {
            console.log(`총 ${commandDatas.length}개의 명령어를 등록했습니다.`);
        }).catch(console.error);
    }

    private registerEvents() {
        for (const file of EventFiles) {
            try {
                const loader = require(path.join(EventPath, file)).default;
                const event = new loader() as DiscordEvent;

                if (event.once) {
                    this.once(event.name, (...args) => event.execute(...args));
                } else {
                    this.on(event.name, (...args) => event.execute(...args));
                }
            } catch (error) {
                console.log(`올바르지 않은 파일 ${file}은 무시되었습니다. 해당 위치는 Event 타입만 가능합니다!`)
            }
        }
    }
}
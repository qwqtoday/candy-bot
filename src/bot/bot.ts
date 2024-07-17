import { Bot, createBot } from "mineflayer";
import { db } from "../db";
import workers from "../db/schema/workers";
import { eq } from "drizzle-orm";
import * as logger from "../worker_threads/logger";
import { getCommandDispatcher } from "./command/command";
import { loadPlugins } from "./plugin/plugin";
import { getUserLevelByUUID } from "../db/queries/users_queries";
import { isMainThread, parentPort } from "worker_threads";
import TaskManager from "./task/TaskManager";
import WorkerConfig from "./config/WorkerConfig";
import createWorkerConfig from "./config/createWorkerConfig";
import { setWorkerConfig } from "../db/controllers/workers_controller";

const WHISPER_MESSAGE_REGEX = /([a-zA-Z]+) -> [a-zA-Z]+: (.+)/g;

export const runningBots: Set<number> = new Set();
const bots: { [worker_id: number]: Bot } = {};

const commandDispatcher = getCommandDispatcher()

export async function startBot(worker_id: number) {
    if (runningBots.has(worker_id)) return;

    const worker = await db
        .select({
            name: workers.name,
            owner: workers.owner,
            config: workers.config
        })
        .from(workers)
        .where(eq(workers.id, worker_id))
        .get();

    let config: WorkerConfig
    if (worker.config === null) {
        config = createWorkerConfig()
    } else {
        try {
            config = JSON.parse(worker.config)
        } catch {
            logger.error(`Worker ${worker_id} failed to parse config from database, resetting the config to default.`)
            config = createWorkerConfig()
        }
    }

    const bot = createBot({
        host: "ab.natoriqct.xyz",
        port: 25565,
        username: `worker-${worker_id}`,
        auth: "microsoft",
        viewDistance: 10,
        version: "1.20.4",
        onMsaCode: async (data) => {
            logger.info(
                `To sign in worker ${worker.name} (${worker_id}), use a web browser to open the page https://www.microsoft.com/link and use the code ${data.user_code} or visit http://microsoft.com/link?otc=${data.user_code}`,
            );
        },
    });

    bot.worker_id = worker_id
    bot.saveWorkerConfig = async () => {
        setWorkerConfig(worker_id, JSON.stringify(config, (key, value) => {
            if (value instanceof Set) {
                return Array.from(value)
            }
            return value
        }))
    }

    bot.saveWorkerConfig()

    loadPlugins(bot)
    const taskManager = new TaskManager(bot, config)


    bot.once("spawn", () => {
        logger.info(`Worker ${worker_id} is ready`);
        if (!isMainThread) {
            parentPort.postMessage({
                type: "started-bot",
                id: worker_id
            })
        }
    });

    bot.once("error", (err) => {
        logger.error(`Worker ${worker_id} because this error occured ${err}`)
        stopBot(worker_id)
    })

    bot.once("end", (reason) => {
        logger.error(`worker ${worker_id} ended because ${reason}`)
        stopBot(worker_id)
    });


    bot.on("messagestr", async (msg) => {
        const match_res = WHISPER_MESSAGE_REGEX.exec(msg);
        if (match_res === null) return;
        const sender = match_res[1];
        const message = match_res[2];

        const senderUUID = bot.players[sender].uuid ?? null

        if (senderUUID === null) {
            bot.whisper(sender, "We aren't able to find your uuid.")
            return;
        }

        const userLevel = await getUserLevelByUUID(senderUUID)

        if (senderUUID !== worker.owner && (userLevel === null || userLevel === 0)) {
            bot.whisper(sender, "You don't have permission to use this bot.")
            return;
        }

        try {
            commandDispatcher.execute(message, {
                senderName: sender,
                bot: bot,
                taskManager: taskManager,
            });
        } catch (err) {
            bot.whisper(sender, err.message);
        }
    });
    runningBots.add(worker_id);
    bots[worker_id] = bot;
}

export async function stopBot(worker_id: number) {
    runningBots.delete(worker_id);
    const bot = bots[worker_id];
    if (bot !== null && bot !== undefined) {
        bot.end();
    }
    delete bots[worker_id]

    if (!isMainThread) {
        parentPort.postMessage({
            type: "bot-ended",
            id: worker_id
        })
    }
}


declare module "mineflayer" {
    interface Bot {
        worker_id: number
        saveWorkerConfig: () => void
    }
}
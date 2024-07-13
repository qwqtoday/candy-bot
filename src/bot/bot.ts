import { Bot, createBot } from "mineflayer";
import { db } from "../db";
import workers from "../db/schema/workers";
import { eq } from "drizzle-orm";
import * as logger from "../worker_threads/logger";
import { getCommandDispatcher } from "./command/command";
import { loadPlugins } from "./plugin/plugin";

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
        })
        .from(workers)
        .where(eq(workers.id, worker_id))
        .get();
  
  const bot = createBot({
    host: "cn3.molean.com",
    port: 25565,
    username: `worker-${worker_id}`,
    auth: "microsoft",
    viewDistance: 10,
    onMsaCode: async (data) => {
      

      logger.info(
        `To sign in worker ${worker.name} (${worker_id}), use a web browser to open the page https://www.microsoft.com/link and use the code ${data.user_code} or visit http://microsoft.com/link?otc=${data.user_code}`,
      );
    },
  });

  loadPlugins(bot)

  bot.once("spawn", () => {
    logger.info(`Worker ${worker_id} is ready`);
  });

  bot.once("end", () => {
    runningBots.delete(worker_id);
  });

  bot.on("messagestr", (msg) => {
    const match_res = WHISPER_MESSAGE_REGEX.exec(msg);
    if (match_res === null) return;
    const sender = match_res[1];
    const message = match_res[2];

    const senderUUID = bot.players[sender].uuid ?? null

    if (senderUUID === null) {
      bot.whisper(sender, "We aren't able to find your uuid.")
      return;
    }
    
    if (senderUUID !== worker.owner) {
      bot.whisper(sender, "You don't have permission to use this bot.")
      return;
    }
    
    try {
      commandDispatcher.execute(message, {
        senderName: sender,
        bot: bot,
      });
    } catch (err) {
      logger.error(err);
    }
  });
  runningBots.add(worker_id);
  bots[worker_id] = bot;
}

export async function stopBot(worker_id: number) {
  runningBots.delete(worker_id);
  const bot = bots[worker_id];
  if (bot !== null || bot !== undefined) {
    bot.end();
  }
}

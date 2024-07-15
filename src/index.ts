import { CommandSyntaxException, SimpleCommandExceptionType } from "@jsprismarine/brigadier";
import { commandDispatcher } from "./console/commands";
import { db } from "./db";
import workers from "./db/schema/workers";
import { addWorkerBot, startWorkerThread, WorkerThread } from "./worker_threads/worker";
import readline from "readline";




async function main() {
    console.log("Starting all bots...")
    const _workers = await db
        .select({
            id: workers.id,
        })
        .from(workers);

    _workers.forEach((worker) => addWorkerBot(worker.id));

    const rl = readline.createInterface(process.stdin, process.stdout);

    rl.on("line", (line) => {
        try {
            commandDispatcher.execute(line, {})
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message)
            }
        }
    })
}

main();

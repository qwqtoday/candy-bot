import { argument, CommandContext, CommandDispatcher, literal, string } from "@jsprismarine/brigadier";
import { CommandSource } from "../bot/command/command";
import { getUser, getUsers } from "../db/queries/users_queries";
import { addWorker } from "../db/controllers/workers_controller";
import { addWorkerBot } from "../worker_threads/worker";
import { getWorkers } from "../db/queries/workers_queries";

export const commandDispatcher = new CommandDispatcher<Object>()

commandDispatcher.register(
    literal<Object>("add-bot")
        .then(
            argument<Object, string>("name", string())
                .then(
                    argument<Object, string>("owner", string())
                        .executes(async (context: CommandContext<Object>) => {
                            const source = context.getSource()
                            const name = context.getArgument("name")
                            const owner = context.getArgument("owner")

                            const user = getUser(owner)

                            if (user === null) {
                                console.log("Owner is not a user.")
                                return;
                            }

                            const worker_id = await addWorker(name, owner)

                            await addWorkerBot(worker_id)
                        })
                )
        )
)

commandDispatcher.register(
    literal<Object>("users")
        .executes(async (context: CommandContext<Object>) => {
            const users = await getUsers()
            console.log("Users:")
            for (const { uuid, level } of users) {
                console.log(`${uuid} (Level: ${level})`)
            }
        })
)
commandDispatcher.register(
    literal<Object>("workers")
        .executes(async (context: CommandContext<Object>) => {
            const workers = await getWorkers()
            console.log("Workers:")
            for (const { id, name, owner } of workers) {
                console.log(`${id}. ${name} (owner: ${owner})`)
            }
        })
)
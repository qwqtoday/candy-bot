import { argument, CommandContext, CommandDispatcher, literal, string, integer } from "@jsprismarine/brigadier";
import { CommandSource } from "../bot/command/command";
import { getUser, getUsers } from "../db/queries/users_queries";
import { addWorker, removeWorker } from "../db/controllers/workers_controller";
import { addWorkerBot, removeWorkerBot } from "../worker_threads/worker";
import { getWorkers } from "../db/queries/workers_queries";
import { addUser, setUserLevel } from "../db/controllers/users_controller";

export const commandDispatcher = new CommandDispatcher<Object>()

commandDispatcher.register(
    literal<Object>("add-worker")
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
    literal<Object>("remove-worker")
        .then(
            argument("name", integer())
                .executes(async (context: CommandContext<Object>) => {
                    const worker_id = context.getArgument("id")

                    await removeWorker(worker_id)
                    await removeWorkerBot(worker_id)
                })
        )
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

commandDispatcher.register(
    literal<Object>("add-user")
        .then(
            argument("uuid", string())
                .executes(async (context: CommandContext<Object>) => {
                    const uuid = context.getArgument("uuid")
                    await addUser(uuid)
                    console.log(`Added user ${uuid}`)
                })
        )
)

commandDispatcher.register(
    literal<Object>("set-user-level")
        .then(
            argument("uuid", string())
                .then(
                    argument("level", integer(0, Infinity))
                        .executes(async (context: CommandContext<Object>) => {
                            const uuid = context.getArgument("uuid")
                            const level = context.getArgument("level")

                            await setUserLevel(uuid, level)
                            console.log(`Setted user ${uuid}'s level to ${level}`)
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

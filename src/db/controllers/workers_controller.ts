import { db } from "..";
import { startBot } from "../../bot/bot";
import workers from "../schema/workers";

export async function addWorker(name: string, ownerUUID: string): Promise<number> {
    const res = await db.insert(workers).values({
        name: name,
        owner: ownerUUID,
    })

    return res.lastInsertRowid as number;
}
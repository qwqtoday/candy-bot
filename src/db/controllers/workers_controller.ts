import { eq } from "drizzle-orm";
import { db } from "..";
import { startBot } from "../../bot/bot";
import workers from "../schema/workers";
import { config } from "process";

export async function addWorker(name: string, ownerUUID: string): Promise<number> {
    const res = await db.insert(workers).values({
        name: name,
        owner: ownerUUID,
    })

    return res.lastInsertRowid as number;
}

export async function removeWorker(worker_id: number) {
    const res = await db.delete(workers)
        .where(eq(workers.id, worker_id))
}


export async function setWorkerConfig(worker_id: number, config: string) {
    const res = await db
        .update(workers)
        .set({
            config: config
        })
        .where(eq(workers.id, worker_id))
}
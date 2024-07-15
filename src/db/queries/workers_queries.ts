import { eq } from "drizzle-orm";
import { db } from "..";
import workers from "../schema/workers";

export async function getWorkerOwnerUUID(worker_id: number): Promise<string | null> {
    return db
        .select({
            owner: workers.owner
        })
        .from(workers)
        .where(eq(workers.id, worker_id))
        .get()?.owner
}


export async function getWorkers() {
    return db
        .select()
        .from(workers)
        .all()
}
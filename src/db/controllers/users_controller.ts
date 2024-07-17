import { eq } from "drizzle-orm";
import { db } from "..";
import users from "../schema/users";

export async function addUser(uuid: string) {
    await db.insert(users).values({
        uuid: uuid,
    })
}

export async function setUserLevel(uuid: string, level: number) {
    await db.update(users)
        .set({
            // @ts-ignore
            level: level
        })
        .where(eq(users.uuid, uuid))
}
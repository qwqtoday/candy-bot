import { eq } from "drizzle-orm";
import { db } from "..";
import users from "../schema/users";

export async function getUserLevelByUUID(userUUID: string): Promise<number | null> {
    return db
        .select({
            level: users.level
        })
        .from(users)
        .where(eq(users.uuid, userUUID))
        .get()?.level
}

export async function getUsers() {
    return db
        .select()
        .from(users)
        .all()
}

export async function getUser(userUUID: string) {
    return db
        .select()
        .from(users)
        .where(eq(users.uuid, userUUID))
        .get() ?? null
}
import { eq } from "drizzle-orm";
import { db } from "..";
import users from "../schema/users";

export async function getUserLevelByUUID(userUUID: string) {
    return db
    .select({
        level: users.level
    })
    .from(users)
    .where(eq(users.uuid, userUUID))
    .get().level
}
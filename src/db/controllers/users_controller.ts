import { db } from "..";
import users from "../schema/users";

export async function addUser(uuid: string) {
    await db.insert(users).values({
        uuid: uuid,
    })
}
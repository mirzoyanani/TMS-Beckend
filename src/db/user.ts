import db from "./index.js";
import { UserInfoDTO } from "../lib/index.js";
export async function getUserInfo(uid: string): Promise<object> {
  try {
    const userInfo = (
      await db.query(
        db.format("SELECT name,email,surname,image,telephone,connection_date from users WHERE uid = ?", [uid]),
      )
    )[0];
    return userInfo;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function updateUserInfo(uid: string, newUserInfo: UserInfoDTO): Promise<void> {
  try {
    const { name, surname, profilePicture, telephone } = newUserInfo;

    await db.query(
      db.format("UPDATE users SET name = ?, surname = ?, image = ?, telephone = ? WHERE uid = ?", [
        name,
        surname,
        profilePicture,
        telephone,
        uid,
      ]),
    );
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

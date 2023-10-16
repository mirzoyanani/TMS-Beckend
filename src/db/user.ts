import db from "./index.js";
export async function getUserInfo(decoded: any): Promise<object> {
  try {
    const userInfo = (
      await db.query(
        db.format("SELECT name,email,surname,image,telephone,connection_date from users WHERE uid = ?", [decoded.uid]),
      )
    )[0];
    return userInfo;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
interface UserInfo {
  name: string;
  surname: string;
  profilePicture: string;
  telephone: string;
}

export async function updateUserInfo(decoded: any, newUserInfo: UserInfo): Promise<boolean> {
  try {
    const { name, surname, profilePicture, telephone } = newUserInfo;

    const updateQuery = db.format("UPDATE users SET name = ?, surname = ?, image = ?, telephone = ? WHERE uid = ?", [
      name,
      surname,
      profilePicture,
      telephone,
      decoded.uid,
    ]);

    await db.query(updateQuery);

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

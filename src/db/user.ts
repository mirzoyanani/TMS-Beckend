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

import db from "./index.js";
import { RowDataPacket } from "mysql2/promise";
export async function registerUser(payload: {
  uid: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  telephone: string;
  img: string;
}): Promise<void> {
  try {
    await db.query(
      db.format(
        `INSERT INTO users (uid,name,surname,email,password,image,telephone)
            VALUES (?);`,
        [[payload.uid, payload.name, payload.surname, payload.email, payload.password, payload.img, payload.telephone]],
      ),
    );
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
}

export async function getCurrentUserByEmail(email: string): Promise<RowDataPacket | null> {
  try {
    const queryResult = await db.query("SELECT uid, password, email FROM users WHERE email = ?", [email]);

    const users = queryResult[0] as RowDataPacket[];
    const currentUser = users[0] || null;
    return currentUser;
  } catch (error) {
    console.error("login Error :", error);
    throw error;
  }
}

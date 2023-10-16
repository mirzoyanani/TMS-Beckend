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
    throw new Error("User registration failed: " + (error as Error).message);
  }
}

export async function getCurrentUserByEmailorId(email?: string, uid?: string): Promise<RowDataPacket | null> {
  try {
    if (email) {
      const queryResult = await db.query(db.format("SELECT uid, password, email FROM users WHERE email = ?", [email]));
      const users = queryResult[0] as RowDataPacket[];
      return users[0] || null;
    } else if (uid) {
      const queryResult = await db.query(db.format("SELECT uid, password, email FROM users WHERE uid = ?", [uid]));
      const users = queryResult[0] as RowDataPacket[];
      return users[0] || null;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting user:", error);
    throw error;
  }
}

export async function updatePassword(newPassword: string, uid: string): Promise<void> {
  try {
    await db.query(db.format("UPDATE users SET password = ? WHERE uid = ?", [newPassword, uid]));
  } catch (error) {
    console.error("Error updating password:", error);
    throw error;
  }
}

export async function isEmailInUse(email: string): Promise<boolean> {
  try {
    const result = await db.query(db.format("SELECT COUNT(*) as count FROM users WHERE email = ?", [email]));

    const count = result[0] as RowDataPacket[];
    return count[0].count;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

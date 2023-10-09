import db from "./index.js";
import { RowDataPacket } from "mysql2/promise";
interface StatusesData {
  statuses: RowDataPacket[];
}

export async function getStatistics(decoded: any): Promise<StatusesData> {
  try {
    const [dataResult] = await db.query<RowDataPacket[]>(
      db.format(
        `SELECT status FROM tasks 
            WHERE uid = ?`,
        [decoded.uid],
      ),
    );

    const statuses = dataResult;

    return { statuses };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

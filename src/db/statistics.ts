import db from "./index.js";
import { RowDataPacket } from "mysql2/promise";
interface StatusesData {
  statuses: RowDataPacket[];
  dataCount: RowDataPacket[];
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
    const [dataCount] = await db.query<RowDataPacket[]>(
      db.format(
        `   SELECT
        CAST(SUM(CASE WHEN status = 'todo' THEN 1 ELSE 0 END) AS SIGNED) AS todo_count,
        CAST(SUM(CASE WHEN status = 'in progress' THEN 1 ELSE 0 END) AS SIGNED) AS in_progress_count,
        CAST(SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS SIGNED) AS done_count
    FROM tasks where uid  = ?;`,
        [decoded.uid],
      ),
    );

    console.log(dataCount);

    const statuses = dataResult;

    return { statuses, dataCount };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

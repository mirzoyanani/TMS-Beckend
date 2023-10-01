import db from "./index.js";
import { RowDataPacket } from "mysql2/promise";

export async function insertTask(decoded: any, payload: any): Promise<string> {
  try {
    await db.query("INSERT INTO tasks (uid, title, description, end_date) VALUES (?, ?, ?, ?)", [
      decoded.uid,
      payload.title,
      payload.description,
      payload.end_date,
    ]);

    return "Task inserted successfully";
  } catch (error) {
    console.log(error);

    throw error;
  }
}
interface TaskData {
  tasks: RowDataPacket[];
  totalCount: number;
}

export async function getTasks(decoded: any, pageNumber: number, pageSize: number): Promise<TaskData> {
  try {
    const offset = (pageNumber - 1) * pageSize;

    const [dataResult] = await db.query<RowDataPacket[]>(
      db.format(
        `SELECT * FROM tasks 
          WHERE uid = ?
          ORDER BY start_date ASC 
          LIMIT ? OFFSET ?`,
        [decoded.uid, pageSize, offset],
      ),
    );

    const [totalCountResult]: any = await db.query(
      db.format(
        `SELECT COUNT(*) as count
          FROM tasks
          WHERE uid = ?`,
        [decoded.uid],
      ),
    );

    const tasks = dataResult;
    const totalCount = totalCountResult[0].count;

    return { tasks, totalCount };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function deleteTask(taskId: number): Promise<string> {
  try {
    await db.query("DELETE FROM tasks WHERE id = ?", [taskId]);
    return "Task deleted successfully";
  } catch (error) {
    console.log(error);

    throw error;
  }
}

export async function updateTask(
  title: string,
  description: string,
  end_date: string,
  taskId: number,
): Promise<string> {
  try {
    await db.query("UPDATE tasks SET title = ?, description = ?, end_date = ? WHERE id = ?", [
      title,
      description,
      end_date,
      taskId,
    ]);
    return "Task deleted successfully";
  } catch (error) {
    console.log(error);
    throw error;
  }
}
export async function updateTaskStatus(status: "todo" | "in progres" | "done", id: number) {
  try {
    await db.query("UPDATE tasks SET  status = ? WHERE id = ?", [status, id]);
    return `Task status updated to ${status} successfully`;
  } catch (error) {
    console.log(error);
  }
}

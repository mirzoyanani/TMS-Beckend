import db from "./index.js";
import { RowDataPacket } from "mysql2/promise";
type TaskStatus = "todo" | "in progress" | "done";
import { TaskCreationDTO } from "../lib/index.js";

export async function insertTask(uid: string, payload: TaskCreationDTO): Promise<string> {
  try {
    await db.query("INSERT INTO tasks (uid, title, description, end_date) VALUES (?, ?, ?, ?)", [
      uid,
      payload.title,
      payload.description,
      payload.end_date,
    ]);

    return "Task inserted successfully";
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
interface TaskData {
  tasks: RowDataPacket[];
  totalCount: number;
}

export async function getTasks(uid: string, pageNumber: number, pageSize: number): Promise<TaskData> {
  try {
    const offset = (pageNumber - 1) * pageSize;

    const [dataResult] = await db.query<RowDataPacket[]>(
      db.format(
        `SELECT  id,
        title,
        description,
        status,
        creation_date,
        end_date FROM tasks 
          WHERE uid = ?
          ORDER BY creation_date DESC
          LIMIT ? OFFSET ?`,
        [uid, pageSize, offset],
      ),
    );

    const [totalCountResult] = await db.query<RowDataPacket[]>(
      db.format(
        `SELECT COUNT(*) as count
          FROM tasks
          WHERE uid = ?`,
        [uid],
      ),
    );

    const tasks = dataResult;
    const totalCount = totalCountResult[0].count;

    return { tasks, totalCount };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
export async function deleteTask(taskId: number): Promise<string> {
  try {
    await db.query("DELETE FROM tasks WHERE id = ?", [taskId]);
    return "Task deleted successfully";
  } catch (error) {
    throw new Error((error as Error).message);
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
    throw new Error((error as Error).message);
  }
}
export async function updateTaskStatus(status: TaskStatus, id: number) {
  try {
    await db.query("UPDATE tasks SET  status = ? WHERE id = ?", [status, id]);
    return `Task status updated to ${status} successfully`;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function filterTasksbyStatus(
  uid: string,
  pageNumber: number,
  pageSize: number,
  status: string,
): Promise<TaskData> {
  try {
    const offset = (pageNumber - 1) * pageSize;
    const [dataResult] = await db.query<RowDataPacket[]>(
      db.format(
        `SELECT * FROM tasks 
                WHERE uid = ? AND status = ?
                ORDER BY creation_date DESC
                LIMIT ? OFFSET ?`,
        [uid, status, pageSize, offset],
      ),
    );

    const [totalCountResult] = await db.query<RowDataPacket[]>(
      db.format(
        `SELECT COUNT(*) as count
                FROM tasks
                WHERE uid = ? AND status = ?`,
        [uid, status],
      ),
    );

    const tasks = dataResult;
    const totalCount = totalCountResult[0].count;

    return { tasks, totalCount };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function filterTasksbyDate(
  uid: string,
  pageNumber: number,
  pageSize: number,
  date: "creation_date" | "end_date",
): Promise<TaskData | undefined> {
  try {
    const offset = (pageNumber - 1) * pageSize;
    if (date == "creation_date") {
      const [dataResult] = await db.query<RowDataPacket[]>(
        db.format(
          `SELECT * FROM tasks 
                        WHERE uid = ? 
                        ORDER BY creation_date ASC 
                        LIMIT ? OFFSET ?`,
          [uid, pageSize, offset],
        ),
      );

      const [totalCountResult] = await db.query<RowDataPacket[]>(
        db.format(
          `SELECT COUNT(*) as count
                        FROM tasks
                        WHERE uid = ? `,
          [uid],
        ),
      );

      const tasks = dataResult;
      const totalCount = totalCountResult[0].count;
      return { tasks, totalCount };
    } else if (date == "end_date") {
      const [dataResult] = await db.query<RowDataPacket[]>(
        db.format(
          `SELECT * FROM tasks 
                        WHERE uid = ? 
                        ORDER BY end_date DESC 
                        LIMIT ? OFFSET ?`,
          [uid, pageSize, offset],
        ),
      );

      const [totalCountResult] = await db.query<RowDataPacket[]>(
        db.format(
          `SELECT COUNT(*) as count
                        FROM tasks
                        WHERE uid = ?`,
          [uid],
        ),
      );

      const tasks = dataResult;
      const totalCount = totalCountResult[0].count;
      return { tasks, totalCount };
    }
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
export async function getTasksByTitle(
  uid: string,
  pageNumber: number,
  pageSize: number,
  title: string,
): Promise<TaskData> {
  const offset = (pageNumber - 1) * pageSize;
  try {
    const [dataResult] = await db.query<RowDataPacket[]>(
      db.format(
        `SELECT * FROM tasks 
         WHERE uid = ? AND title LIKE ?
         ORDER BY creation_date DESC
         LIMIT ? OFFSET ?`,
        [uid, `%${title}%`, pageSize, offset],
      ),
    );
    const [totalCountResult] = await db.query<RowDataPacket[]>(
      db.format(
        `SELECT COUNT(*) as count
                      FROM tasks
                      WHERE uid = ? AND  title LIKE ? `,
        [uid, `%${title}%`],
      ),
    );
    const tasks = dataResult;
    const totalCount = totalCountResult[0].count;
    return { tasks, totalCount };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

interface Task {
  email: string;
  title: string;
  end_date: string;
}

export async function getAllTasks(): Promise<Task[]> {
  try {
    const [dataResult] = await db.query<RowDataPacket[]>(
      `SELECT users.email, tasks.title, tasks.end_date
      FROM users
      JOIN tasks ON users.uid = tasks.uid;`,
    );

    const tasks: Task[] = dataResult.map((row) => ({
      email: row.email,
      title: row.title,
      end_date: row.end_date,
    }));
    return tasks;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function filterTasksbyDateController(
  uid: string,
  pageNumber: number,
  pageSize: number,
  status: string,
  searchValue: string,
  orderBy: string,
): Promise<TaskData> {
  try {
    const offset = (pageNumber - 1) * pageSize;
    let query = "SELECT * FROM tasks WHERE uid = ?";
    const queryParams: (string | number)[] = [uid];

    if (status) {
      query += " AND status = ?";
      queryParams.push(status);
    } else if (searchValue) {
      query += " AND title LIKE ?";
      queryParams.push(`%${searchValue}%`);
    }
    query += " ORDER BY creation_date " + orderBy;
    query += " LIMIT ? OFFSET ?";

    queryParams.push(pageSize, offset);

    const [dataResult] = await db.query<RowDataPacket[]>(db.format(query, queryParams));

    const [totalCountResult] = await db.query<RowDataPacket[]>(
      db.format("SELECT COUNT(*) as count FROM tasks WHERE uid = ?", [uid]),
    );

    const tasks = dataResult;
    const totalCount: number = totalCountResult[0].count;

    return { tasks, totalCount };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

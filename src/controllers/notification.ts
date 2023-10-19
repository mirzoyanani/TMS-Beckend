import { sendEmail } from "../lib/index.js";
import schedule from "node-schedule";
import { format } from "date-fns";
import { getAllTasks } from "../db/task.js";

interface Task {
  email: string;
  title: string;
  end_date: string;
}
const scheduleTaskEmailNotifications = (tasks: Task[]): void => {
  tasks.forEach((task) => {
    const taskEndDate = new Date(task.end_date);
    const oneHourBeforeEndDate = format(new Date(taskEndDate.getTime() - 60 * 60 * 1000), "yyyy-MM-dd HH:mm:ss");

    schedule.scheduleJob(oneHourBeforeEndDate, () => {
      sendEmail(task.email, `Task Reminder: ${task.title}`, `Your task "${task.title}" is ending soon.`);
    });
  });
};

export async function SendMessages() {
  try {
    const tasks = await getAllTasks();
    scheduleTaskEmailNotifications(tasks);
    schedule.scheduleJob("* * * * *", async () => {
      const updatedTasks = await getAllTasks();
      scheduleTaskEmailNotifications(updatedTasks);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

import { sendEmail } from "../lib/index.js";
import schedule from "node-schedule";
import { format } from "date-fns";

interface Task {
  email: string;
  title: string;
  end_date: string;
}
export const scheduleTaskEmailNotifications = (tasks: Task[]): void => {
  tasks.forEach((task) => {
    const taskEndDate = new Date(task.end_date);
    const oneHourBeforeEndDate = format(new Date(taskEndDate.getTime() - 60 * 60 * 1000), "yyyy-MM-dd HH:mm:ss");

    schedule.scheduleJob(oneHourBeforeEndDate, () => {
      console.log("Scheduled job executed for task:", task.title);
      sendEmail(task.email, `Task Reminder: ${task.title}`, `Your task "${task.title}" is ending soon.`);
    });
  });
};

import bcrypt from "bcrypt";
import nodemailer, { Transporter } from "nodemailer";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2/promise";

export interface ResponseTemplate {
  meta: {
    error: {
      code: number | null;
      message: string | null;
    } | null;
    status: number;
  };
  data: Record<string, unknown>;
}

export function getResponseTemplate(): ResponseTemplate {
  return {
    meta: {
      error: null,
      status: 200,
    },
    data: {},
  };
}

export async function hashingString(password: string): Promise<string> {
  try {
    const hashSalt: string = await bcrypt.genSalt(10);
    const hashedStr: string = await bcrypt.hash(password + "", hashSalt);
    return hashedStr;
  } catch (err) {
    throw {
      errCode: 500,
      message: err || "Հեշավորումը ավարտվեց անհաջողությամբ",
    };
  }
}

interface MailConfig {
  email: string;
  emailPassword: string;
}

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  text: string;
}
export interface CorsOptions {
  origin: string;
  credentials: boolean;
}
interface TaskData {
  tasks: RowDataPacket[];
  totalCount: number;
}

export interface UserInfoDTO {
  uid?: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  telephone: string;
  profilePicture?: string;
}

export interface TaskCreationDTO {
  title: string;
  description: string;
  end_date: string;
}

export async function sendEmail(email: string, subject: string, content: number | string): Promise<void> {
  const mailConfig: MailConfig = {
    email: process.env.MY_GOOGLE_MAIL_NAME || "",
    emailPassword: process.env.MY_GOOGLE_MAIL_PASSWORD || "",
  };

  const transporter: Transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: mailConfig.email,
      pass: mailConfig.emailPassword,
    },
  });

  const mailOptions: MailOptions = {
    from: mailConfig.email,
    to: email,
    subject,
    text: content + " ",
  };

  await transporter.sendMail(mailOptions);
}

export interface CustomRequest<TBody = unknown, TParams = unknown> extends Request<TParams, any, TBody> {
  decoded?:
    | {
        code?: string;
        uid: string;
      }
    | undefined;
}

export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneNumberPattern: RegExp = /^\+374 \d{8}$/;
  return phoneNumberPattern.test(phoneNumber);
};

export function returnResult(result: ResponseTemplate, data: TaskData, page: number, pageSize: number) {
  result.data.items = data.tasks;
  result.data.pagination = {
    currentPage: page,
    totalPages: Math.ceil(data.totalCount / pageSize),
    totalCount: data.totalCount,
    pageSize: pageSize,
  };
}

export function verifyToken<T extends object = any>(token: string, _secret?: string): T {
  const secret = _secret ?? (process.env.SECRET_KEY as string);
  return jwt.verify(token, secret) as T;
}

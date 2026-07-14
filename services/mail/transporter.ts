import nodemailer from "nodemailer"
import type SMTPTransport from "nodemailer/lib/smtp-transport"

export function assertGmailEnv() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("Configuración de Gmail incompleta (GMAIL_USER / GMAIL_APP_PASSWORD)")
  }
}

export function createMailTransporter() {
  assertGmailEnv()

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  } satisfies SMTPTransport.Options)
}

export function getMailFrom(): string {
  assertGmailEnv()
  return process.env.GMAIL_USER as string
}

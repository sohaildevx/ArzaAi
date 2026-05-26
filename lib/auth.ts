import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "@/lib/db";
import { Resend } from "resend";
import {ForgotPasswordEmail} from "@/components/form/forgortPasswordTemplate";

const resend = new Resend(process.env.RESEND_API_KEY!);
const userEmail = process.env.USER_EMAIL!;

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: userEmail,
        to: user.email,
        subject: "Reset your password for ArzaAI",
        react: ForgotPasswordEmail({ userEmail: user.email, resetPasswordUrl: url }), 
      });
    },
  },
});

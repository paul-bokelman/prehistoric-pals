import { User as PrismaUser } from "@prisma/client";
import "express-session";

declare global {
  namespace Express {
    interface User extends PrismaUser {}
  }
}

declare module "express-session" {
  export interface SessionData {
    user: PrismaUser;
  }
}

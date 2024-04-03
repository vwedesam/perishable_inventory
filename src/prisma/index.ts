import { PrismaClient } from "@prisma/client";
import { env } from "../config";

let prisma: PrismaClient;

const config = {
  datasources: {
    db: {
      url: env.DATABASE_URL,
    },
    
  },
};

if (env.NODE_ENV === "production") {
  prisma = new PrismaClient(config);
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient(config);
  }
  prisma = global.prisma;
}

export default prisma;

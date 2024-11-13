import { type Config } from "drizzle-kit";

import { env } from "./src/env";

export default {
  schema: "./src/app/server/db/schema.ts",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
  dialect: 'postgresql',
  tablesFilter: ["factura_*"],
  out: './src/app/server/db/migrations',
} satisfies Config;

import { type Config } from "drizzle-kit";

import { env } from "~/env";

export default {
  schema: "./src/server/db/schema.ts",
  dbCredentials: {
    url: env.POSTGRES_URL,
  },
  dialect: 'postgresql',
  tablesFilter: ["factura_*"],
  out: './drizzle/migrations',
} satisfies Config;

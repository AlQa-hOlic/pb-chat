import * as z from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["production", "staging", "local"]).default("local"),
  PORT: z.number({ coerce: true }).default(8081),
  REDIS_URL: z.string().default("redis://localhost:6379"),
});

export default envSchema.parse(process.env);

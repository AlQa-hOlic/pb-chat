import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import config from "./config";
import { logger } from "./logger";

async function getSocketIORedisAdapter() {
  const pubClient = createClient({ url: config.REDIS_URL });
  const subClient = pubClient.duplicate();

  await pubClient.connect();
  await subClient.connect();

  return createAdapter(pubClient, subClient);
}

export async function createSocketServer() {
  const io = new Server({});

  io.on("connection", (socket) => {
    socket.on("message", (message) => {
      logger.info(`Message from ${socket.id}: ${message}`);
    });
  });

  // Add redis adapter to sync between multiple socket.io nodes
  try {
    io.adapter(await getSocketIORedisAdapter());
  } catch (error) {
    logger.error("Could not add socket.io redis adapter", { error });
  }

  return io;
}

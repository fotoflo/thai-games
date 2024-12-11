import { queue } from "@dayone-labs/lambda-queue-serverless";

export const welcomeQueue = queue(
  "/welcome-queue",
  async (job: { name: string }) => {
    return { message: `Hello, ${job.name}` };
  }
);

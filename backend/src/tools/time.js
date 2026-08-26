import { tool } from "@langchain/core/tools";
import { z } from "zod";

export const timeTool = tool(
  async ({ timezone }) => {
    try {
      return new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        dateStyle: "full",
        timeStyle: "long"
      }).format(new Date());
    } catch {
      return `Invalid timezone: ${timezone}`;
    }
  },
  {
    name: "get_time",
    description:
      "Get the current date and time for a specific IANA timezone, such as Asia/Tokyo.",
    schema: z.object({
      timezone: z.string()
    })
  }
);

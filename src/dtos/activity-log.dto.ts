import { ActionTypeEnum } from "@/lib/types/enums/actiontype.enum";
import z from "zod";

export const ActivityLogResponse = z.object({
  id: z.number().min(1),
  userId: z.number().min(1),
  actionDescription: z.string().min(2).max(1000),
  actionType: z.enum(ActionTypeEnum),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type ActivityLogResponseType = z.infer<typeof ActivityLogResponse>;

import type { Auth } from "~/auth/lucia";

export type LuciaSession = {
  created_at: string;
  user: ReturnType<Auth["getUserAttributes"]> & { userId: string };
  sessionId: string;
  activePeriodExpiresAt: Date;
  idlePeriodExpiresAt: Date;
  state: "active" | "idle" | "dead";
  fresh: boolean;
};

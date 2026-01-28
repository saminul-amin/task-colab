export const MESSAGE_TYPE = {
  TEXT: "text",
  FILE: "file",
  SYSTEM: "system",
} as const;

export type TMessageType = (typeof MESSAGE_TYPE)[keyof typeof MESSAGE_TYPE];

const DEFAULT_STUDYHUB_URL = "https://studyhub.dcism.org";

export const STUDYHUB_URL = (
  process.env.NEXT_PUBLIC_STUDYHUB_URL || DEFAULT_STUDYHUB_URL
).replace(/\/+$/, "");

interface StudyHubTraceOptions {
  problemId: number;
  title: string;
  code: string;
  input?: string;
  expected?: string;
}

// base64url (RFC 4648 §5) of the UTF-8 bytes of the JSON payload, no padding.
const encodePayload = (payload: object): string => {
  const bytes = new TextEncoder().encode(JSON.stringify(payload));
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

export const studyHubTraceUrl = ({
  problemId,
  title,
  code,
  input,
  expected,
}: StudyHubTraceOptions): string => {
  const payload = {
    v: 1,
    kind: "trace",
    problemId,
    title,
    code,
    ...(input !== undefined && { input }),
    ...(expected !== undefined && { expected }),
  };
  return `${STUDYHUB_URL}/tracer#ciscode=${encodePayload(payload)}`;
};

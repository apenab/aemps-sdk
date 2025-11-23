import { AempsClient } from "aemps-sdk";

export function createClient(baseUrl?: string) {
  return new AempsClient({ baseUrl });
}

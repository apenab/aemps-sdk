import { Command } from "commander";

export function getBaseUrl(program: Command): string | undefined {
  return program.opts<{ baseUrl?: string }>().baseUrl;
}

export async function withErrorHandling(fn: () => Promise<void>) {
  try {
    await fn();
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
      const body = (error as Error & { body?: unknown }).body;
      if (body) {
        console.error("Error response body:");
        printJson(body);
      }
    } else {
      console.error(error);
    }
    process.exitCode = 1;
  }
}

export function printJson(data: unknown) {
  console.log(JSON.stringify(data, null, 2));
}

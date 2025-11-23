import { describe, expect, it, vi } from "vitest";
import { AempsClient } from "../src";
import { createJsonResponse } from "./helpers";

const baseUrl = "https://example.test/api";

function toUrlString(input: Parameters<typeof fetch>[0]): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

describe("PsuministroApi.getProblemasSuministroByCN", () => {
  it("builds GET /psuministro/{cn}", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => createJsonResponse({ cn: "12345" }, 200));
    const client = new AempsClient({ baseUrl, fetchFn: fetchMock });

    await client.psuministro.getProblemasSuministroByCN("12345");

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(init?.method).toBe("GET");

    const parsed = new URL(toUrlString(url));
    expect(parsed.pathname).toBe("/api/psuministro/12345");
    expect(parsed.search).toBe("");
  });
});

describe("PsuministroApi.listProblemasSuministro", () => {
  it("builds GET /psuministro with optional query", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => createJsonResponse({ resultados: [] }, 200));
    const client = new AempsClient({ baseUrl, fetchFn: fetchMock });

    await client.psuministro.listProblemasSuministro({ pagina: 2 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(init?.method).toBe("GET");

    const parsed = new URL(toUrlString(url));
    expect(parsed.pathname).toBe("/api/psuministro");
    expect(parsed.searchParams.get("pagina")).toBe("2");
  });
});

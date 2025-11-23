import { describe, expect, it, vi } from "vitest";
import { AempsClient } from "../src";
import { createJsonResponse } from "./helpers";

const baseUrl = "https://example.test/api";

describe("MedicamentosApi.searchMedicamentos", () => {
  it("builds GET /medicamentos with query params", async () => {
    const fetchMock = vi.fn<typeof fetch>(async () => createJsonResponse({ items: [] }, 200));
    const client = new AempsClient({ baseUrl, fetchFn: fetchMock });

    await client.medicamentos.searchMedicamentos({
      nombre: "ibuprofeno",
      pagina: 2,
      triangulo: true
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(init?.method).toBe("GET");

    const parsed = new URL(toUrlString(url));
    expect(parsed.pathname).toBe("/api/medicamentos");
    expect(parsed.searchParams.get("nombre")).toBe("ibuprofeno");
    expect(parsed.searchParams.get("pagina")).toBe("2");
    expect(parsed.searchParams.get("triangulo")).toBe("true");
  });

  it("throws on non-OK responses and surfaces the body", async () => {
    const errorBody = { message: "fail" };
    const fetchMock = vi.fn<typeof fetch>(async () => createJsonResponse(errorBody, 500));
    const client = new AempsClient({ baseUrl, fetchFn: fetchMock });

    await expect(client.medicamentos.searchMedicamentos()).rejects.toMatchObject({
      message: "CIMA request failed with status 500",
      body: errorBody
    });
  });
});

function toUrlString(input: Parameters<typeof fetch>[0]): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

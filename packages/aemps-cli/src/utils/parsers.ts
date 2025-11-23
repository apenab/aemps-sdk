import { SearchMedicamentosParams } from "aemps-sdk";

export function buildMedicamentosParams(opts: Record<string, unknown>): SearchMedicamentosParams {
  const params: SearchMedicamentosParams = {};
  const booleanKeys = ["triangulo", "huerfano", "biosimilar", "comerc", "autorizados", "receta"];
  const numericKeys = ["npactiv", "pagina"];

  for (const [key, value] of Object.entries(opts)) {
    if (value === undefined) continue;
    if (booleanKeys.includes(key)) {
      params[key as keyof SearchMedicamentosParams] = parseBool(value) as any;
      continue;
    }
    if (numericKeys.includes(key)) {
      const n = typeof value === "number" ? value : Number(value);
      if (!Number.isNaN(n)) {
        params[key as keyof SearchMedicamentosParams] = n as any;
      }
      continue;
    }
    params[key as keyof SearchMedicamentosParams] = value as any;
  }

  return params;
}

function parseBool(value: unknown): boolean | undefined {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["1", "true", "yes", "y"].includes(normalized)) return true;
    if (["0", "false", "no", "n"].includes(normalized)) return false;
  }
  return undefined;
}

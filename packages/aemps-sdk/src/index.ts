import { HttpClient } from "./core/httpClient";
import { MedicamentosApi } from "./modules/medicamentos";
import { ClientConfig } from "./types/common";

export class AempsClient {
  readonly medicamentos: MedicamentosApi;

  constructor(config: ClientConfig = {}) {
    const http = new HttpClient(config);
    this.medicamentos = new MedicamentosApi(http);
  }
}

// Backwards-friendly alias for consumers using the previous name.
export const CimaClient = AempsClient;

// Re-exports
export * from "./types/common";
export * from "./types/medicamentos";

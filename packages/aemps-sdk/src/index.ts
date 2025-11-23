import { HttpClient } from "./core/httpClient";
import { MedicamentosApi } from "./modules/medicamentos";
import { PsuministroApi } from "./modules/psuministro";
import { ClientConfig } from "./types/common";

export class AempsClient {
  readonly medicamentos: MedicamentosApi;
  readonly psuministro: PsuministroApi;

  constructor(config: ClientConfig = {}) {
    const http = new HttpClient(config);
    this.medicamentos = new MedicamentosApi(http);
    this.psuministro = new PsuministroApi(http);
  }
}

// Backwards-friendly alias for consumers using the previous name.
export const CimaClient = AempsClient;

// Re-exports
export * from "./types/common";
export * from "./types/medicamentos";
export * from "./types/psuministro";

import { HttpClient } from "../core/httpClient";
import { RequestOptions } from "../types/common";
import {
  GetMedicamentoByNregistroParams,
  SearchMedicamentosParams
} from "../types/medicamentos";

export class MedicamentosApi {
  constructor(private readonly http: HttpClient) {}

  /**
   * GET /medicamentos?{condiciones}
   * Search for medicines using the API filters (name, ATC, CN, nregistro, etc.).
   */
  async searchMedicamentos<T = unknown>(
    params: SearchMedicamentosParams = {},
    options: RequestOptions = {}
  ): Promise<T> {
    return this.http.get<T>("medicamentos", params, options);
  }

  /**
   * GET /medicamento?nregistro={nregistro}
   * Fetch a single medicine by its registration number.
   */
  async getMedicamentoByNregistro<T = unknown>(
    nregistro: string | number,
    options: RequestOptions = {}
  ): Promise<T> {
    const params: GetMedicamentoByNregistroParams = { nregistro };
    return this.http.get<T>("medicamento", params, options);
  }
}

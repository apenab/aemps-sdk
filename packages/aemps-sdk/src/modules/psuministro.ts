import { HttpClient } from "../core/httpClient";
import { RequestOptions } from "../types/common";
import {
  GetProblemasSuministroByCNParams,
  ListProblemasSuministroParams
} from "../types/psuministro";

export class PsuministroApi {
  constructor(private readonly http: HttpClient) {}

  /**
   * GET /psuministro?{condiciones}
   * List current supply problems, optionally paginated.
   */
  async listProblemasSuministro<T = unknown>(
    params: ListProblemasSuministroParams = {},
    options: RequestOptions = {}
  ): Promise<T> {
    return this.http.get<T>("psuministro", params, options);
  }

  /**
   * GET /psuministro/{codNacional}
   * Returns supply problems for a given Código Nacional.
   */
  async getProblemasSuministroByCN<T = unknown>(
    cn: string | number,
    options: RequestOptions = {}
  ): Promise<T> {
    const params: GetProblemasSuministroByCNParams = { cn };
    return this.http.get<T>(`psuministro/${params.cn}`, undefined, options);
  }
}

import { QueryParams } from "./common";

export type SearchMedicamentosParams = QueryParams & {
  nombre?: string;
  laboratorio?: string;
  practiv1?: string;
  practiv2?: string;
  idpractiv1?: string | number;
  idpractiv2?: string | number;
  cn?: string | number;
  atc?: string;
  nregistro?: string | number;
  npactiv?: string | number;
  triangulo?: 0 | 1 | boolean;
  huerfano?: 0 | 1 | boolean;
  biosimilar?: 0 | 1 | boolean;
  sust?: string | number;
  vmp?: string | number;
  comerc?: 0 | 1 | boolean;
  autorizados?: 0 | 1 | boolean;
  receta?: 0 | 1 | boolean;
  pagina?: number;
};

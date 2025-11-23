export interface GetProblemasSuministroByCNParams {
  cn: string | number;
}

export type ListProblemasSuministroParams = Record<string, string | number | boolean | undefined> & {
  pagina?: number;
};

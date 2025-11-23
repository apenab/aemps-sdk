import { Command } from "commander";
import { createClient } from "../utils/client";
import { getBaseUrl, printJson, withErrorHandling } from "../utils/output";

export function registerMedicamentoCommand(program: Command) {
  program
    .command("medicamento <nregistro>")
    .description("Get a medicine by registration number (GET /medicamento?nregistro=...)")
    .action(async (nregistro: string, command) => {
      const baseUrl = getBaseUrl(command.parent as Command);
      const client = createClient(baseUrl);

      await withErrorHandling(async () => {
        const result = await client.medicamentos.getMedicamentoByNregistro(nregistro);
        if (result == null) {
          console.log("No content returned (204). Try a different nregistro.");
        } else {
          printJson(result);
        }
      });
    });
}

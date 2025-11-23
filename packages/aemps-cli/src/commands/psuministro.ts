import { Command } from "commander";
import { createClient } from "../utils/client";
import { getBaseUrl, printJson, withErrorHandling } from "../utils/output";

export function registerPsuministroCommand(program: Command) {
  program
    .command("psuministro <cn>")
    .description("Get supply problems by Código Nacional (GET /psuministro/{cn})")
    .action(async (cn: string, command) => {
      const baseUrl = getBaseUrl(command.parent);
      const client = createClient(baseUrl);

      await withErrorHandling(async () => {
        const result = await client.psuministro.getProblemasSuministroByCN(cn);
        if (result == null) {
          console.log("No content returned (204). Try a different CN.");
        } else {
          printJson(result);
        }
      });
    });
}

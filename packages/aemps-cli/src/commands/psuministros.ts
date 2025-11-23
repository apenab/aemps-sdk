import { Command } from "commander";
import { createClient } from "../utils/client";
import { getBaseUrl, printJson, withErrorHandling } from "../utils/output";

export function registerPsuministrosCommand(program: Command) {
  program
    .command("psuministros")
    .description("List supply problems (GET /psuministro)")
    .option("--pagina <num>", "Page number for pagination", parseInt)
    .action(async (opts, command) => {
      const baseUrl = getBaseUrl(command.parent);
      const client = createClient(baseUrl);

      await withErrorHandling(async () => {
        const result = await client.psuministro.listProblemasSuministro({
          pagina: typeof opts.pagina === "number" ? opts.pagina : undefined
        });
        if (result == null) {
          console.log("No content returned (204).");
        } else {
          printJson(result);
        }
      });
    });
}

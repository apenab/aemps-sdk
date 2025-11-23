import { Command } from "commander";
import { createClient } from "../utils/client";
import { getBaseUrl, printJson, withErrorHandling } from "../utils/output";
import { buildMedicamentosParams } from "../utils/parsers";

type OptType = "string" | "number" | "boolean";

const optionDefs: Array<{ flag: string; description: string; type?: OptType }> = [
  { flag: "--nombre <text>", description: "Medicine name filter" },
  { flag: "--laboratorio <text>", description: "Laboratory name filter" },
  { flag: "--practiv1 <text>", description: "Active ingredient name (primary)" },
  { flag: "--practiv2 <text>", description: "Active ingredient name (secondary)" },
  { flag: "--idpractiv1 <id>", description: "Active ingredient ID (primary)" },
  { flag: "--idpractiv2 <id>", description: "Active ingredient ID (secondary)" },
  { flag: "--cn <code>", description: "Código Nacional" },
  { flag: "--atc <code>", description: "ATC code or description" },
  { flag: "--nregistro <code>", description: "Registration number" },
  { flag: "--npactiv <num>", description: "Number of active ingredients", type: "number" },
  { flag: "--triangulo <0|1|bool>", description: "Triangle flag", type: "boolean" },
  { flag: "--huerfano <0|1|bool>", description: "Orphan drug flag", type: "boolean" },
  { flag: "--biosimilar <0|1|bool>", description: "Biosimilar flag", type: "boolean" },
  { flag: "--sust <code>", description: "Substitution code" },
  { flag: "--vmp <id>", description: "VMP code" },
  { flag: "--comerc <0|1|bool>", description: "Commercialized flag", type: "boolean" },
  { flag: "--autorizados <0|1|bool>", description: "Authorized flag", type: "boolean" },
  { flag: "--receta <0|1|bool>", description: "Prescription required flag", type: "boolean" },
  { flag: "--pagina <num>", description: "Page number for pagination", type: "number" }
];

export function registerMedicamentosCommand(program: Command) {
  const cmd = program.command("medicamentos").description("Search medicines (GET /medicamentos)");
  optionDefs.forEach(({ flag, description, type }) => {
    if (type === "number") {
      cmd.option(flag, description, parseInt);
    } else {
      cmd.option(flag, description);
    }
  });

  cmd.action(async (opts, command) => {
    const baseUrl = getBaseUrl(command.parent as Command);
    const client = createClient(baseUrl);
    const params = buildMedicamentosParams(opts);

    await withErrorHandling(async () => {
      const result = await client.medicamentos.searchMedicamentos(params);
      printJson(result);
    });
  });
}

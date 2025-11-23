#!/usr/bin/env node
import { Command } from "commander";
import { registerMedicamentoCommand } from "./commands/medicamento";
import { registerMedicamentosCommand } from "./commands/medicamentos";

const program = new Command();

program
  .name("aemps-cli")
  .description("CLI to exercise the AEMPS CIMA SDK")
  .version("0.1.0")
  .option("--base-url <url>", "Override CIMA base URL", "https://cima.aemps.es/cima/rest");

registerMedicamentosCommand(program);
registerMedicamentoCommand(program);

// pnpm run forwards a leading "--" as a literal arg; strip it so commander
// keeps parsing commands normally.
const argv = process.argv[2] === "--" ? [process.argv[0], process.argv[1], ...process.argv.slice(3)] : process.argv;

program.parseAsync(argv).catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});

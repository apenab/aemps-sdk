# AEMPS-SDK

TypeScript SDK for the **AEMPS CIMA REST API** – Spanish medicines data.

This README also works as a **roadmap** and **tracking board** of all the SDK methods mapped to official CIMA endpoints.

---

## Goals

- Provide a **typed, ergonomic** client for the CIMA REST API.
- Use **English** for documentation and verbs, but keep the **core medical/domain nouns in Spanish**  
  (`Medicamento`, `Presentacion`, `psuministro`, etc.) to stay close to the official AEMPS terminology.
- Offer **high-level methods** that hide low-level URL building and query parameters.

---

## Naming conventions

- **Client name:** `AempsClient`
- **Verbs:** English → `get*`, `search*`, `list*`.
- **Domain nouns:** Spanish (aligned with AEMPS / CIMA docs):

  - `Medicamento`, `Medicamentos`
  - `Presentacion`, `Presentaciones`
  - `ProblemaSuministro` / `psuministro`
  - `Vmpp`
  - `Notas`, `Materiales`
  - `DocSegmentado`
  - `Maestras`
  - `RegistroCambios`

Example pattern:

- HTTP: `GET /medicamentos?{condiciones}`
- SDK: `searchMedicamentos(conditions)`

---

## SDK quickstart

```ts
import { CimaClient } from "aemps-sdk";

const client = new CimaClient();

async function run() {
  const result = await client.medicamentos.searchMedicamentos({
    nombre: "ibuprofeno",
    pagina: 1,
  });
  console.log(result);
}

run().catch(console.error);
```

## Method status legend

We track each method with an icon:

- ✅ **Done** – implemented and tested.
- 🔧 **WIP / Planned** – work in progress or not started yet.

- 🤖 **AI / MCP critical** – methods that are important to expose for Model Context Protocol (MCP) and AI assistants. These should be available, consistently typed and return JSON-friendly payloads to be consumable by LLMs and other AI tooling.

You can replace the icons as the implementation progresses.

---

## 1. Medicamentos (search & detail)

**Core search and detail for medicines.**

| Status | Method                                 | Endpoint                                 | Description                                                                        |
| ------ | -------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------- |
| ✅ 🤖  | `searchMedicamentos(conditions)`       | `GET /medicamentos?{condiciones}`        | Search `Medicamentos` using filters such as `nombre`, `cn`, `practiv`, `atc`, etc. |
| ✅ 🤖  | `getMedicamentoByNregistro(nregistro)` | `GET /medicamento?nregistro={nregistro}` | Get a single `Medicamento` by its registration number.                             |
| 🔧     | `getMedicamentoByCN(cn)`               | `GET /medicamento?cn={cn}`               | Get a single `Medicamento` by Código Nacional.                                     |
| 🔧     | `searchInFichaTecnica(filters)`        | `POST /buscarEnFichaTecnica`             | Search inside the SmPC (“Ficha Técnica”) using structured filters.                 |

---

## 2. Presentaciones

**Search and detail for presentations (Presentaciones).**

| Status | Method                             | Endpoint                            | Description                                                            |
| ------ | ---------------------------------- | ----------------------------------- | ---------------------------------------------------------------------- |
| 🔧     | `searchPresentaciones(conditions)` | `GET /presentaciones?{condiciones}` | List `Presentacion` objects filtered by CN, `nregistro`, `forma`, etc. |
| 🔧 ⭐  | `getPresentacionByCN(cn)`          | `GET /presentacion/{codNacional}`   | Get one `Presentacion` by Código Nacional.                             |

---

## 3. Problemas de suministro (psuministro)

**Supply problems for medicines.**

| Status | Method                                 | Endpoint                         | Description                                                             |
| ------ | -------------------------------------- | -------------------------------- | ----------------------------------------------------------------------- |
| ✅     | `listProblemasSuministro(conditions?)` | `GET /psuministro?{condiciones}` | List current supply problems, optionally filtered (e.g. by date, type). |
| ✅ 🤖  | `getProblemasSuministroByCN(cn)`       | `GET /psuministro/{codNacional}` | Get supply problem information for a specific Código Nacional.          |

---

## 4. Descripción clínica / VMP–VMPP (vmpp)

**Clinical description / VMP–VMPP-related information.**

| Status | Method                   | Endpoint                  | Description                                                                                      |
| ------ | ------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------ |
| 🔧     | `searchVmpp(conditions)` | `GET /vmpp?{condiciones}` | Search VMP/VMPP based on clinical description: `practiv`, dose, pharmaceutical form, `atc`, etc. |

---

## 5. Notas de seguridad (notas)

**Safety notes associated with a medicine.**

| Status | Method                                    | Endpoint                    | Description                                                                         |
| ------ | ----------------------------------------- | --------------------------- | ----------------------------------------------------------------------------------- |
| 🔧 ⭐  | `getNotasSeguridadByNregistro(nregistro)` | `GET /notas/{nregistro}` \* | Retrieve safety notes for a given `nregistro`.                                      |
| 🔧     | `getNotasSeguridad(options)`              | `GET /notas?{condiciones}`  | Generic access to safety notes using query parameters (if you decide to expose it). |

> \* Depending on the final mapping, the SDK may internally use `GET /notas?nregistro={nregistro}` but expose a single ergonomic method.

---

## 6. Materiales informativos de seguridad (materiales)

**Educational/safety materials for a medicine.**

| Status | Method                                         | Endpoint                        | Description                                                    |
| ------ | ---------------------------------------------- | ------------------------------- | -------------------------------------------------------------- |
| 🔧 ⭐  | `getMaterialesSeguridadByNregistro(nregistro)` | `GET /materiales/{nregistro}`   | Get safety materials for a given `nregistro`.                  |
| 🔧     | `getMaterialesSeguridad(options)`              | `GET /materiales?{condiciones}` | Generic access via query params (optional as a public method). |

---

## 7. Documentos segmentados (docSegmentado)

**Segmented SmPC (Ficha Técnica) and Prospecto as JSON.**

| Status | Method                                           | Endpoint                                               | Description                                                                                                |
| ------ | ------------------------------------------------ | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| 🔧     | `getDocSegmentadoSecciones(tipoDoc, conditions)` | `GET /docSegmentado/secciones/{tipoDoc}?{condiciones}` | List sections available for a given document type (`tipoDoc`) and `nregistro`.                             |
| 🔧 🤖  | `getDocSegmentadoContenido(tipoDoc, conditions)` | `GET /docSegmentado/contenido/{tipoDoc}?{condiciones}` | Get the segmented content (JSON) for a specific `tipoDoc` and `nregistro`, optionally filtered by section. |

> For `tipoDoc` you can model an internal enum/union, e.g. `1 \| 2` → `1` = Ficha Técnica, `2` = Prospecto (or similar, aligned with the docs).

### Optional HTML helpers

These are _nice to have_ and can live in a separate module or “extras” namespace if you decide to support them.

| Status | Method                                           | Endpoint                                                  | Description                             |
| ------ | ------------------------------------------------ | --------------------------------------------------------- | --------------------------------------- |
| 🔧     | `getFichaTecnicaHtml(nregistro)`                 | `GET /dochtml/ft/{nregistro}/FichaTecnica.html`           | Get full SmPC as HTML.                  |
| 🔧     | `getFichaTecnicaHtmlSeccion(nregistro, seccion)` | `GET /dochtml/ft/{nregistro}/{seccion}/FichaTecnica.html` | Get a single SmPC section as HTML.      |
| 🔧     | `getProspectoHtml(nregistro)`                    | `GET /dochtml/p/{nregistro}/Prospecto.html`               | Get full Prospecto as HTML.             |
| 🔧     | `getProspectoHtmlSeccion(nregistro, seccion)`    | `GET /dochtml/p/{nregistro}/{seccion}/Prospecto.html`     | Get a single Prospecto section as HTML. |

---

## 8. Maestras (master data)

**Access to master data tables used across the API.**

| Status | Method                    | Endpoint                      | Description                                                                |
| ------ | ------------------------- | ----------------------------- | -------------------------------------------------------------------------- |
| 🔧     | `getMaestras(conditions)` | `GET /maestras?{condiciones}` | Generic access to master data, filtered by type or other query parameters. |

Later you can add more specialised helpers if it makes sense in real usage, e.g. `getMaestrasFormasFarmaceuticas`, `getMaestrasViasAdministracion`, etc.

---

## 9. Registro de cambios (registroCambios)

**Changes over time in medicines (alta, baja, modificaciones).**

| Status | Method                           | Endpoint                              | Description                                                                                    |
| ------ | -------------------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------- |
| 🔧     | `getRegistroCambios(conditions)` | `GET /registroCambios?{condiciones}`  | List change events over a period or matching certain filters (e.g. from a given date onwards). |
| 🔧     | `postRegistroCambios(body)`      | `POST /registroCambios?{condiciones}` | Alternative POST form supported by the API (same filters as GET).                              |

---

## Public client shape (high-level)

Once methods are implemented, the public client is expected to look conceptually like:

- **Medicamentos**

  - `searchMedicamentos(conditions)`
  - `getMedicamentoByNregistro(nregistro)`
  - `getMedicamentoByCN(cn)`
  - `searchInFichaTecnica(filters)`

  > 🤖 AI / MCP — REQUIRED (MUST):
  >
  > - These methods are essential for Model Context Protocol (MCP) consumption by AI assistants and LLMs. Make sure they are exposed, well-typed and return JSON friendly payloads.
  > - Español: Estos métodos son imprescindibles para integraciones MCP/AI — deben estar expuestos, tipados y devolver payloads JSON legibles por modelos.
  >
  > MUST:
  >
  > - `searchMedicamentos(conditions)`
  > - `getMedicamentoByNregistro(nregistro)`
  > - `getProblemasSuministroByCN(cn)`
  > - `getDocSegmentadoContenido(tipoDoc, conditions)` (prefer JSON)
  >
  > STRONGLY RECOMMENDED:
  >
  > - `getPresentacionByCN(cn)` or `searchPresentaciones(conditions)`
  > - `getNotasSeguridadByNregistro(nregistro)`
  > - `getMaterialesSeguridadByNregistro(nregistro)`

- **Presentaciones**

  - `searchPresentaciones(conditions)`
  - `getPresentacionByCN(cn)`

- **Problemas de suministro**

  - `listProblemasSuministro(conditions?)`
  - `getProblemasSuministroByCN(cn)`

- **Descripción clínica (VMP/VMPP)**

  - `searchVmpp(conditions)`

- **Notas & materiales de seguridad**

  - `getNotasSeguridadByNregistro(nregistro)`
  - `getMaterialesSeguridadByNregistro(nregistro)`

- **Documentos segmentados**

  - `getDocSegmentadoSecciones(tipoDoc, conditions)`
  - `getDocSegmentadoContenido(tipoDoc, conditions)`
  - Optional HTML helpers if you decide to include them.

- **Maestras**

  - `getMaestras(conditions)`

- **Registro de cambios**
  - `getRegistroCambios(conditions)`
  - `postRegistroCambios(body)`

Update the **Status** column (🔧 → ✅) as you implement and stabilise each method.

---

## Cross-cutting notes

- **Pagination:** endpoints that return paginated data accept `pagina` (e.g. `medicamentos`, `presentaciones`, `psuministro`, `vmpp`, `maestras`). Keep it surfaced in SDK method options.
- **docSegmentado content negotiation:** `docSegmentado/contenido` varies by `Accept` header (`application/json`, `text/html`, `text/plain`). Plan helpers accordingly (JSON by default, optional HTML/text helpers).

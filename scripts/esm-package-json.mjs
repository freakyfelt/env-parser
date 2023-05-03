import fs from "node:fs/promises";
import path from "node:path";

const packageJsonPath = path.join("dist", "esm", "package.json");

await fs.writeFile(packageJsonPath, JSON.stringify({ type: "module" }));

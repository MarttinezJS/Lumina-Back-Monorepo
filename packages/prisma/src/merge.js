import fs from "fs";
import path from "path";

// Lee el nombre del schema a combinar (por ejemplo: "valledupar.prisma")
const args = process.argv.slice(2);
const schemaName = args[0];

if (!schemaName) {
  console.error("❌ Debes especificar el nombre del schema. Ejemplo:");
  console.error("   bun run merge-schema valledupar.prisma");
  process.exit(1);
}

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Rutas
const basePath = path.join(__dirname, "datasources", "base.prisma");
const targetPath = path.join(__dirname, "datasources", schemaName);
const tempDir = path.join(__dirname, "temp");

// Crea la carpeta temp si no existe
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const outputPath = path.join(tempDir, "merged-schema.prisma");

// Verifica existencia de archivos
if (!fs.existsSync(basePath)) {
  console.error(`❌ No se encontró el archivo base: ${basePath}`);
  process.exit(1);
}
if (!fs.existsSync(targetPath)) {
  console.error(`❌ No se encontró el schema: ${targetPath}`);
  process.exit(1);
}

// Lee los contenidos
const base = fs.readFileSync(basePath, "utf8");
const target = fs.readFileSync(targetPath, "utf8");

// Fusiona: primero datasource/generator, luego los modelos base
const merged = `
${target.trim()}

${base.trim()}
`;

// Escribe el archivo combinado
fs.writeFileSync(outputPath, merged);
console.log(`✅ Schema combinado generado en: ${outputPath}`);

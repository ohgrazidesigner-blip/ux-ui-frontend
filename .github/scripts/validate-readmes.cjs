const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const docs = [
  "README.md",
  "cultura-inglesa/README.md",
  "secret-acai/README.md",
  "ledgerflow/README.md"
];
const expected = ["cultura-inglesa", "secret-acai", "ledgerflow"];
const errors = [];
let links = 0;

for (const filename of docs) {
  const text = fs.readFileSync(filename, "utf8");
  assert(text.startsWith("# "), "Missing main heading in " + filename);
  assert(text.includes("## Run locally") || text.includes("## Local"), "Missing local instructions: " + filename);
  if (text.includes("<<<<<<<") || text.includes(">>>>>>>")) errors.push("Unresolved conflict in " + filename);
  const fences = (text.match(/^```/gm) || []).length;
  if (fences % 2) errors.push("Unclosed code fence: " + filename);
  const root = path.dirname(filename);
  // Markdown image/link references in the READMEs (ignores fenced example paths).
  const markdownLinks = [...text.matchAll(/!?\[[^\]]+\]\(([^)]+)\)/g)].map(m=>m[1]);
  const htmlLinks = [...text.matchAll(/\b(?:src|href)="([^"]+)"/g)].map(m=>m[1]);
  for (const dest of [...markdownLinks,...htmlLinks]) {
    if (/^(https?:\/\/|mailto:|#)/.test(dest)) { links++; continue; }
    const withoutAnchor = dest.split("#")[0].split("?")[0];
    if (!withoutAnchor) continue;
    const absolute = path.resolve(root,decodeURIComponent(withoutAnchor));
    links++;
    if (!fs.existsSync(absolute)) errors.push(filename + " -> missing " + dest);
  }
}
for (const project of expected) {
  for (const suffix of ["desktop","mobile"]) {
    const shot = `showcase/assets/${project}-${suffix}.jpg`;
    if (!fs.existsSync(shot) || fs.statSync(shot).size < 12000) errors.push("Missing or empty real screenshot: " + shot);
  }
}
const packages = ["secret-acai/package.json", "ledgerflow/package.json"].map(file => JSON.parse(fs.readFileSync(file, "utf8")));
for (const p of packages) {
  if (!p.scripts?.build || !p.scripts?.dev || !p.dependencies?.react) errors.push("Missing React setup in a project package.json");
}
if (errors.length) {
  console.error("README VALIDATION FAILED:\n" + errors.join("\n"));
  process.exit(1);
}
console.log(`README VALIDATION PASS: ${docs.length} documented entries, ${links} links reviewed and 6 real screenshot assets verified.`);

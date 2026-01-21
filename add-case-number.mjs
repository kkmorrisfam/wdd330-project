import fs from "node:fs";

// function extractCaseNumber(linkedMatter = "") {
//   // Take everything after the first colon (best signal in your data)
//   const afterColon = linkedMatter.includes(":")
//     ? linkedMatter.split(":").slice(1).join(":").trim()
//     : linkedMatter.trim();

//   // Remove leading parentheticals like "(PV)" "(ABC)" etc (possibly multiple)
//   const noParens = afterColon.replace(/^(\([^)]*\)\s*)+/, "").trim();

//   // Match case numbers like:
//   // "CF 23-9504", "CRF23-9457", "CVDM22-1274", etc.
//   const m = noParens.match(/[A-Z]{2,6}\s*\d{2}\s*-\s*\d{3,6}/);
//   if (!m) return "";

//   // Normalize spacing: keep optional space between letters+digits,
//   // but remove spaces around hyphen.
//   return m[0]
//     .replace(/\s*-\s*/g, "-")
//     .replace(/\s{2,}/g, " ")
//     .trim();
// }

function extractCaseNumber(linkedMatter = "") {
  const s = (linkedMatter || "").trim();

  // Prefer "after colon" if present, otherwise whole string
  const afterColon = s.includes(":") ? s.split(":").slice(1).join(":").trim() : s;

  // Remove leading parentheticals like "(PV) "
  const cleaned = afterColon.replace(/^(\([^)]*\)\s*)+/, "").trim();

  //  Matches:
  // CF 23-9504, CRF23-9457, CVDM22-1274, CRTR 18-3137, CVCO 20-7003
  //  ALSO matches:
  // CF249270, CF249137, CM243371, CM233275, CP249275, etc.
  const CASE_RE = /[A-Z]{2,6}\s*\d{2,6}(?:\s*-\s*\d{2,6})?/;

  const m = cleaned.match(CASE_RE);
  if (!m) return "";

  // Normalize spacing around hyphen; collapse double spaces
  return m[0]
    .replace(/\s*-\s*/g, "-")
    .replace(/\s{2,}/g, " ")
    .trim();
}


function addCaseNumbers(records) {
  return records.map((item) => {
    if (item["Case Number"]) return item;

    const linked = item["Linked Matter"] ?? "";
    const caseNum = extractCaseNumber(linked);

    // Only add if we found something
    return caseNum ? { ...item, "Case Number": caseNum } : item;
  });
}

// ---- main ----
const inputPath = process.argv[2] || "data.json";
const outputPath = process.argv[3] || "data.withCaseNumber.json";

const raw = fs.readFileSync(inputPath, "utf8");
const parsed = JSON.parse(raw);

// Support JSONBin shape { record: [...] } or plain array
if (Array.isArray(parsed)) {
  const updated = addCaseNumbers(parsed);
  fs.writeFileSync(outputPath, JSON.stringify(updated, null, 2));
} else if (parsed && Array.isArray(parsed.record)) {
  const updated = { ...parsed, record: addCaseNumbers(parsed.record) };
  fs.writeFileSync(outputPath, JSON.stringify(updated, null, 2));
} else {
  throw new Error("Input JSON must be an array or an object with a record array.");
}

console.log(`Wrote: ${outputPath}`);

import { createRequire } from "module";
const require = createRequire(import.meta.url);

const pdfParse = require("pdf-parse");

export const extractTextFromPDF = async (buffer) => {
  const pdfData = await pdfParse(buffer);
  return pdfData.text;
};
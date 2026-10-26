import { URL } from "node:url";
import QRCode from "qrcode";
import { readFile, writeFile } from "node:fs/promises";
const { payload } = JSON.parse(
  await readFile(
    new URL("../src/assets/ticket-preview-payload.json", import.meta.url),
    "utf8",
  ),
);
const svg = await QRCode.toString(payload, {
  type: "svg",
  version: 12,
  errorCorrectionLevel: "M",
  margin: 4,
  color: { dark: "#000000", light: "#ffffff" },
});
await writeFile(
  new URL("../src/assets/ticket-preview-qr.svg", import.meta.url),
  svg,
);

import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { analyzeQrContent } from "@/lib/fraud-detection";
import { classifyQr } from "@/lib/qr-classify";

export default defineTool({
  name: "check_qr",
  title: "Check QR code content for fraud",
  description:
    "Analyze the decoded text payload of a QR code (UPI link, URL, etc.). Returns Fraud Shield risk score, status, reasons, and QR classification (transaction vs non-transaction, UPI payee details when present).",
  inputSchema: {
    content: z
      .string()
      .min(1)
      .describe("The raw text decoded from the QR code (e.g. 'upi://pay?pa=...' or an https URL)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ content }) => {
    const risk = analyzeQrContent(content);
    const classification = classifyQr(content);
    return {
      content: [
        {
          type: "text",
          text: `Risk score: ${risk.score}/100 (${risk.status.toUpperCase()})\nQR type: ${classification.label} (${classification.category})\nReasons:\n- ${risk.reasons.join("\n- ")}`,
        },
      ],
      structuredContent: { risk, classification, content },
    };
  },
});

import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { analyzeUrl } from "@/lib/fraud-detection";

export default defineTool({
  name: "check_url",
  title: "Check URL for fraud",
  description:
    "Analyze a payment or transaction URL and return a Fraud Shield risk score (0-100), status (safe/caution/fraud), and human-readable reasons. Pure heuristic analysis — no data is stored.",
  inputSchema: {
    url: z.string().min(1).describe("The URL to analyze (http/https)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ url }) => {
    const result = analyzeUrl(url);
    return {
      content: [
        {
          type: "text",
          text: `Risk score: ${result.score}/100 (${result.status.toUpperCase()})\nReasons:\n- ${result.reasons.join("\n- ")}`,
        },
      ],
      structuredContent: { ...result, url },
    };
  },
});

import { defineMcp } from "@lovable.dev/mcp-js";
import checkUrlTool from "./tools/check-url";
import checkQrTool from "./tools/check-qr";
import listRecentFraudReportsTool from "./tools/list-recent-fraud-reports";

export default defineMcp({
  name: "fraud-shield-mcp",
  title: "Fraud Shield",
  version: "0.1.0",
  instructions:
    "Fraud Shield tools for pre-payment safety. Use `check_url` to score a payment/transaction URL, `check_qr` to analyze the decoded text of a QR code (including UPI links), and `list_recent_fraud_reports` to see recent community-submitted fraud reports. All calls are anonymous and public.",
  tools: [checkUrlTool, checkQrTool, listRecentFraudReportsTool],
});

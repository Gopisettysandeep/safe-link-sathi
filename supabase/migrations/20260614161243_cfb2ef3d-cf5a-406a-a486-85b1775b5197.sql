
CREATE TABLE public.fraud_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_type TEXT NOT NULL CHECK (report_type IN ('qr','url','upi')),
  content TEXT NOT NULL,
  reason TEXT,
  risk_score INTEGER,
  reporter_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.fraud_reports TO anon;
GRANT SELECT, INSERT ON public.fraud_reports TO authenticated;
GRANT ALL ON public.fraud_reports TO service_role;

ALTER TABLE public.fraud_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read fraud reports"
  ON public.fraud_reports FOR SELECT
  USING (true);

CREATE POLICY "Anyone can submit fraud reports"
  ON public.fraud_reports FOR INSERT
  WITH CHECK (length(content) > 0 AND length(content) < 2000);

CREATE INDEX fraud_reports_content_idx ON public.fraud_reports (content);
CREATE INDEX fraud_reports_created_at_idx ON public.fraud_reports (created_at DESC);

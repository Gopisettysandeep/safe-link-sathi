interface RiskScoreCircleProps {
  score: number;
  status: 'safe' | 'caution' | 'fraud';
}

export function RiskScoreCircle({ score, status }: RiskScoreCircleProps) {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;

  const colorClass = status === 'safe'
    ? 'text-safe'
    : status === 'caution'
    ? 'text-warning'
    : 'text-danger';

  const bgGradient = status === 'safe'
    ? 'gradient-safe'
    : status === 'caution'
    ? 'gradient-warning'
    : 'gradient-danger';

  return (
    <div className="relative flex flex-col items-center">
      <div className="relative h-40 w-40">
        <svg className="h-40 w-40 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted/30"
          />
          <circle
            cx="50" cy="50" r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${colorClass} animate-score-fill`}
            style={{ '--score-offset': offset } as React.CSSProperties}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-heading text-4xl font-bold ${colorClass}`}>{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
    </div>
  );
}

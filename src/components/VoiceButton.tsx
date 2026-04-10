import { Volume2, VolumeX } from 'lucide-react';
import { useState, useEffect } from 'react';
import { isMuted, setMuted } from '@/lib/app-store';
import { speak, stopSpeaking } from '@/lib/voice';
import type { Language } from '@/lib/translations';

interface VoiceButtonProps {
  text: string;
  lang: Language;
  className?: string;
}

export function VoiceButton({ text, lang, className = '' }: VoiceButtonProps) {
  const [muted, setMutedState] = useState(false);

  useEffect(() => {
    setMutedState(isMuted());
  }, []);

  const handleClick = () => {
    if (muted) {
      setMuted(false);
      setMutedState(false);
      speak(text, lang);
    } else {
      speak(text, lang);
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newMuted = !muted;
    setMuted(newMuted);
    setMutedState(newMuted);
    if (newMuted) stopSpeaking();
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        onClick={handleClick}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary transition-all hover:bg-primary/20 active:scale-95"
        aria-label="Play voice"
      >
        <Volume2 className="h-5 w-5" />
      </button>
      <button
        onClick={handleMuteToggle}
        className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-all hover:text-foreground active:scale-95"
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : null}
      </button>
    </div>
  );
}

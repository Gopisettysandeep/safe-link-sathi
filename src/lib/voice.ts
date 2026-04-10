import { type Language, languageVoiceCodes } from './translations';
import { isMuted } from './app-store';

let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speak(text: string, lang: Language) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  if (isMuted()) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = languageVoiceCodes[lang];
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  // Try to find a matching voice
  const voices = window.speechSynthesis.getVoices();
  const matchingVoice = voices.find(v => v.lang.startsWith(languageVoiceCodes[lang].split('-')[0]));
  if (matchingVoice) {
    utterance.voice = matchingVoice;
  }

  currentUtterance = utterance;
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  currentUtterance = null;
}

export function replaySpeech() {
  if (currentUtterance) {
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(currentUtterance);
  }
}

export function isSpeaking(): boolean {
  if (typeof window === 'undefined' || !window.speechSynthesis) return false;
  return window.speechSynthesis.speaking;
}

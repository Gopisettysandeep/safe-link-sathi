import type { Language } from './translations';

export type ExtraKey =
  | 'trusted'
  | 'dashboard'
  | 'community'
  | 'learn'
  | 'pair'
  | 'settings'
  | 'security_center'
  | 'privacy_center'
  | 'protection_on'
  | 'protection_off'
  | 'protection_on_desc'
  | 'protection_off_desc';

export const extraTranslations: Record<Language, Record<ExtraKey, string>> = {
  en: {
    trusted: 'Trusted', dashboard: 'Dashboard', community: 'Community', learn: 'Learn', pair: 'Pair',
    settings: 'Settings', security_center: 'Security', privacy_center: 'Privacy',
    protection_on: 'Protection ON', protection_off: 'Protection OFF',
    protection_on_desc: 'Fraud Shield is actively monitoring',
    protection_off_desc: 'Tap to enable protection',
  },
  te: {
    trusted: 'విశ్వసనీయ', dashboard: 'డాష్‌బోర్డ్', community: 'కమ్యూనిటీ', learn: 'నేర్చుకోండి', pair: 'జత',
    settings: 'సెట్టింగ్‌లు', security_center: 'భద్రత', privacy_center: 'గోప్యత',
    protection_on: 'రక్షణ ఆన్', protection_off: 'రక్షణ ఆఫ్',
    protection_on_desc: 'ఫ్రాడ్ షీల్డ్ పర్యవేక్షిస్తోంది',
    protection_off_desc: 'రక్షణ ఆన్ చేయడానికి నొక్కండి',
  },
  hi: {
    trusted: 'विश्वसनीय', dashboard: 'डैशबोर्ड', community: 'समुदाय', learn: 'सीखें', pair: 'जोड़ी',
    settings: 'सेटिंग्स', security_center: 'सुरक्षा', privacy_center: 'गोपनीयता',
    protection_on: 'सुरक्षा चालू', protection_off: 'सुरक्षा बंद',
    protection_on_desc: 'फ्रॉड शील्ड सक्रिय रूप से निगरानी कर रहा है',
    protection_off_desc: 'सुरक्षा चालू करने के लिए टैप करें',
  },
  ta: {
    trusted: 'நம்பகமான', dashboard: 'டாஷ்போர்டு', community: 'சமூகம்', learn: 'கற்க', pair: 'இணைப்பு',
    settings: 'அமைப்புகள்', security_center: 'பாதுகாப்பு', privacy_center: 'தனியுரிமை',
    protection_on: 'பாதுகாப்பு இயக்கம்', protection_off: 'பாதுகாப்பு நிறுத்தம்',
    protection_on_desc: 'ஃப்ராட் ஷீல்ட் கண்காணிக்கிறது',
    protection_off_desc: 'பாதுகாப்பை இயக்க தட்டவும்',
  },
  kn: {
    trusted: 'ವಿಶ್ವಾಸಾರ್ಹ', dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', community: 'ಸಮುದಾಯ', learn: 'ಕಲಿಯಿರಿ', pair: 'ಜೋಡಣೆ',
    settings: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು', security_center: 'ಭದ್ರತೆ', privacy_center: 'ಗೌಪ್ಯತೆ',
    protection_on: 'ರಕ್ಷಣೆ ಆನ್', protection_off: 'ರಕ್ಷಣೆ ಆಫ್',
    protection_on_desc: 'ಫ್ರಾಡ್ ಶೀಲ್ಡ್ ಸಕ್ರಿಯವಾಗಿ ಮೇಲ್ವಿಚಾರಣೆ ಮಾಡುತ್ತಿದೆ',
    protection_off_desc: 'ರಕ್ಷಣೆ ಆನ್ ಮಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
  },
  ml: {
    trusted: 'വിശ്വസ്ത', dashboard: 'ഡാഷ്‌ബോർഡ്', community: 'കമ്മ്യൂണിറ്റി', learn: 'പഠിക്കുക', pair: 'ജോടി',
    settings: 'ക്രമീകരണങ്ങൾ', security_center: 'സുരക്ഷ', privacy_center: 'സ്വകാര്യത',
    protection_on: 'സംരക്ഷണം ഓൺ', protection_off: 'സംരക്ഷണം ഓഫ്',
    protection_on_desc: 'ഫ്രോഡ് ഷീൽഡ് നിരീക്ഷിക്കുന്നു',
    protection_off_desc: 'സംരക്ഷണം ഓൺ ചെയ്യാൻ ടാപ്പ് ചെയ്യുക',
  },
};

import type { Language } from '../translations';

export type SettingsKey =
  | 'title'
  | 'protection_title'
  | 'protection_on'
  | 'protection_off'
  | 'voice_title'
  | 'voice_muted'
  | 'voice_enabled'
  | 'family_title'
  | 'family_desc'
  | 'language_title'
  | 'language_desc'
  | 'language_change'
  | 'trusted_title'
  | 'trusted_desc'
  | 'trusted_open'
  | 'permissions_title'
  | 'permissions_desc'
  | 'permissions_review'
  | 'clear_history'
  | 'clear_history_confirm'
  | 'toggle_aria';

export type TrustedKey =
  | 'title'
  | 'desc'
  | 'trusted_word'
  | 'add_recipient'
  | 'label_placeholder'
  | 'upi_placeholder'
  | 'save'
  | 'cancel'
  | 'empty'
  | 'invalid_input';

export const settingsT: Record<Language, Record<SettingsKey, string>> = {
  en: {
    title: 'Settings',
    protection_title: 'Fraud Shield Protection',
    protection_on: 'Protection is ON',
    protection_off: 'Protection is OFF',
    voice_title: 'Voice Assistant',
    voice_muted: 'Muted',
    voice_enabled: 'Spoken alerts enabled',
    family_title: 'Family Protection Mode',
    family_desc: 'Bigger warnings, extra confirmation',
    language_title: 'Language',
    language_desc: 'Change app language',
    language_change: 'Change ›',
    trusted_title: 'Trusted Recipients',
    trusted_desc: 'Manage saved UPI IDs',
    trusted_open: 'Open ›',
    permissions_title: 'Permissions',
    permissions_desc: 'Review camera, storage, notifications',
    permissions_review: 'Review ›',
    clear_history: 'Clear Scan History',
    clear_history_confirm: 'Clear all scan history?',
    toggle_aria: 'toggle',
  },
  te: {
    title: 'సెట్టింగ్‌లు',
    protection_title: 'ఫ్రాడ్ షీల్డ్ రక్షణ',
    protection_on: 'రక్షణ ఆన్‌లో ఉంది',
    protection_off: 'రక్షణ ఆఫ్‌లో ఉంది',
    voice_title: 'వాయిస్ అసిస్టెంట్',
    voice_muted: 'మ్యూట్ చేయబడింది',
    voice_enabled: 'మాట్లాడే హెచ్చరికలు ప్రారంభించబడ్డాయి',
    family_title: 'కుటుంబ రక్షణ మోడ్',
    family_desc: 'పెద్ద హెచ్చరికలు, అదనపు నిర్ధారణ',
    language_title: 'భాష',
    language_desc: 'యాప్ భాషను మార్చండి',
    language_change: 'మార్చు ›',
    trusted_title: 'విశ్వసనీయ గ్రహీతలు',
    trusted_desc: 'సేవ్ చేసిన UPI IDలను నిర్వహించండి',
    trusted_open: 'తెరవండి ›',
    permissions_title: 'అనుమతులు',
    permissions_desc: 'కెమెరా, స్టోరేజ్, నోటిఫికేషన్‌లను సమీక్షించండి',
    permissions_review: 'సమీక్షించండి ›',
    clear_history: 'స్కాన్ చరిత్రను తొలగించండి',
    clear_history_confirm: 'మొత్తం స్కాన్ చరిత్రను తొలగించాలా?',
    toggle_aria: 'టోగుల్',
  },
  hi: {
    title: 'सेटिंग्स',
    protection_title: 'फ्रॉड शील्ड सुरक्षा',
    protection_on: 'सुरक्षा चालू है',
    protection_off: 'सुरक्षा बंद है',
    voice_title: 'वॉइस असिस्टेंट',
    voice_muted: 'म्यूट किया गया',
    voice_enabled: 'बोली जाने वाली चेतावनियाँ सक्षम हैं',
    family_title: 'फैमिली प्रोटेक्शन मोड',
    family_desc: 'बड़ी चेतावनियाँ, अतिरिक्त पुष्टि',
    language_title: 'भाषा',
    language_desc: 'ऐप की भाषा बदलें',
    language_change: 'बदलें ›',
    trusted_title: 'विश्वसनीय प्राप्तकर्ता',
    trusted_desc: 'सहेजे गए UPI ID प्रबंधित करें',
    trusted_open: 'खोलें ›',
    permissions_title: 'अनुमतियाँ',
    permissions_desc: 'कैमरा, स्टोरेज, नोटिफिकेशन की समीक्षा करें',
    permissions_review: 'समीक्षा करें ›',
    clear_history: 'स्कैन इतिहास साफ़ करें',
    clear_history_confirm: 'सारा स्कैन इतिहास साफ़ करें?',
    toggle_aria: 'टॉगल',
  },
  ta: {
    title: 'அமைப்புகள்',
    protection_title: 'மோசடி கவச பாதுகாப்பு',
    protection_on: 'பாதுகாப்பு இயக்கத்தில் உள்ளது',
    protection_off: 'பாதுகாப்பு அணைக்கப்பட்டுள்ளது',
    voice_title: 'குரல் உதவியாளர்',
    voice_muted: 'முடக்கப்பட்டது',
    voice_enabled: 'பேசும் எச்சரிக்கைகள் இயக்கப்பட்டுள்ளன',
    family_title: 'குடும்ப பாதுகாப்பு பயன்முறை',
    family_desc: 'பெரிய எச்சரிக்கைகள், கூடுதல் உறுதிப்படுத்தல்',
    language_title: 'மொழி',
    language_desc: 'ஆப் மொழியை மாற்றவும்',
    language_change: 'மாற்று ›',
    trusted_title: 'நம்பகமான பெறுநர்கள்',
    trusted_desc: 'சேமிக்கப்பட்ட UPI ID-களை நிர்வகிக்கவும்',
    trusted_open: 'திற ›',
    permissions_title: 'அனுமதிகள்',
    permissions_desc: 'கேமரா, சேமிப்பு, அறிவிப்புகளை மதிப்பாய்வு செய்யவும்',
    permissions_review: 'மதிப்பாய்வு செய் ›',
    clear_history: 'ஸ்கேன் வரலாற்றை அழி',
    clear_history_confirm: 'அனைத்து ஸ்கேன் வரலாற்றையும் அழிக்கவா?',
    toggle_aria: 'மாற்று',
  },
  kn: {
    title: 'ಸೆಟ್ಟಿಂಗ್‌ಗಳು',
    protection_title: 'ಫ್ರಾಡ್ ಶೀಲ್ಡ್ ರಕ್ಷಣೆ',
    protection_on: 'ರಕ್ಷಣೆ ಆನ್ ಆಗಿದೆ',
    protection_off: 'ರಕ್ಷಣೆ ಆಫ್ ಆಗಿದೆ',
    voice_title: 'ವಾಯ್ಸ್ ಅಸಿಸ್ಟೆಂಟ್',
    voice_muted: 'ಮ್ಯೂಟ್ ಮಾಡಲಾಗಿದೆ',
    voice_enabled: 'ಮಾತನಾಡುವ ಎಚ್ಚರಿಕೆಗಳು ಸಕ್ರಿಯವಾಗಿವೆ',
    family_title: 'ಕುಟುಂಬ ರಕ್ಷಣಾ ಮೋಡ್',
    family_desc: 'ದೊಡ್ಡ ಎಚ್ಚರಿಕೆಗಳು, ಹೆಚ್ಚುವರಿ ದೃಢೀಕರಣ',
    language_title: 'ಭಾಷೆ',
    language_desc: 'ಆ್ಯಪ್ ಭಾಷೆಯನ್ನು ಬದಲಾಯಿಸಿ',
    language_change: 'ಬದಲಾಯಿಸಿ ›',
    trusted_title: 'ವಿಶ್ವಾಸಾರ್ಹ ಸ್ವೀಕರಿಸುವವರು',
    trusted_desc: 'ಉಳಿಸಿದ UPI ID ಗಳನ್ನು ನಿರ್ವಹಿಸಿ',
    trusted_open: 'ತೆರೆಯಿರಿ ›',
    permissions_title: 'ಅನುಮತಿಗಳು',
    permissions_desc: 'ಕ್ಯಾಮೆರಾ, ಸಂಗ್ರಹಣೆ, ಅಧಿಸೂಚನೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
    permissions_review: 'ಪರಿಶೀಲಿಸಿ ›',
    clear_history: 'ಸ್ಕ್ಯಾನ್ ಇತಿಹಾಸವನ್ನು ತೆರವುಗೊಳಿಸಿ',
    clear_history_confirm: 'ಎಲ್ಲಾ ಸ್ಕ್ಯಾನ್ ಇತಿಹಾಸವನ್ನು ತೆರವುಗೊಳಿಸಬೇಕೆ?',
    toggle_aria: 'ಟಾಗಲ್',
  },
  ml: {
    title: 'ക്രമീകരണങ്ങൾ',
    protection_title: 'ഫ്രോഡ് ഷീൽഡ് സംരക്ഷണം',
    protection_on: 'സംരക്ഷണം ഓണാണ്',
    protection_off: 'സംരക്ഷണം ഓഫാണ്',
    voice_title: 'വോയ്സ് അസിസ്റ്റന്റ്',
    voice_muted: 'നിശബ്ദമാക്കി',
    voice_enabled: 'സംസാരിക്കുന്ന മുന്നറിയിപ്പുകൾ പ്രവർത്തനക്ഷമമാണ്',
    family_title: 'ഫാമിലി പ്രൊട്ടക്ഷൻ മോഡ്',
    family_desc: 'വലിയ മുന്നറിയിപ്പുകൾ, അധിക സ്ഥിരീകരണം',
    language_title: 'ഭാഷ',
    language_desc: 'ആപ്പ് ഭാഷ മാറ്റുക',
    language_change: 'മാറ്റുക ›',
    trusted_title: 'വിശ്വസ്ത സ്വീകർത്താക്കൾ',
    trusted_desc: 'സേവ് ചെയ്ത UPI ID-കൾ കൈകാര്യം ചെയ്യുക',
    trusted_open: 'തുറക്കുക ›',
    permissions_title: 'അനുമതികൾ',
    permissions_desc: 'ക്യാമറ, സ്റ്റോറേജ്, അറിയിപ്പുകൾ അവലോകനം ചെയ്യുക',
    permissions_review: 'അവലോകനം ചെയ്യുക ›',
    clear_history: 'സ്കാൻ ചരിത്രം മായ്ക്കുക',
    clear_history_confirm: 'എല്ലാ സ്കാൻ ചരിത്രവും മായ്ക്കണോ?',
    toggle_aria: 'ടോഗിൾ',
  },
};

export const trustedT: Record<Language, Record<TrustedKey, string>> = {
  en: {
    title: 'Trusted Recipients',
    desc: "Save UPI IDs of people and businesses you trust. We'll flag them as {trusted} when you scan.",
    trusted_word: 'Trusted',
    add_recipient: 'Add Recipient',
    label_placeholder: 'Label (e.g. Mother, Shop Owner)',
    upi_placeholder: 'UPI ID (e.g. mom@okhdfcbank)',
    save: 'Save',
    cancel: 'Cancel',
    empty: 'No trusted recipients yet.',
    invalid_input: 'Please enter a name and valid UPI ID like name@bank',
  },
  te: {
    title: 'విశ్వసనీయ గ్రహీతలు',
    desc: 'మీరు నమ్మే వ్యక్తులు మరియు వ్యాపారాల UPI IDలను సేవ్ చేయండి. మీరు స్కాన్ చేసినప్పుడు వాటిని {trusted}గా గుర్తిస్తాము.',
    trusted_word: 'విశ్వసనీయం',
    add_recipient: 'గ్రహీతను జోడించండి',
    label_placeholder: 'లేబుల్ (ఉదా. అమ్మ, షాప్ యజమాని)',
    upi_placeholder: 'UPI ID (ఉదా. mom@okhdfcbank)',
    save: 'సేవ్ చేయండి',
    cancel: 'రద్దు చేయండి',
    empty: 'ఇంకా విశ్వసనీయ గ్రహీతలు లేరు.',
    invalid_input: 'దయచేసి పేరు మరియు name@bank వంటి చెల్లుబాటు అయ్యే UPI IDని నమోదు చేయండి',
  },
  hi: {
    title: 'विश्वसनीय प्राप्तकर्ता',
    desc: 'उन लोगों और व्यवसायों की UPI ID सेव करें जिन पर आप भरोसा करते हैं। स्कैन करते समय हम उन्हें {trusted} के रूप में चिह्नित करेंगे।',
    trusted_word: 'विश्वसनीय',
    add_recipient: 'प्राप्तकर्ता जोड़ें',
    label_placeholder: 'लेबल (जैसे माँ, दुकान मालिक)',
    upi_placeholder: 'UPI ID (जैसे mom@okhdfcbank)',
    save: 'सेव करें',
    cancel: 'रद्द करें',
    empty: 'अभी तक कोई विश्वसनीय प्राप्तकर्ता नहीं है।',
    invalid_input: 'कृपया एक नाम और name@bank जैसी वैध UPI ID दर्ज करें',
  },
  ta: {
    title: 'நம்பகமான பெறுநர்கள்',
    desc: 'நீங்கள் நம்பும் நபர்கள் மற்றும் வணிகங்களின் UPI ID-களை சேமிக்கவும். நீங்கள் ஸ்கேன் செய்யும்போது அவற்றை {trusted} என குறிப்பிடுவோம்.',
    trusted_word: 'நம்பகமானது',
    add_recipient: 'பெறுநரைச் சேர்',
    label_placeholder: 'லேபிள் (எ.கா. அம்மா, கடை உரிமையாளர்)',
    upi_placeholder: 'UPI ID (எ.கா. mom@okhdfcbank)',
    save: 'சேமி',
    cancel: 'ரத்து செய்',
    empty: 'இன்னும் நம்பகமான பெறுநர்கள் இல்லை.',
    invalid_input: 'தயவுசெய்து ஒரு பெயர் மற்றும் name@bank போன்ற செல்லுபடியான UPI ID ஐ உள்ளிடவும்',
  },
  kn: {
    title: 'ವಿಶ್ವಾಸಾರ್ಹ ಸ್ವೀಕರಿಸುವವರು',
    desc: 'ನೀವು ನಂಬುವ ಜನರು ಮತ್ತು ವ್ಯವಹಾರಗಳ UPI ID ಗಳನ್ನು ಉಳಿಸಿ. ನೀವು ಸ್ಕ್ಯಾನ್ ಮಾಡಿದಾಗ ನಾವು ಅವುಗಳನ್ನು {trusted} ಎಂದು ಗುರುತಿಸುತ್ತೇವೆ.',
    trusted_word: 'ವಿಶ್ವಾಸಾರ್ಹ',
    add_recipient: 'ಸ್ವೀಕರಿಸುವವರನ್ನು ಸೇರಿಸಿ',
    label_placeholder: 'ಲೇಬಲ್ (ಉದಾ. ಅಮ್ಮ, ಅಂಗಡಿ ಮಾಲೀಕರು)',
    upi_placeholder: 'UPI ID (ಉದಾ. mom@okhdfcbank)',
    save: 'ಉಳಿಸಿ',
    cancel: 'ರದ್ದುಮಾಡಿ',
    empty: 'ಇನ್ನೂ ಯಾವುದೇ ವಿಶ್ವಾಸಾರ್ಹ ಸ್ವೀಕರಿಸುವವರಿಲ್ಲ.',
    invalid_input: 'ದಯವಿಟ್ಟು ಹೆಸರು ಮತ್ತು name@bank ನಂತಹ ಮಾನ್ಯ UPI ID ಅನ್ನು ನಮೂದಿಸಿ',
  },
  ml: {
    title: 'വിശ്വസ്ത സ്വീകർത്താക്കൾ',
    desc: 'നിങ്ങൾ വിശ്വസിക്കുന്ന ആളുകളുടെയും ബിസിനസ്സുകളുടെയും UPI ID-കൾ സേവ് ചെയ്യുക. സ്കാൻ ചെയ്യുമ്പോൾ ഞങ്ങൾ അവയെ {trusted} ആയി അടയാളപ്പെടുത്തും.',
    trusted_word: 'വിശ്വസ്തം',
    add_recipient: 'സ്വീകർത്താവിനെ ചേർക്കുക',
    label_placeholder: 'ലേബൽ (ഉദാ. അമ്മ, കട ഉടമ)',
    upi_placeholder: 'UPI ID (ഉദാ. mom@okhdfcbank)',
    save: 'സേവ് ചെയ്യുക',
    cancel: 'റദ്ദാക്കുക',
    empty: 'ഇതുവരെ വിശ്വസ്ത സ്വീകർത്താക്കൾ ഇല്ല.',
    invalid_input: 'ദയവായി ഒരു പേരും name@bank പോലുള്ള സാധുവായ UPI ID-യും നൽകുക',
  },
};

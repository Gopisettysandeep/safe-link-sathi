import type { Language } from '../translations';

type DashboardKey =
  | 'security_dashboard'
  | 'protection_status'
  | 'active'
  | 'disabled'
  | 'total_scans'
  | 'safe'
  | 'suspicious'
  | 'fraud_blocked'
  | 'threat_database'
  | 'local_heuristic_rules'
  | 'up_to_date'
  | 'device'
  | 'mobile_browser'
  | 'desktop_browser'
  | 'ok'
  | 'community_reports'
  | 'crowdsourced_fraud_database'
  | 'total'
  | 'recent_activity'
  | 'no_scans_yet';

type CommunityKey =
  | 'community_fraud_reports'
  | 'crowdsourced_banner'
  | 'search_reports'
  | 'loading_reports'
  | 'no_reports_yet'
  | 'reported_risk_score';

export const dashboardT: Record<Language, Record<DashboardKey, string>> = {
  en: {
    security_dashboard: 'Security Dashboard',
    protection_status: 'Protection Status',
    active: 'ACTIVE',
    disabled: 'DISABLED',
    total_scans: 'Total Scans',
    safe: 'Safe',
    suspicious: 'Suspicious',
    fraud_blocked: 'Fraud Blocked',
    threat_database: 'Threat Database',
    local_heuristic_rules: 'Local heuristic rules',
    up_to_date: 'UP TO DATE',
    device: 'Device',
    mobile_browser: 'Mobile browser',
    desktop_browser: 'Desktop browser',
    ok: 'OK',
    community_reports: 'Community Reports',
    crowdsourced_fraud_database: 'Crowdsourced fraud database',
    total: 'TOTAL',
    recent_activity: 'Recent Activity',
    no_scans_yet: 'No scans yet',
  },
  te: {
    security_dashboard: 'భద్రతా డాష్‌బోర్డ్',
    protection_status: 'రక్షణ స్థితి',
    active: 'యాక్టివ్',
    disabled: 'నిలిపివేయబడింది',
    total_scans: 'మొత్తం స్కాన్‌లు',
    safe: 'సురక్షితం',
    suspicious: 'అనుమానాస్పదం',
    fraud_blocked: 'మోసం నిరోధించబడింది',
    threat_database: 'ముప్పు డేటాబేస్',
    local_heuristic_rules: 'స్థానిక హ్యూరిస్టిక్ నియమాలు',
    up_to_date: 'తాజాగా ఉంది',
    device: 'పరికరం',
    mobile_browser: 'మొబైల్ బ్రౌజర్',
    desktop_browser: 'డెస్క్‌టాప్ బ్రౌజర్',
    ok: 'సరే',
    community_reports: 'కమ్యూనిటీ నివేదికలు',
    crowdsourced_fraud_database: 'క్రౌడ్‌సోర్స్డ్ మోసం డేటాబేస్',
    total: 'మొత్తం',
    recent_activity: 'ఇటీవలి కార్యకలాపం',
    no_scans_yet: 'ఇంకా స్కాన్‌లు లేవు',
  },
  hi: {
    security_dashboard: 'सुरक्षा डैशबोर्ड',
    protection_status: 'सुरक्षा स्थिति',
    active: 'सक्रिय',
    disabled: 'निष्क्रिय',
    total_scans: 'कुल स्कैन',
    safe: 'सुरक्षित',
    suspicious: 'संदिग्ध',
    fraud_blocked: 'धोखाधड़ी अवरुद्ध',
    threat_database: 'खतरा डेटाबेस',
    local_heuristic_rules: 'स्थानीय ह्यूरिस्टिक नियम',
    up_to_date: 'अद्यतन',
    device: 'डिवाइस',
    mobile_browser: 'मोबाइल ब्राउज़र',
    desktop_browser: 'डेस्कटॉप ब्राउज़र',
    ok: 'ठीक है',
    community_reports: 'सामुदायिक रिपोर्ट',
    crowdsourced_fraud_database: 'क्राउडसोर्स धोखाधड़ी डेटाबेस',
    total: 'कुल',
    recent_activity: 'हाल की गतिविधि',
    no_scans_yet: 'अभी तक कोई स्कैन नहीं',
  },
  ta: {
    security_dashboard: 'பாதுகாப்பு டாஷ்போர்டு',
    protection_status: 'பாதுகாப்பு நிலை',
    active: 'செயலில்',
    disabled: 'முடக்கப்பட்டது',
    total_scans: 'மொத்த ஸ்கேன்கள்',
    safe: 'பாதுகாப்பானது',
    suspicious: 'சந்தேகத்திற்குரியது',
    fraud_blocked: 'மோசடி தடுக்கப்பட்டது',
    threat_database: 'அச்சுறுத்தல் தரவுத்தளம்',
    local_heuristic_rules: 'உள்ளூர் ஹியூரிஸ்டிக் விதிகள்',
    up_to_date: 'புதுப்பிக்கப்பட்டது',
    device: 'சாதனம்',
    mobile_browser: 'மொபைல் உலாவி',
    desktop_browser: 'டெஸ்க்டாப் உலாவி',
    ok: 'சரி',
    community_reports: 'சமூக அறிக்கைகள்',
    crowdsourced_fraud_database: 'கூட்டு மூல மோசடி தரவுத்தளம்',
    total: 'மொத்தம்',
    recent_activity: 'சமீபத்திய செயல்பாடு',
    no_scans_yet: 'இன்னும் ஸ்கேன்கள் இல்லை',
  },
  kn: {
    security_dashboard: 'ಭದ್ರತಾ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    protection_status: 'ರಕ್ಷಣಾ ಸ್ಥಿತಿ',
    active: 'ಸಕ್ರಿಯ',
    disabled: 'ನಿಷ್ಕ್ರಿಯಗೊಳಿಸಲಾಗಿದೆ',
    total_scans: 'ಒಟ್ಟು ಸ್ಕ್ಯಾನ್‌ಗಳು',
    safe: 'ಸುರಕ್ಷಿತ',
    suspicious: 'ಸಂಶಯಾಸ್ಪದ',
    fraud_blocked: 'ವಂಚನೆ ನಿರ್ಬಂಧಿಸಲಾಗಿದೆ',
    threat_database: 'ಬೆದರಿಕೆ ಡೇಟಾಬೇಸ್',
    local_heuristic_rules: 'ಸ್ಥಳೀಯ ಹ್ಯೂರಿಸ್ಟಿಕ್ ನಿಯಮಗಳು',
    up_to_date: 'ನವೀಕೃತ',
    device: 'ಸಾಧನ',
    mobile_browser: 'ಮೊಬೈಲ್ ಬ್ರೌಸರ್',
    desktop_browser: 'ಡೆಸ್ಕ್‌ಟಾಪ್ ಬ್ರೌಸರ್',
    ok: 'ಸರಿ',
    community_reports: 'ಸಮುದಾಯ ವರದಿಗಳು',
    crowdsourced_fraud_database: 'ಕ್ರೌಡ್‌ಸೋರ್ಸ್ಡ್ ವಂಚನೆ ಡೇಟಾಬೇಸ್',
    total: 'ಒಟ್ಟು',
    recent_activity: 'ಇತ್ತೀಚಿನ ಚಟುವಟಿಕೆ',
    no_scans_yet: 'ಇನ್ನೂ ಸ್ಕ್ಯಾನ್‌ಗಳಿಲ್ಲ',
  },
  ml: {
    security_dashboard: 'സുരക്ഷാ ഡാഷ്‌ബോർഡ്',
    protection_status: 'സംരക്ഷണ നില',
    active: 'സജീവം',
    disabled: 'പ്രവർത്തനരഹിതം',
    total_scans: 'ആകെ സ്കാനുകൾ',
    safe: 'സുരക്ഷിതം',
    suspicious: 'സംശയാസ്പദം',
    fraud_blocked: 'വഞ്ചന തടഞ്ഞു',
    threat_database: 'ഭീഷണി ഡാറ്റാബേസ്',
    local_heuristic_rules: 'പ്രാദേശിക ഹ്യൂറിസ്റ്റിക് നിയമങ്ങൾ',
    up_to_date: 'കാലികമാണ്',
    device: 'ഉപകരണം',
    mobile_browser: 'മൊബൈൽ ബ്രൗസർ',
    desktop_browser: 'ഡെസ്ക്ടോപ്പ് ബ്രൗസർ',
    ok: 'ശരി',
    community_reports: 'കമ്മ്യൂണിറ്റി റിപ്പോർട്ടുകൾ',
    crowdsourced_fraud_database: 'ക്രൗഡ്‌സോഴ്‌സ്ഡ് വഞ്ചന ഡാറ്റാബേസ്',
    total: 'ആകെ',
    recent_activity: 'സമീപകാല പ്രവർത്തനം',
    no_scans_yet: 'ഇതുവരെ സ്കാനുകൾ ഇല്ല',
  },
};

export const communityT: Record<Language, Record<CommunityKey, string>> = {
  en: {
    community_fraud_reports: 'Community Fraud Reports',
    crowdsourced_banner: 'Crowdsourced fraud QR/URL/UPI database. Submit a report from the scan result screen.',
    search_reports: 'Search reports...',
    loading_reports: 'Loading reports...',
    no_reports_yet: 'No reports yet.',
    reported_risk_score: 'Reported risk score',
  },
  te: {
    community_fraud_reports: 'కమ్యూనిటీ మోసం నివేదికలు',
    crowdsourced_banner: 'క్రౌడ్‌సోర్స్డ్ మోసం QR/URL/UPI డేటాబేస్. స్కాన్ ఫలిత స్క్రీన్ నుండి నివేదికను సమర్పించండి.',
    search_reports: 'నివేదికలను వెతకండి...',
    loading_reports: 'నివేదికలు లోడ్ అవుతున్నాయి...',
    no_reports_yet: 'ఇంకా నివేదికలు లేవు.',
    reported_risk_score: 'నివేదించిన రిస్క్ స్కోర్',
  },
  hi: {
    community_fraud_reports: 'सामुदायिक धोखाधड़ी रिपोर्ट',
    crowdsourced_banner: 'क्राउडसोर्स धोखाधड़ी QR/URL/UPI डेटाबेस। स्कैन परिणाम स्क्रीन से रिपोर्ट सबमिट करें।',
    search_reports: 'रिपोर्ट खोजें...',
    loading_reports: 'रिपोर्ट लोड हो रही हैं...',
    no_reports_yet: 'अभी तक कोई रिपोर्ट नहीं।',
    reported_risk_score: 'रिपोर्ट किया गया जोखिम स्कोर',
  },
  ta: {
    community_fraud_reports: 'சமூக மோசடி அறிக்கைகள்',
    crowdsourced_banner: 'கூட்டு மூல மோசடி QR/URL/UPI தரவுத்தளம். ஸ்கேன் முடிவு திரையில் இருந்து அறிக்கை சமர்ப்பிக்கவும்.',
    search_reports: 'அறிக்கைகளைத் தேடு...',
    loading_reports: 'அறிக்கைகள் ஏற்றப்படுகின்றன...',
    no_reports_yet: 'இன்னும் அறிக்கைகள் இல்லை.',
    reported_risk_score: 'தெரிவிக்கப்பட்ட ஆபத்து மதிப்பெண்',
  },
  kn: {
    community_fraud_reports: 'ಸಮುದಾಯ ವಂಚನೆ ವರದಿಗಳು',
    crowdsourced_banner: 'ಕ್ರೌಡ್‌ಸೋರ್ಸ್ಡ್ ವಂಚನೆ QR/URL/UPI ಡೇಟಾಬೇಸ್. ಸ್ಕ್ಯಾನ್ ಫಲಿತಾಂಶ ಪರದೆಯಿಂದ ವರದಿ ಸಲ್ಲಿಸಿ.',
    search_reports: 'ವರದಿಗಳನ್ನು ಹುಡುಕಿ...',
    loading_reports: 'ವರದಿಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...',
    no_reports_yet: 'ಇನ್ನೂ ವರದಿಗಳಿಲ್ಲ.',
    reported_risk_score: 'ವರದಿ ಮಾಡಿದ ಅಪಾಯ ಸ್ಕೋರ್',
  },
  ml: {
    community_fraud_reports: 'കമ്മ്യൂണിറ്റി വഞ്ചന റിപ്പോർട്ടുകൾ',
    crowdsourced_banner: 'ക്രൗഡ്‌സോഴ്‌സ്ഡ് വഞ്ചന QR/URL/UPI ഡാറ്റാബേസ്. സ്കാൻ ഫലം സ്ക്രീനിൽ നിന്ന് ഒരു റിപ്പോർട്ട് സമർപ്പിക്കുക.',
    search_reports: 'റിപ്പോർട്ടുകൾ തിരയുക...',
    loading_reports: 'റിപ്പോർട്ടുകൾ ലോഡ് ചെയ്യുന്നു...',
    no_reports_yet: 'ഇതുവരെ റിപ്പോർട്ടുകൾ ഇല്ല.',
    reported_risk_score: 'റിപ്പോർട്ട് ചെയ്ത റിസ്ക് സ്കോർ',
  },
};

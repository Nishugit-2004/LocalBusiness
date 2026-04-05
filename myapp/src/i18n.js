import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation files
const resources = {
  en: {
    translation: {
      "hello": "Hello",
      "welcome": "Welcome to your local business connector",
      "discover": "Discover the Best Shops",
      "neighborhood": "Near Your Neighborhood",
      "search_placeholder": "Search securely by shop name...",
      "all_categories": "All Categories",
      "sign_up": "Sign Up Now",
      "sign_in": "Sign In",
      "logout": "Logout",
      "home": "Home",
      "signup_prompt": "Your neighborhood at your fingertips—discover local treasures online!",
      "signup_desc": "When you shop local, you’re not just buying a product — you’re backing a dream, a neighbor, a story. Mandi connects you to the heart of your community, one purchase at a time."
    }
  },
  kn: {
    translation: {
      "hello": "ನಮಸ್ಕಾರ",
      "welcome": "ನಿಮ್ಮ ಸ್ಥಳೀಯ ವ್ಯಾಪಾರ ಕನೆಕ್ಟರ್‌ಗೆ ಸುಸ್ವಾಗತ",
      "discover": "ಅತ್ಯುತ್ತಮ ಅಂಗಡಿಗಳನ್ನು ಅನ್ವೇಷಿಸಿ",
      "neighborhood": "ನಿಮ್ಮ ನೆರೆಹೊರೆಯಲ್ಲಿ",
      "search_placeholder": "ಅಂಗಡಿ ಹೆಸರಿನ ಮೂಲಕ ಸುರಕ್ಷಿತವಾಗಿ ಹುಡುಕಿ...",
      "all_categories": "ಎಲ್ಲಾ ವರ್ಗಗಳು",
      "sign_up": "ಈಗಲೇ ಸೈನ್ ಅಪ್ ಮಾಡಿ",
      "sign_in": "ಸೈನ್ ಇನ್",
      "logout": "ಲಾಗ್ ಔಟ್",
      "home": "ಮುಖಪುಟ",
      "signup_prompt": "ನಿಮ್ಮ ನೆರೆಹೊರೆ ನಿಮ್ಮ ಬೆರಳ ತುದಿಯಲ್ಲಿ - ಸ್ಥಳೀಯ ಸಂಪತ್ತನ್ನು ಆನ್‌ಲೈನ್‌ನಲ್ಲಿ ಅನ್ವೇಷಿಸಿ!",
      "signup_desc": "ನೀವು ಸ್ಥಳೀಯವಾಗಿ ಖರೀದಿಸಿದಾಗ, ನೀವು ಕೇವಲ ಒಂದು ಉತ್ಪನ್ನವನ್ನು ಖರೀದಿಸುವುದಿಲ್ಲ - ನೀವು ಒಂದು ಕನಸು, ಒಬ್ಬ ನೆರೆಯವ ಮತ್ತು ಒಂದು ಕಥೆಯನ್ನು ಬೆಂಬಲಿಸುತ್ತಿದ್ದೀರಿ."
    }
  },
  hi: {
    translation: {
      "hello": "नमस्ते",
      "welcome": "आपके स्थानीय व्यवसाय कनेक्टर में आपका स्वागत है",
      "discover": "सर्वश्रेष्ठ दुकानों की खोज करें",
      "neighborhood": "आपके पड़ोस के पास",
      "search_placeholder": "दुकान के नाम से सुरक्षित रूप से खोजें...",
      "all_categories": "सभी श्रेणियां",
      "sign_up": "अभी साइन अप करें",
      "sign_in": "साइन इन",
      "logout": "लॉग आउट",
      "home": "होम",
      "signup_prompt": "आपका पड़ोस आपकी उंगलियों पर - स्थानीय खजाने को ऑनलाइन खोजें!",
      "signup_desc": "जब आप स्थानीय स्तर पर खरीदारी करते हैं, तो आप केवल एक उत्पाद नहीं खरीद रहे होते हैं - आप एक सपने, एक पड़ोसी, एक कहानी का समर्थन कर रहे होते हैं।"
    }
  },
  te: {
    translation: {
      "hello": "నమస్కారం",
      "welcome": "మీ స్థానిక వ్యాపార కనెక్టర్‌కు స్వాగతం",
      "discover": "ఉత్తమ దుకాణాలను కనుగొనండి",
      "neighborhood": "మీ పరిసరాల్లో",
      "search_placeholder": "దుకాణం పేరుతో సురక్షితంగా శోధించండి...",
      "all_categories": "అన్ని వర్గాలు",
      "sign_up": "ఇప్పుడే సైన్ అప్ చేయండి",
      "sign_in": "సైన్ ఇన్",
      "logout": "లాగ్ అవుట్",
      "home": "హోమ్",
      "signup_prompt": "మీ పరిసరాలు మీ వేలిముద్రపై - స్థానిక సంపదను ఆన్‌లైన్‌లో కనుగొనండి!",
      "signup_desc": "మీరు స్థానికంగా షాపింగ్ చేసినప్పుడు, మీరు కేవలం ఒక ఉత్పత్తిని కొనడం లేదు - మీరు ఒక కల, ఒక పొరుగువాడు, ఒక కథను సమర్థిస్తున్నారు."
    }
  },
  ta: {
    translation: {
      "hello": "வணக்கம்",
      "welcome": "உங்கள் உள்ளூர் வணிக இணைப்பிற்கு வரவேற்கிறோம்",
      "discover": "சிறந்த கடைகளைக் கண்டறியவும்",
      "neighborhood": "உங்கள் சுற்றுப்புறத்திற்கு அருகில்",
      "search_placeholder": "கடையின் பெயரைப் பயன்படுத்தி பாதுகாப்பாகத் தேடுங்கள்...",
      "all_categories": "அனைத்து பிரிவுகள்",
      "sign_up": "இப்போது பதிவு செய்யுங்கள்",
      "sign_in": "உள்நுழைய",
      "logout": "வெளியேறு",
      "home": "முகப்பு",
      "signup_prompt": "உங்கள் சுற்றுப்புறம் உங்கள் விரல் நுனியில் — உள்ளூர் பொக்கிஷங்களை ஆன்லைனில் கண்டறியவும்!",
      "signup_desc": "நீங்கள் உள்ளூரில் பொருட்களை வாங்கும்போது, நீங்கள் ஒரு பொருளை மட்டும் வாங்குவதில்லை — நீங்கள் ஒரு கனவு, ஒரு பக்கத்து வீட்டுக்காரர், ஒரு கதையை ஆதரிக்கிறீர்கள்."
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    detection: {
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage'],
    },
  });

export default i18n;

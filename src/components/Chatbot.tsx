import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  MessageSquare, 
  ChevronDown,
  Navigation,
  Compass,
  Bus,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  { label: '🚌 لاہور تا اسلام آباد بسیں', prompt: 'لاہور سے اسلام آباد کے لیے کون کون سی بس سروسز دستیاب ہیں اور ان کے اوقات کیا ہیں؟' },
  { label: '💰 سستی ترین بس سروس', prompt: 'لاہور سے ملتان یا فیصل آباد کے لیے سب سے کم کرائے والی کون سی بسیں چلتی ہیں؟' },
  { label: '🛣️ موٹروے فوگ گائیڈنس', prompt: 'سردیوں میں رات کے وقت موٹروے پر سفر کے لیے کیا احتیاطی تدابیر اور معلومات ہیں؟' },
  { label: '🎒 سامان اور چھوٹ پالیسی', prompt: 'بسوں میں سامان کی کیا حد ہوتی ہے اور کیا طلباء (Students) یا بزرگوں کے لیے کوئی رعایت ہے؟' },
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: `السلام علیکم! 🇵🇰\nمیں **آسان سفر کا ورچوئل ٹریول اسسٹنٹ** ہوں۔\n\nآپ مجھ سے پاکستان کے تمام بس روٹس، کرائے، روانگی کے اوقات، ٹرمینل کے پتے یا سفری تجاویز کے بارے میں اردو یا انگلش میں پوچھ سکتے ہیں۔\n\nآج آپ کہاں کا سفر کرنا چاہتے ہیں؟`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, messages]);

  // Intelligent offline Urdu matching engine for static hosting environments (like GitHub Pages)
  const getLocalResponse = (query: string): string => {
    const text = query.toLowerCase().trim();
    
    // 1. Greetings / Salam
    if (
      text.includes('salam') || 
      text.includes('hello') || 
      text.includes('hi') || 
      text.includes('سلام') || 
      text.includes('ہیلو') || 
      text.includes('اسلام علیکم') ||
      text.includes('آج آپ کہاں کا سفر کرنا چاہتے ہیں')
    ) {
      return `وعلیکم السلام! 🌸\n\nمیں **آسان سفر کا سمارٹ ٹریول اسسٹنٹ** ہوں۔\n\nآپ مجھ سے پاکستان کے کسی بھی بس روٹ کے اوقات، کرائے، اڈوں کے پتے، سامان کی پالیسی، اور طلباء کے لیے ڈسکاؤنٹس کی تفصیلات اردو یا انگلش میں پوچھ سکتے ہیں۔\n\nآج آپ کہاں کا سفر کرنا چاہتے ہیں؟`;
    }
    
    // 2. Lahore to Islamabad / Rawalpindi
    if (
      (text.includes('lahore') || text.includes('لاہور')) && 
      (text.includes('islamabad') || text.includes('pindi') || text.includes('rawalpindi') || text.includes('اسلام آباد') || text.includes('راولپنڈی') || text.includes('پنڈی'))
    ) {
      return `🚌 **لاہور تا اسلام آباد / راولپنڈی بس معلومات:**\n\n* **روانگی کے اوقات:** 24 گھنٹے دستیاب ہے (ہر 30 منٹ بعد ایک لگژری بس روانہ ہوتی ہے)۔\n* **مقبول سروسز:** فیصل موورز (Faisal Movers)، ڈیوو ایکسپریس (Daewoo)، روڈ ماسٹر (Road Master)۔\n* **اندازاً کرایہ:** \n  * سٹینڈرڈ/ایگزیکٹو: 1,600 سے 1,950 روپے\n  * بزنس/لگزری: 2,400 سے 2,850 روپے\n* **سفر کا دورانیہ:** موٹروے M2 کے ذریعے تقریباً 4.5 سے 5 گھنٹے۔\n* **لاہور ٹرمینل:** بند روڈ (Band Road) اور نیازی اڈا ٹرمینل۔\n* **راولپنڈی ٹرمینل:** فیض آباد (Faizabad) ٹرمینل یا پشاور روڈ۔`;
    }
    
    // 3. Lahore to Multan
    if (
      (text.includes('lahore') || text.includes('لاہور')) && 
      (text.includes('multan') || text.includes('ملتان'))
    ) {
      return `🚌 **لاہور تا ملتان بس معلومات:**\n\n* **روانگی کے اوقات:** صبح 5:00 بجے سے رات 12:00 بجے تک (ہر 45 منٹ بعد بس روانہ ہوتی ہے)۔\n* **مقبول سروسز:** فیصل موورز، نیازی ایکسپریس، ڈیوو ایکسپریس، روڈ ماسٹر۔\n* **اندازاً کرایہ:** \n  * ایگزیکٹو کلاس: 1,350 سے 1,550 روپے\n  * بزنس/سلیپر کلاس: 1,900 سے 2,100 روپے\n* **سفر کا دورانیہ:** موٹروے M3 کے ذریعے تقریباً 4 گھنٹے۔\n* **ٹرمینلز:** لاہور بند روڈ، اور ملتان میں وہاڑی چوک (Vehari Chowk) ٹرمینل۔`;
    }

    // 4. Lahore to Faisalabad
    if (
      (text.includes('lahore') || text.includes('لاہور')) && 
      (text.includes('faisalabad') || text.includes('lyallpur') || text.includes('فیصل آباد'))
    ) {
      return `🚌 **لاہور تا فیصل آباد بس معلومات:**\n\n* **روانگی کے اوقات:** صبح 6:00 بجے سے رات 11:30 بجے تک (ہر 30 منٹ بعد سروس دستیاب ہے)۔\n* **مقبول سروسز:** فیصل موورز، کوہستان ایکسپریس، ڈیوو ایکسپریس۔\n* **اندازاً کرایہ:** 850 سے 1,150 روپے (بس کیٹگری اور روٹ کے مطابق)۔\n* **سفر کا دورانیہ:** موٹروے M3 کے ذریعے تقریباً 2 سے 2.5 گھنٹے۔\n* **ٹرمینلز:** لاہور بند روڈ، اور فیصل آباد موٹروے انٹرچینج ٹرمینل۔`;
    }

    // 5. Lahore to Karachi / Karachi to Lahore
    if (
      (text.includes('karachi') || text.includes('کراچی')) && 
      (text.includes('lahore') || text.includes('لاہور'))
    ) {
      return `🚌 **لاہور تا کراچی (اور کراچی تا لاہور) بس معلومات:**\n\n* **روانگی کے اوقات:** روزانہ مخصوص اوقات (صبح 8:00، دوپہر 2:00، شام 6:00، اور رات 10:00 بجے)۔\n* **مقبول سروسز:** فیصل موورز (صوفیانہ پلس)، ڈیوو ایکسپریس، کائنات ٹریولز، السرحد۔\n* **اندازاً کرایہ:** \n  * سلیپر بس (Sleeper): 5,800 سے 6,800 روپے\n  * ایگزیکٹو پلس: 4,200 سے 4,600 روپے\n* **سفر کا دورانیہ:** موٹروے M5 اور نیشنل ہائی وے کے ذریعے تقریباً 14 سے 16 گھنٹے۔\n* **ٹرمینلز:** لاہور بند روڈ، اور کراچی سہراب گوٹھ (Sohrab Goth) ٹرمینل۔`;
    }

    // 6. Lahore to Sargodha
    if (
      (text.includes('lahore') || text.includes('لاہور')) && 
      (text.includes('sargodha') || text.includes('سرگودھا'))
    ) {
      return `🚌 **لاہور تا سرگودھا بس معلومات:**\n\n* **روانگی کے اوقات:** صبح 6:00 بجے سے رات 10:00 بجے تک (ہر ایک گھنٹے بعد بس)۔\n* **مقبول سروسز:** فیصل موورز، گوندل ٹریولز، لکی ٹرانسپورٹ۔\n* **اندازاً کرایہ:** 800 سے 1,000 روپے تک۔\n* **سفر کا دورانیہ:** موٹروے کے ذریعے تقریباً 2.5 سے 3 گھنٹے۔\n* **ٹرمینلز:** لاہور بند روڈ، اور سرگودھا جنرل بس سٹینڈ۔`;
    }

    // 7. Luggage / Samaan / Weight
    if (
      text.includes('luggage') || 
      text.includes('samaan') || 
      text.includes('weight') || 
      text.includes('سامان') || 
      text.includes('وزن') || 
      text.includes('حد') ||
      text.includes('baggage')
    ) {
      return `🎒 **سامان کی حد اور وزن (Luggage Policy):**\n\n* **مفت حد (Free Weight Limit):** ہر مسافر اپنے ساتھ **30 کلوگرام** تک سامان بالکل مفت بس کے سامان والے حصے (Cargo Hold) میں لے جا سکتا ہے۔\n* **ہینڈ بیگ (Hand Carry):** آپ اپنے ساتھ ایک چھوٹا ہینڈ بیگ یا لیپ ٹاپ بیگ بس کے کیبن کے اندر بھی لے جا سکتے ہیں۔\n* **اضافی سامان (Extra Weight):** 30 کلوگرام سے زائد سامان پر اضافی چارجز لاگو ہوتے ہیں جو کہ عام طور پر **20 سے 50 روپے فی کلوگرام** (آپریٹر اور سفر کے فاصلے کے لحاظ سے) ہوتے ہیں۔\n* **ممنوعہ اشیاء:** خطرناک کیمیکلز، گیس سلنڈر، آتش گیر مادہ، اور غیر قانونی اشیاء بس میں لے جانے کی سخت ممانعت ہے۔`;
    }

    // 8. Student Discount / Discount / Concession / Sasta
    if (
      text.includes('student') || 
      text.includes('discount') || 
      text.includes('concession') || 
      text.includes('رعایت') || 
      text.includes('طلباء') || 
      text.includes('طالب علم') || 
      text.includes('بزرگ') || 
      text.includes('سستا') ||
      text.includes('بزرگوں')
    ) {
      return `🎓 **طلبا اور بزرگ شہریوں کے لیے کرایوں میں رعایت (Discounts):**\n\n* **طلبا (Students):** فیصل موورز (Faisal Movers) اور ڈیوو ایکسپریس (Daewoo) طلبہ کے لیے **10% سے 15% تک کی رعایت** دیتے ہیں۔\n  * **شرائط:** آپ کے پاس اپنی یونیورسٹی یا کالج کا **اصل اسٹوڈنٹ کارڈ (Original Student ID Card)** ہونا لازمی ہے۔\n  * **دن:** یہ ڈسکاؤنٹ عام طور پر پیر سے جمعرات (Monday to Thursday) تک سفر کرنے پر ملتا ہے، جبکہ ویک اینڈ (جمعہ تا اتوار) پر یہ رعایت لاگو نہیں ہوتی۔\n* **بزرگ شہری (Senior Citizens):** 65 سال سے زائد عمر کے بزرگ شہریوں کو بھی قومی شناختی کارڈ (CNIC) دکھانے پر ٹکٹ کے کرائے میں خصوصاً **10% سے 15% تک ڈسکاؤنٹ** دیا جاتا ہے۔`;
    }

    // 9. Fog / Motorway Closure / Weather
    if (
      text.includes('fog') || 
      text.includes('dhund') || 
      text.includes('weather') || 
      text.includes('فوگ') || 
      text.includes('دھند') || 
      text.includes('موٹروے') || 
      text.includes('بند') ||
      text.includes('موسم')
    ) {
      return `🌫️ **شدید دھند (Fog) اور موٹروے بندش کی معلومات:**\n\n* **موٹروے بندش:** سردیوں کے موسم میں (خصوصاً نومبر سے فروری کے دوران) شدید دھند اور زیرو ویزیبلٹی کی وجہ سے موٹرویز (M2, M3, M4, M5) کو رات 10:00 بجے سے صبح 9:00 بجے تک عارضی طور پر بند کر دیا جاتا ہے۔\n* **آسان سفر ٹرپ تجاویز:**\n  1. رات کے وقت سفر کرنے سے پرہیز کریں اور ہمیشہ دن کی روشنی (صبح 10:00 سے شام 4:00 بجے) میں سفر کا انتخاب کریں۔\n  2. سفر شروع کرنے سے پہلے موٹروے پولیس کی آفیشل ہیلپ لائن **130** پر رابطہ کر کے روٹ کی تازہ ترین صورتحال جان لیں۔\n  3. بس سروس کے ہیلپ لائن نمبرز پر کال کر کے تصدیق کر لیں کہ کیا بسیں موٹروے کے بجائے متبادل روٹ (جی ٹی روڈ) استعمال کر رہی ہیں۔`;
    }

    // 10. Booking / Tickets / Contact
    if (
      text.includes('book') || 
      text.includes('ticket') || 
      text.includes('seat') || 
      text.includes('رابطہ') || 
      text.includes('بکنگ') || 
      text.includes('ٹکٹ') || 
      text.includes('سیٹ')
    ) {
      return `🎫 **ٹکٹ بکنگ اور آن لائن سیٹ ریزرویشن کی معلومات:**\n\nآسان سفر پاکستان بھر کے نان-اے سی اور اے سی بسوں کے اوقات اور کرایوں کا موازنہ فراہم کرتا ہے۔ آن لائن سیٹ بک کرنے کے لیے آپ درج ذیل ذرائع استعمال کر سکتے ہیں:\n\n1. **موبائل ایپس:** اپنے فون پر **Bookme.pk**, **Bookkaru**, یا **Sastaticket** کی آفیشل ایپ ڈاؤن لوڈ کریں۔\n2. **آفیشل پورٹلز:** فیصل موورز کی آن لائن بکنگ کے لیے \`bookkaru.com\` اور ڈیوو ایکسپریس کے لیے \`daewoo.com.pk\` پر جائیں۔\n3. **ٹرمینل بکنگ:** آپ قریبی بس ٹرمینل پر جا کر براہِ راست ٹکٹ کاؤنٹر سے بھی موقع پر سیٹیں حاصل کر سکتے ہیں۔`;
  }

    // Default generic helpful fallback reply
    return `🚌 **آسان سفر اسسٹنٹ گائیڈ:**\n\nمیں نے آپ کا سوال موصول کر لیا ہے! آسان سفر پر پاکستان کے تمام بڑے بس روٹس، اوقات اور سستے کرایوں کی تصدیق شدہ تفصیلات موجود ہیں۔\n\nسفری معلومات حاصل کرنے کے لیے آپ نیچے لکھ سکتے ہیں، مثال کے طور پر:\n* **"لاہور سے ملتان کا کرایہ اور بسیں"**\n* **"بسوں میں سامان کی کیا حد ہوتی ہے؟"**\n* **"طلبا (Students) کے لیے ڈسکاؤنٹ کی کیا شرط ہے؟"**\n* **"سردیوں میں دھند کی صورت میں کیا احتیاط کرنی چاہیے؟"**`;
  };

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input.trim();
    if (!textToSend || loading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!customPrompt) setInput('');
    setLoading(true);

    // Abort controller to prevent infinite hanging/loading state on the client side
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 seconds maximum wait before failing over

    try {
      // Format history for server API
      const historyPayload = messages.slice(-6).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: historyPayload
        })
      });

      clearTimeout(timeoutId);

      // Verify content-type to fail-fast if static host redirected the API route to index.html
      const contentType = res.headers.get('content-type');
      if (!res.ok || !contentType || !contentType.includes('application/json')) {
        throw new Error('Server API not available (static host fallback active)');
      }

      const data = await res.json();
      const botReply = data.reply || data.error || 'معذرت، رابطہ قائم نہیں ہو سکا۔ دوبارہ کوشش کریں۔';

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      clearTimeout(timeoutId);
      console.log('Chat fallback activated (running intelligent offline engine):', err);
      
      // Get beautiful localized offline Urdu travel reply matching the user intent
      const botReply = getLocalResponse(textToSend);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: botReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'گفتگو دوبارہ شروع ہو گئی ہے۔ آپ مجھ سے بسوں، کرایوں یا ٹرمینلز کے بارے میں کوئی بھی نیا سوال پوچھ سکتے ہیں۔',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const renderFormattedText = (text: string) => {
    // Format basic bold, bullet points and linebreaks cleanly
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      // Bold parser
      const parts = line.split(/(\*\*.*?\*\*)/g);
      const formattedParts = parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={pIdx} className="font-bold text-emerald-950 dark:text-emerald-300">{part.slice(2, -2)}</strong>;
        }
        return part;
      });

      if (line.trim().startsWith('* ') || line.trim().startsWith('- ')) {
        return (
          <li key={idx} className="ml-4 list-disc my-1 leading-relaxed">
            {formattedParts}
          </li>
        );
      }

      return (
        <p key={idx} className={`${line.trim() === '' ? 'h-2' : 'my-1'} leading-relaxed`}>
          {formattedParts}
        </p>
      );
    });
  };

  return (
    <div id="asaansafar-ai-chatbot" className="fixed bottom-6 right-6 z-[80] font-sans">
      {/* Floating Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            aria-label="Open AsaanSafar AI Travel Assistant"
            className="group relative flex items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white px-5 py-3.5 rounded-full shadow-2xl shadow-emerald-900/30 border border-emerald-400/40 transition-all duration-300"
          >
            {/* Pulsing ring indicator */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400 border-2 border-white"></span>
            </span>

            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-emerald-100 group-hover:rotate-12 transition-transform" />
            </div>

            <div className="text-left">
              <div className="text-xs font-black uppercase tracking-wider text-emerald-100 flex items-center gap-1.5">
                <span>AI Travel Guide</span>
                <span className="inline-block px-1.5 py-0.2 bg-emerald-400/30 text-[10px] rounded font-bold">24/7</span>
              </div>
              <div className="text-sm font-black text-white">آسان سفر اسسٹنٹ</div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Chat Box */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-800 p-4 text-white flex items-center justify-between shadow-md relative overflow-hidden">
              {/* Background ambient pattern */}
              <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

              <div className="flex items-center gap-3 relative z-10">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/25 shadow-inner">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-emerald-700 rounded-full" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base tracking-tight leading-tight">AsaanSafar AI Guide</h3>
                    <span className="text-[10px] font-black uppercase bg-emerald-400/25 px-2 py-0.5 rounded-full text-emerald-100 border border-emerald-300/30">
                      AsaanSafar
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100/90 font-medium">آن لائن • سمارٹ ٹریول گائیڈ</p>
                </div>
              </div>

              <div className="flex items-center gap-1 relative z-10">
                <button
                  onClick={handleResetChat}
                  title="نئی گفتگو (Reset Chat)"
                  className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/15 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="بند کریں (Close)"
                  className="p-2 rounded-xl text-emerald-100 hover:text-white hover:bg-white/15 transition-colors"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Prompts Carousel */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-2.5 border-b border-slate-100 dark:border-slate-800 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
              {QUICK_PROMPTS.map((qp, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(qp.prompt)}
                  disabled={loading}
                  className="whitespace-nowrap text-xs font-bold px-3 py-1.5 rounded-full bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600 hover:border-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/50 transition-all shadow-2xs shrink-0"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/40 dark:bg-slate-900/40 text-slate-800 dark:text-slate-200 text-sm">
              {messages.map((msg) => {
                const isAssistant = msg.role === 'assistant';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 shadow-xs relative group ${
                        isAssistant
                          ? 'bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-sm'
                          : 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-tr-sm shadow-emerald-900/10'
                      }`}
                    >
                      <div className="text-[13.5px]">
                        {renderFormattedText(msg.content)}
                      </div>

                      {/* Message Footer */}
                      <div
                        className={`flex items-center justify-between gap-3 mt-2 text-[10px] ${
                          isAssistant ? 'text-slate-400' : 'text-emerald-200'
                        }`}
                      >
                        <span>{msg.timestamp}</span>
                        {isAssistant && (
                          <button
                            onClick={() => handleCopy(msg.id, msg.content)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400"
                            title="Copy reply"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-emerald-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Typing indicator */}
              {loading && (
                <div className="flex items-start gap-2">
                  <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-tl-sm p-3.5 shadow-xs flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      آسان سفر جواب تیار کر رہا ہے
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="یہاں سوال لکھیں (مثلاً: لاہور سے ملتان بس؟)..."
                    disabled={loading}
                    className="w-full pl-4 pr-3 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 outline-hidden transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white p-2.5 rounded-xl transition-all shadow-md shadow-emerald-900/10 disabled:shadow-none flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed"
                  title="بھیجیں (Send)"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              <div className="text-[10px] text-center text-slate-400 mt-1.5 font-medium">
                AsaanSafar AI Travel Guide • Powered by AsaanSafar
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

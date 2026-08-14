import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Bot,
  Send,
  Sparkles,
  Package,
  MapPin,
  Phone,
  DollarSign,
  Navigation,
  Compass,
  CheckCircle2,
  HelpCircle,
  Clock,
  Mic,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { DeliveryParcel, AIAssistantMessage, ScreenType } from '../types';

interface AIAssistantViewProps {
  deliveries: DeliveryParcel[];
  onNavigateBack: () => void;
  onNavigateToScreen: (screen: ScreenType) => void;
}

export const AIAssistantView: React.FC<AIAssistantViewProps> = ({
  deliveries,
  onNavigateBack,
  onNavigateToScreen
}) => {
  const [messages, setMessages] = useState<AIAssistantMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: 'မင်္ဂလာပါ! ကျွန်တော်က RexGo Delivery AI Assistant ဖြစ်ပါတယ်။ ယနေ့ ပို့ဆောင်ရမည့် ပါဆယ်များ၊ လမ်းကြောင်းများနှင့် ပတ်သက်ပြီး မေးမြန်းနိုင်ပါသည်ခင်ဗျာ။',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Context Metrics computed from real delivery state
  const totalParcels = deliveries.length;
  const completedParcels = deliveries.filter(d => d.status === 'Completed').length;
  const pendingParcels = deliveries.filter(d => d.status === 'Pending').length;
  const nextPending = deliveries.find(d => d.status === 'Pending');
  const totalCod = deliveries.reduce((sum, d) => sum + (d.codAmount || 0), 0);
  const collectedCod = deliveries
    .filter(d => d.status === 'Completed')
    .reduce((sum, d) => sum + (d.codAmount || 0), 0);
  const pendingCod = totalCod - collectedCod;

  // On-Device NLP Rule Engine (100% Offline Capable)
  const processLocalQuery = (query: string): AIAssistantMessage => {
    const q = query.toLowerCase().trim();
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Remaining parcels count
    if (q.includes('ကျန်') || q.includes('ဘယ်နှစ်') || q.includes('စာရင်း') || q.includes('remaining')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `ယနေ့ စုစုပေါင်း ပါဆယ် (${totalParcels}) ခုအနက် (${completedParcels}) ခု ပို့ဆောင်ပြီးစီးကာ (${pendingParcels}) ခု ပို့ရန် ကျန်ရှိနေပါသည်ခင်ဗျာ။`,
        timestamp: timeStr,
        intent: 'summary',
        actionLink: { screen: 'today_delivery', label: 'ပါဆယ်စာရင်း ကြည့်မည်' },
        metrics: { remaining: pendingParcels }
      };
    }

    // 2. Next customer / Next stop
    if (q.includes('နောက်') || q.includes('next') || q.includes('ဘယ်သူ') || q.includes('သွားရမလဲ')) {
      if (nextPending) {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: `နောက်ထပ် သွားရမည့် ဖောက်သည်မှာ "${nextPending.customerName}" ဖြစ်ပြီး လိပ်စာမှာ "${nextPending.township}၊ ${nextPending.address}" ဖြစ်ပါသည်။ ဖုန်း - ${nextPending.phone || nextPending.normalizedPhone}။`,
          timestamp: timeStr,
          intent: 'next_stop',
          actionLink: { screen: 'map_route', label: 'မြေပုံလမ်းကြောင်း ကြည့်မည်' },
          metrics: {
            nextStopName: nextPending.customerName,
            nextStopPhone: nextPending.phone || nextPending.normalizedPhone
          }
        };
      } else {
        return {
          id: `msg-${Date.now()}`,
          sender: 'assistant',
          text: 'ဂုဏ်ယူပါသည်! ယနေ့ ပို့ဆောင်ရန် ကျန်ရှိသော ပါဆယ်များ အားလုံး ပြီးစီးသွားပါပြီခင်ဗျာ။',
          timestamp: timeStr,
          intent: 'summary'
        };
      }
    }

    // 3. COD Amount
    if (q.includes('cod') || q.includes('ငွေ') || q.includes('ကျပ်') || q.includes('money') || q.includes('ကောက်')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `ယနေ့ စုစုပေါင်း ကောက်ခံရန် COD မှာ ${totalCod.toLocaleString()} ကျပ်ဖြစ်ပြီး၊ ကောက်ခံပြီးစီးငွေ ${collectedCod.toLocaleString()} ကျပ်၊ ကောက်ခံရန်ကျန်ငွေ ${pendingCod.toLocaleString()} ကျပ် ဖြစ်ပါသည်ခင်ဗျာ။`,
        timestamp: timeStr,
        intent: 'cod',
        actionLink: { screen: 'today_delivery', label: 'COD အသေးစိတ် စစ်ဆေးမည်' },
        metrics: { codAmount: pendingCod }
      };
    }

    // 4. Route optimization
    if (q.includes('လမ်းကြောင်း') || q.includes('route') || q.includes('မြေပုံ') || q.includes('map') || q.includes('အမြန်')) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `၄၀+ ပါဆယ် လမ်းကြောင်းကို TSP Algorithm ဖြင့် စက္ကန့်ပိုင်းအတွင်း အတိုဆုံး စီစဉ်တွက်ချက်ထားပြီး ဖြစ်ပါသည်။`,
        timestamp: timeStr,
        intent: 'optimize',
        actionLink: { screen: 'map_route', label: 'အမြန်ဆုံး လမ်းကြောင်း ဖွင့်မည်' }
      };
    }

    // Default Fallback
    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: `သင်မေးမြန်းသော အကြောင်းအရာကို နားလည်ပါသည်။ ယနေ့ ပို့ဆောင်ရန် ပါဆယ် (${pendingParcels}) ခု ကျန်ရှိပြီး စုစုပေါင်း COD (${pendingCod.toLocaleString()} Ks) ကောက်ခံရန် ရှိပါသည်။`,
      timestamp: timeStr,
      intent: 'general',
      actionLink: { screen: 'today_delivery', label: 'ယနေ့ ပို့ဆောင်မှုများ' }
    };
  };

  const handleSendMessage = async (customQuery?: string) => {
    const query = customQuery || inputText;
    if (!query.trim()) return;

    const userMsg: AIAssistantMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // 1. Try server-side Gemini 2.5 Flash API
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userQuery: query,
          contextData: {
            totalParcels,
            completedParcels,
            pendingParcels,
            totalCod,
            collectedCod,
            nextStopName: nextPending?.customerName,
            nextStopAddress: `${nextPending?.township}, ${nextPending?.address}`,
            nextStopPhone: nextPending?.phone || nextPending?.normalizedPhone,
            parcelsSummary: deliveries.slice(0, 10).map(d => ({
              name: d.customerName,
              township: d.township,
              status: d.status,
              cod: d.codAmount
            }))
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.reply && !data.isOffline) {
          const aiMsg: AIAssistantMessage = {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            text: data.reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setMessages(prev => [...prev, aiMsg]);
          setIsLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Gemini API unreachable, falling back to on-device NLP:', err);
    }

    // 2. Fallback to Local Rule Engine
    setTimeout(() => {
      const localResponse = processLocalQuery(query);
      setMessages(prev => [...prev, localResponse]);
      setIsLoading(false);
    }, 250);
  };

  const quickPrompts = [
    { label: '📦 ကျန်ရှိနေသော ပါဆယ်စာရင်း', text: 'ယနေ့ ပို့ဆောင်ရန် ပါဆယ် ဘယ်နှစ်ခု ကျန်ရှိပါသလဲ?' },
    { label: '📍 နောက်ထပ် သွားရမည့် ဖောက်သည်', text: 'နောက်ထပ် သွားရမည့် ဖောက်သည် အချက်အလက် ပြောပြပါ' },
    { label: '💰 ကောက်ခံရမည့် COD ငွေပမာဏ', text: 'ယနေ့ စုစုပေါင်း ကောက်ခံရန် COD ငွေပမာဏ ဘယ်လောက်ရှိပါသလဲ?' },
    { label: '🗺️ အမြန်ဆုံး ပို့ဆောင်ရေး လမ်းကြောင်း', text: 'အမြန်ဆုံး ပို့ဆောင်နိုင်မည့် လမ်းကြောင်း အစီအစဉ် ပြပေးပါ' }
  ];

  return (
    <div className="w-full h-full bg-[#0B0D13] text-slate-100 flex flex-col justify-between overflow-hidden">
      
      {/* Header */}
      <div className="bg-[#121620]/95 backdrop-blur-md px-4 py-3 border-b border-slate-800 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-cyan-400 text-black flex items-center justify-center shadow-lg shadow-cyan-500/20 font-bold">
              <Bot className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight flex items-center gap-1.5">
                <span>RexGo Copilot AI</span>
                <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[9px] font-bold">
                  Gemini Flash
                </span>
              </h2>
              <p className="text-[10px] text-slate-400">Courier Smart On-Demand Assistant</p>
            </div>
          </div>
        </div>

        <div className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Online</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[88%] ${
                isUser ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div
                className={`p-3 rounded-2xl text-xs leading-relaxed shadow-md ${
                  isUser
                    ? 'bg-cyan-500 text-black font-semibold rounded-br-none'
                    : 'bg-[#151A26] border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {/* Assistant header icon */}
                {!isUser && (
                  <div className="flex items-center gap-1 text-[10px] text-cyan-400 font-bold mb-1">
                    <Sparkles className="w-3 h-3" />
                    <span>RexGo AI</span>
                  </div>
                )}

                <p className="whitespace-pre-line">{msg.text}</p>

                {/* Optional Action Button inside bubble */}
                {msg.actionLink && (
                  <button
                    onClick={() => onNavigateToScreen(msg.actionLink!.screen)}
                    className="mt-2.5 w-full py-1.5 px-3 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Navigation className="w-3 h-3 text-cyan-400" />
                    <span>{msg.actionLink.label}</span>
                  </button>
                )}
              </div>

              <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-400 text-xs p-2 bg-[#151A26] rounded-xl border border-slate-800 w-fit">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
            <span>RexGo Copilot စဉ်းစားတွေးခေါ်နေပါသည်...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="bg-[#121620] px-3 py-2 border-t border-slate-800/80 overflow-x-auto flex items-center gap-1.5 scrollbar-none shrink-0">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.text)}
            className="shrink-0 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-[10.5px] font-bold text-slate-300 hover:text-white transition-all whitespace-nowrap active:scale-95"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="bg-[#0E1118] p-3 border-t border-slate-800 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="မေးခွန်း ရိုက်ထည့်ပါ (ဥပမာ - နောက်ဆုံးပို့ရမည့်သူ)..."
          className="flex-1 bg-slate-900/90 border border-slate-800 focus:border-cyan-500 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
        />

        <button
          onClick={() => handleSendMessage()}
          disabled={!inputText.trim() || isLoading}
          className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-black font-bold transition-all active:scale-95 shadow-md shadow-cyan-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

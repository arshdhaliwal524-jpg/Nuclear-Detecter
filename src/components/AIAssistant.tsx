import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Loader2, ShieldAlert } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SYSTEM_INSTRUCTION = `You are the Aegis Survival AI. Your purpose is to provide immediate, life-saving advice during a nuclear threat. 
Keep responses extremely concise, prioritized, and calm. 
Use bullet points for actions. 
Focus on: 
1. Finding immediate cover (underground, center of building).
2. Avoiding windows and glass.
3. Protection from fallout (don't look at the flash, stay inside for 24-48h).
4. Decontamination basics.
If the user asks about something else, remind them of the current emergency status.`;

export default function AIAssistant() {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Aegis Survival AI online. I am ready to provide immediate survival protocols. What is your current situation?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages, { role: 'user', content: userMessage }].map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
        }
      });

      const text = response.text || "I am having trouble connecting to the emergency network. Please find shelter immediately.";
      setMessages(prev => [...prev, { role: 'assistant', content: text }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'assistant', content: "CONNECTION ERROR. PRIORITY: FIND SHELTER. STAY AWAY FROM WINDOWS." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel overflow-hidden border-red-900/30">
      <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-red-950/20">
        <Bot className="w-5 h-5 text-red-500" />
        <h2 className="text-sm font-bold tracking-widest uppercase">Survival Assistant</h2>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] text-red-500 uppercase font-bold">Priority Link</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
      >
        {messages.map((m, i) => (
          <div key={i} className={cn(
            "flex gap-3 max-w-[90%]",
            m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
          )}>
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              m.role === 'user' ? "bg-white/10" : "bg-red-500/20"
            )}>
              {m.role === 'user' ? <User className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4 text-red-500" />}
            </div>
            <div className={cn(
              "p-3 rounded-xl text-sm leading-relaxed",
              m.role === 'user' ? "bg-white/5 text-white" : "bg-red-950/30 text-red-100 border border-red-500/20"
            )}>
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>
                  {m.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 mr-auto">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
              <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
            </div>
            <div className="p-3 rounded-xl bg-red-950/30 text-red-500/50 italic text-xs">
              Calculating survival protocols...
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-white/10 bg-black/40">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask for survival advice..."
            className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-4 pr-12 text-sm focus:outline-none focus:border-red-500/50 transition-colors"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="absolute right-2 p-1.5 text-red-500 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

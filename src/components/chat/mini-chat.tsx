'use client';

import { useChat } from '@ai-sdk/react';
import { useState } from 'react';
import { Send, Bot, User, MessageCircle, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function MiniChat() {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { messages, sendMessage } = useChat();
  
  // Check if the last message is from AI and is being generated
  const lastMessage = messages[messages.length - 1];
  const isLastMessageFromAI = lastMessage?.role === 'assistant';
  const isGeneratingResponse = isLastMessageFromAI && isLoading;
  
  const handleSendMessage = async (text: string) => {
    setIsLoading(true);
    try {
      await sendMessage({ text });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 p-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-50"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>

      {/* Mini Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-40 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-500 rounded-full">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">Powered by Gemini</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-3">
                  <Bot className="w-6 h-6 text-blue-500" />
                </div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Welcome!
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  How can I help you today?
                </p>
              </div>
            )}
            
            {messages.map(message => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start space-x-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-500' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-3 h-3 text-white" />
                    ) : (
                      <Bot className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                    )}
                  </div>
                  
                  <div className={`px-3 py-2 rounded-xl text-xs ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}>
                    <div className="whitespace-pre-wrap">
                      {message.role === 'user' ? (
                        // User messages - plain text
                        message.parts.map((part, i) => {
                          switch (part.type) {
                            case 'text':
                              return <div key={`${message.id}-${i}`}>{part.text}</div>;
                          }
                        })
                      ) : (
                        // AI messages - with Markdown support
                        <ReactMarkdown
                          components={{
                            // Custom styling for different markdown elements
                            h1: ({ children }) => <h1 className="text-sm font-bold mb-3 mt-2 first:mt-0">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-xs font-semibold mb-2 mt-3 first:mt-0">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xs font-medium mb-1.5 mt-2 first:mt-0">{children}</h3>,
                            p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-0.5 ml-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-0.5 ml-1">{children}</ol>,
                            li: ({ children }) => <li className="text-xs leading-relaxed">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                            code: ({ children }) => (
                              <code className="bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded text-xs font-mono">
                                {children}
                              </code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-gray-200 dark:bg-gray-600 p-2 rounded text-xs font-mono overflow-x-auto mb-2">
                                {children}
                              </pre>
                            ),
                            blockquote: ({ children }) => (
                              <blockquote className="border-l-2 border-gray-300 dark:border-gray-500 pl-2 italic mb-2">
                                {children}
                              </blockquote>
                            ),
                          }}
                        >
                          {message.parts.map((part, i) => {
                            switch (part.type) {
                              case 'text':
                                return part.text;
                            }
                          }).join('')}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Loading Indicator - Only show when not generating a response */}
            {isLoading && !isGeneratingResponse && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[85%]">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                    <Bot className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700">
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Form */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <form
              onSubmit={e => {
                e.preventDefault();
                if (input.trim() && !isLoading) {
                  handleSendMessage(input);
                  setInput('');
                }
              }}
              className="flex items-center space-x-2"
            >
              <input
                className="flex-1 px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:opacity-50"
                value={input}
                placeholder={isLoading ? "AI is responding..." : "Type your message..."}
                onChange={e => setInput(e.currentTarget.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-full transition-all duration-200 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 
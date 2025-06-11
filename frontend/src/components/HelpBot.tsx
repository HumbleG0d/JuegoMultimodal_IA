import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2, Maximize2, HelpCircle, Zap, Clock } from 'lucide-react';
import type { ChatBootMessage } from '../types';

const HelpBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
 
  const [messages, setMessages] = useState<ChatBootMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const quickResponses = [
    { icon: HelpCircle, text: 'Preguntas frecuentes', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
    { icon: Zap, text: 'Funciones principales', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
    { icon: Clock, text: 'Horarios de atención', color: 'bg-green-100 text-green-700 hover:bg-green-200' }
  ];

  // Fetch initial message from API when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setIsLoading(true);
      fetch('http://localhost:5000/chat/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            const initialMessage: ChatBootMessage = {
              id: data.session_id,
              type: "bot",
              text: data.response.message,
              time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
            };
            setMessages([initialMessage]);
          } else {
            setMessages([
              {
                id: 1,
                type: 'bot',
                text: 'Error al conectar con el asistente. Intenta de nuevo más tarde.',
                time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
              }
            ]);
          }
        })
        .catch((error) => {
          console.error('Error fetching initial message:', error);
          setMessages([
            {
              id: 1,
              type: 'bot',
              text: 'No se pudo conectar al servidor. Verifica tu conexión.',
              time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
            }
          ]);
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, messages.length]);

  const handleSendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatBootMessage = {
        id: messages.length + 1,
        type: "user",
        text: message,
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setMessage('');

      // Simular respuesta del bot
      setTimeout(() => {
        const botResponse: ChatBootMessage = {
          id: messages.length + 2,
          type: "bot",
          text: 'Gracias por tu mensaje. Un agente te responderá pronto. 🤖',
          time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, botResponse]);
      }, 1000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Botón flotante */}
      {!isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="group relative bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-full shadow-2xl cursor-pointer hover:shadow-3xl transform hover:scale-110 transition-all duration-300 animate-pulse"
        >
          <MessageCircle size={24} className="group-hover:rotate-12 transition-transform duration-300" />
          
          {/* Badge de notificación */}
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
            1
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            ¿Necesitas ayuda? ¡Haz clic aquí!
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div className={`bg-white rounded-2xl shadow-2xl border border-gray-200 ${isMinimized ? 'w-80 h-16' : 'w-80 h-96'} transition-all duration-300 overflow-hidden`}>
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  <Bot size={20} />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h3 className="font-semibold">Asistente Virtual</h3>
                <p className="text-xs opacity-90">En línea ahora</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
              >
                {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Área de mensajes */}
              <div className="h-64 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {isLoading ? (
                  <div className="text-center text-gray-500">Cargando mensaje inicial...</div>
                ) : (
                  <>
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex items-end space-x-2 max-w-xs ${msg.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            msg.type === 'bot' 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                              : 'bg-gray-300 text-gray-600'
                          }`}>
                            {msg.type === 'bot' ? <Bot size={16} /> : <User size={16} />}
                          </div>
                          <div className={`px-4 py-2 rounded-2xl ${
                            msg.type === 'bot'
                              ? 'bg-white border border-gray-200 text-gray-800'
                              : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                          } ${msg.type === 'user' ? 'rounded-br-md' : 'rounded-bl-md'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-xs mt-1 ${msg.type === 'bot' ? 'text-gray-500' : 'text-white text-opacity-70'}`}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
                
                {/* Respuestas rápidas */}
                {messages.length === 1 && !isLoading && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 text-center">Respuestas rápidas:</p>
                    {quickResponses.map((response, index) => (
                      <button
                        key={index}
                        className={`w-full flex items-center space-x-2 p-3 rounded-xl transition-all duration-200 ${response.color}`}
                      >
                        <response.icon size={16} />
                        <span className="text-sm font-medium">{response.text}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Input de mensaje */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Escribe tu mensaje..."
                      className="w-full px-4 py-2 pr-12 border text-black border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-xs">En línea</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Send size={16} />
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">
                  Presiona Enter para enviar • Powered by IA
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* Partículas flotantes decorativas */}
      {!isOpen && (
        <>
          <div className="absolute -top-8 -left-8 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-30"></div>
          <div className="absolute -bottom-4 -right-12 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-40"></div>
          <div className="absolute -top-12 -right-2 w-2 h-2 bg-pink-400 rounded-full animate-bounce opacity-50"></div>
        </>
      )}
    </div>
  );
};

export default HelpBot;
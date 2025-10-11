"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  Send,
  Loader2,
  RotateCcw,
  Phone,
  MessageSquare,
  PhoneMissed,
  MessageCircle,
  ChevronDown,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8000/api/v1/demo";

interface Message {
  role: "customer" | "assistant" | "error";
  content: string;
  timestamp: string;
  functionCalls?: FunctionCall[];
}

interface FunctionCall {
  name: string;
  arguments: Record<string, any>;
  result: Record<string, any>;
}

interface StartDemoResponse {
  session_id: string;
  customer_phone: string;
  greeting: string;
  business_name: string;
}

interface SendMessageResponse {
  ai_response: string;
  function_calls: FunctionCall[];
  conversation_state: string;
}

interface BusinessData {
  business_id: string;
  name: string;
  phone_number: string;
  business_type: string;
  timezone: string;
  business_profile: Record<string, any>;
  service_catalog: Record<string, any>;
  conversation_policies: Record<string, any>;
  quick_responses: Record<string, any>;
  contact_info: Record<string, any>;
  ai_instructions: string;
  business_hours: Record<string, any>;
  booking_policies: Record<string, any>;
  business_info: string;
}

type AnimationPhase = "idle" | "calling" | "missed" | "sms";

export default function AIDemoChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [businessId] = useState<string>("f93cb51c-3066-4f1f-a031-cc94a9fe449e");
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStarting, setIsStarting] = useState<boolean>(false);
  const [customerPhone, setCustomerPhone] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [conversationState, setConversationState] = useState<string>("");
  const [animationPhase, setAnimationPhase] = useState<AnimationPhase>("idle");
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    profile: true,
    services: true,
    policies: false,
    faqs: false,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const businessDataRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (animationPhase === "calling") {
      const missedTimer = setTimeout(() => {
        setAnimationPhase("missed");
      }, 3500);
      return () => clearTimeout(missedTimer);
    }

    if (animationPhase === "missed") {
      const smsTimer = setTimeout(() => {
        setAnimationPhase("sms");
      }, 2500);
      return () => clearTimeout(smsTimer);
    }
  }, [animationPhase]);

  const fetchBusinessData = async (sid: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/business/${sid}`);
      if (response.ok) {
        const data = await response.json();
        setBusinessData(data);
      }
    } catch (error) {
      console.error("Error fetching business data:", error);
    }
  };

  const startDemo = async () => {
    setIsStarting(true);
    setAnimationPhase("calling");

    try {
      const response = await fetch(`${API_BASE_URL}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: businessId }),
      });

      if (!response.ok) throw new Error("Failed to start demo");

      const data: StartDemoResponse = await response.json();
      setSessionId(data.session_id);
      setCustomerPhone(data.customer_phone);
      setBusinessName(data.business_name);

      // Fetch business data
      await fetchBusinessData(data.session_id);

      // Add greeting message after SMS phase completes
      setTimeout(() => {
        setMessages([
          {
            role: "assistant",
            content: data.greeting,
            timestamp: new Date().toISOString(),
          },
        ]);
      }, 6000);
    } catch (error) {
      console.error("Error starting demo:", error);
      setAnimationPhase("idle");
      setIsStarting(false);
      alert("Failed to start demo. Please try again.");
    } finally {
      setIsStarting(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !sessionId) return;

    const userMessage = inputMessage.trim();
    setInputMessage("");
    inputRef.current?.focus();

    setMessages((prev) => [
      ...prev,
      {
        role: "customer",
        content: userMessage,
        timestamp: new Date().toISOString(),
      },
    ]);

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage,
        }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data: SendMessageResponse = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.ai_response,
          timestamp: new Date().toISOString(),
          functionCalls: data.function_calls,
        },
      ]);

      setConversationState(data.conversation_state);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "error",
          content: "Failed to send message. Please try again.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetConversation = () => {
    setSessionId(null);
    setMessages([]);
    setCustomerPhone("");
    setBusinessName("");
    setConversationState("");
    setAnimationPhase("idle");
    setBusinessData(null);
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Initial Screen
  if (!sessionId && animationPhase === "idle") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        {/* Header Instruction */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">AI SMS Demo</h1>
          <p className="text-xl text-gray-600 mb-2">
            To start the demo, call the real estate business
          </p>
          <p className="text-sm text-gray-500">
            Experience our AI-powered appointment booking assistant
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <MessageSquare className="w-8 h-8 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Ready to Connect
            </h2>
            <p className="text-gray-600">
              Click below to initiate a call to the business
            </p>
          </div>

          <button
            onClick={startDemo}
            disabled={isStarting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStarting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Starting...
              </>
            ) : (
              <>
                <Phone className="w-5 h-5 mr-2" />
                Call Real Estate Business
              </>
            )}
          </button>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-sm text-blue-900 mb-2">
              Try asking:
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• "I need a haircut tomorrow at 2pm"</li>
              <li>• "What services do you offer?"</li>
              <li>• "Show me available times this week"</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  // Calling Animation Screen
  if (animationPhase === "calling") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
        <style>{`
          @keyframes dot-pulse {
            0%, 100% {
              opacity: 0.3;
              transform: scale(0.8);
            }
            50% {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes slide-in-left {
            from {
              opacity: 0;
              transform: translateX(-50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes slide-in-right {
            from {
              opacity: 0;
              transform: translateX(50px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .slide-left {
            animation: slide-in-left 0.6s ease-out;
          }
          .slide-right {
            animation: slide-in-right 0.6s ease-out;
          }
          .dot-1 { animation: dot-pulse 1.5s infinite; animation-delay: 0s; }
          .dot-2 { animation: dot-pulse 1.5s infinite; animation-delay: 0.2s; }
          .dot-3 { animation: dot-pulse 1.5s infinite; animation-delay: 0.4s; }
          .dot-4 { animation: dot-pulse 1.5s infinite; animation-delay: 0.6s; }
          .dot-5 { animation: dot-pulse 1.5s infinite; animation-delay: 0.8s; }
        `}</style>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Starting Demo
          </h1>
          <p className="text-lg text-gray-600">
            Customer calling {businessName || "Real Estate Business"}...
          </p>
        </div>

        {/* Cards with connecting dots */}
        <div className="flex items-center justify-center gap-8 max-w-5xl w-full">
          {/* Customer Card - Left */}
          <div className="slide-left bg-white rounded-2xl shadow-2xl p-8 w-72">
            <div className="text-center">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-10 h-10 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Customer</h3>
              <p className="text-gray-600 text-sm mb-1">Demo Phone</p>
              <p className="text-gray-500 text-xs">{customerPhone}</p>
              <div className="mt-4 px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg">
                Calling...
              </div>
            </div>
          </div>

          {/* Connecting Dots */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-400 rounded-full dot-1"></div>
            <div className="w-3 h-3 bg-indigo-400 rounded-full dot-2"></div>
            <div className="w-3 h-3 bg-indigo-400 rounded-full dot-3"></div>
            <div className="w-3 h-3 bg-indigo-400 rounded-full dot-4"></div>
            <div className="w-3 h-3 bg-indigo-400 rounded-full dot-5"></div>
          </div>

          {/* Business Card - Right */}
          <div className="slide-right bg-white rounded-2xl shadow-2xl p-8 w-72">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {businessName || "Business"}
              </h3>
              <p className="text-gray-600 text-sm mb-1">Business Phone</p>
              <p className="text-gray-500 text-xs">AI Assistant</p>
              <div className="mt-4 px-4 py-2 bg-yellow-50 text-yellow-700 text-sm font-medium rounded-lg">
                Ringing...
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Missed Call Animation Screen
  if (animationPhase === "missed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <style>{`
          @keyframes slide-down {
            from {
              opacity: 0;
              transform: translateY(-30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .missed-notification {
            animation: slide-down 0.6s ease-out;
          }
        `}</style>
        <div className="text-center">
          <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-sm w-full missed-notification">
            <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <PhoneMissed className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Call Missed
            </h2>
            <p className="text-gray-600 mb-1">{businessName || "Business"}</p>
            <p className="text-sm text-gray-500 mb-8">
              {new Date().toLocaleTimeString()}
            </p>
            <div className="flex justify-center gap-1">
              <div
                className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Chat Interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-4 border-b border-gray-200 mb-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {businessName}
              </h2>
              <p className="text-sm text-gray-500">
                Demo Customer: {customerPhone}
              </p>
            </div>
            <button
              onClick={resetConversation}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
            >
              <RotateCcw className="w-4 h-4" />
              New Chat
            </button>
          </div>
          {conversationState && (
            <div className="mt-2 inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
              State: {conversationState}
            </div>
          )}
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 bg-white rounded-b-2xl shadow-lg overflow-hidden">
          {/* Left Column - Chat (2/3 width) */}
          <div className="lg:col-span-2 flex flex-col border-r border-gray-200">
            {/* Messages Container */}
            <div className="flex-1 p-6 h-[600px] overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${
                      msg.role === "customer" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        msg.role === "customer"
                          ? "bg-indigo-600 text-white"
                          : msg.role === "error"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>

                      {msg.functionCalls && msg.functionCalls.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-300">
                          <p className="text-xs font-semibold mb-2 opacity-75">
                            Function Calls:
                          </p>
                          {msg.functionCalls.map((fc, fcIdx) => (
                            <div
                              key={fcIdx}
                              className="text-xs opacity-75 mb-1"
                            >
                              ⚡ {fc.name}
                            </div>
                          ))}
                        </div>
                      )}

                      <p className="text-xs mt-2 opacity-75">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 rounded-2xl px-4 py-3">
                      <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition disabled:opacity-50 text-black placeholder-gray-400"
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Business Data (1/3 width) */}
          <div
            ref={businessDataRef}
            className="lg:col-span-1 p-6 bg-gradient-to-b from-gray-50 to-white overflow-y-auto h-[700px]"
          >
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
              Business Data
            </h3>

            {businessData ? (
              <div className="space-y-3">
                {/* Business Profile Section */}
                {businessData.business_profile &&
                  Object.keys(businessData.business_profile).length > 0 && (
                    <div className="border border-indigo-100 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection("profile")}
                        className="w-full p-3 bg-indigo-50 hover:bg-indigo-100 flex items-center justify-between transition"
                      >
                        <p className="font-semibold text-sm text-indigo-700">
                          Business Profile
                        </p>
                        <ChevronDown
                          className={`w-4 h-4 text-indigo-700 transition transform ${
                            expandedSections.profile ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {expandedSections.profile && (
                        <div className="p-3 bg-white space-y-2 text-xs">
                          {businessData.business_profile.description && (
                            <div>
                              <p className="font-semibold text-gray-700">
                                Description
                              </p>
                              <p className="text-gray-600 text-xs">
                                {businessData.business_profile.description}
                              </p>
                            </div>
                          )}
                          {businessData.business_profile.specialties && (
                            <div>
                              <p className="font-semibold text-gray-700">
                                Specialties
                              </p>
                              <ul className="text-gray-600 list-disc list-inside">
                                {businessData.business_profile.specialties.map(
                                  (spec: string, idx: number) => (
                                    <li key={idx} className="text-xs">
                                      {spec}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                          {businessData.business_profile.areas_served && (
                            <div>
                              <p className="font-semibold text-gray-700">
                                Areas Served
                              </p>
                              <p className="text-gray-600">
                                {businessData.business_profile.areas_served.join(
                                  ", "
                                )}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                {/* Services Section */}
                {businessData.service_catalog &&
                  Object.keys(businessData.service_catalog).length > 0 && (
                    <div className="border border-indigo-100 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection("services")}
                        className="w-full p-3 bg-indigo-50 hover:bg-indigo-100 flex items-center justify-between transition"
                      >
                        <p className="font-semibold text-sm text-indigo-700">
                          Services
                        </p>
                        <ChevronDown
                          className={`w-4 h-4 text-indigo-700 transition transform ${
                            expandedSections.services ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {expandedSections.services && (
                        <div className="p-3 bg-white space-y-2">
                          {Object.entries(businessData.service_catalog).map(
                            (
                              [serviceName, details]: [string, any],
                              idx: number
                            ) => (
                              <div
                                key={idx}
                                className="border-b border-gray-200 pb-2 last:border-0"
                              >
                                <p className="font-semibold text-gray-700 text-xs">
                                  {serviceName}
                                </p>
                                <p className="text-gray-600 text-xs">
                                  {details.description}
                                </p>
                                <div className="flex justify-between mt-1 text-xs text-gray-500">
                                  <span>{details.price}</span>
                                  {details.duration && (
                                    <span>{details.duration} min</span>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}

                {/* Policies Section */}
                {businessData.conversation_policies &&
                  Object.keys(businessData.conversation_policies).length >
                    0 && (
                    <div className="border border-indigo-100 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection("policies")}
                        className="w-full p-3 bg-indigo-50 hover:bg-indigo-100 flex items-center justify-between transition"
                      >
                        <p className="font-semibold text-sm text-indigo-700">
                          Policies
                        </p>
                        <ChevronDown
                          className={`w-4 h-4 text-indigo-700 transition transform ${
                            expandedSections.policies ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {expandedSections.policies && (
                        <div className="p-3 bg-white space-y-2">
                          {Object.entries(
                            businessData.conversation_policies
                          ).map(
                            (
                              [policyName, policyValue]: [string, any],
                              idx: number
                            ) => (
                              <div
                                key={idx}
                                className="border-b border-gray-200 pb-2 last:border-0"
                              >
                                <p className="font-semibold text-gray-700 text-xs capitalize">
                                  {policyName.replace(/_/g, " ")}
                                </p>
                                <p className="text-gray-600 text-xs">
                                  {policyValue}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}

                {/* FAQs Section */}
                {businessData.quick_responses &&
                  Object.keys(businessData.quick_responses).length > 0 && (
                    <div className="border border-indigo-100 rounded-lg overflow-hidden">
                      <button
                        onClick={() => toggleSection("faqs")}
                        className="w-full p-3 bg-indigo-50 hover:bg-indigo-100 flex items-center justify-between transition"
                      >
                        <p className="font-semibold text-sm text-indigo-700">
                          FAQs
                        </p>
                        <ChevronDown
                          className={`w-4 h-4 text-indigo-700 transition transform ${
                            expandedSections.faqs ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {expandedSections.faqs && (
                        <div className="p-3 bg-white space-y-2 max-h-96 overflow-y-auto">
                          {Object.entries(businessData.quick_responses).map(
                            (
                              [question, answer]: [string, any],
                              idx: number
                            ) => (
                              <div
                                key={idx}
                                className="border-b border-gray-200 pb-2 last:border-0"
                              >
                                <p className="font-semibold text-gray-700 text-xs">
                                  {question}
                                </p>
                                <p className="text-gray-600 text-xs mt-1">
                                  {answer}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  )}

                {/* Contact Info */}
                {businessData.contact_info &&
                  Object.keys(businessData.contact_info).length > 0 && (
                    <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
                      <p className="font-semibold text-indigo-700 text-xs mb-2">
                        Contact Info
                      </p>
                      <div className="text-xs space-y-1 text-gray-700">
                        {businessData.contact_info.address && (
                          <div>
                            <span className="font-semibold">Address:</span>{" "}
                            {businessData.contact_info.address}
                          </div>
                        )}
                        {businessData.contact_info.email && (
                          <div>
                            <span className="font-semibold">Email:</span>{" "}
                            {businessData.contact_info.email}
                          </div>
                        )}
                        {businessData.contact_info.office_phone && (
                          <div>
                            <span className="font-semibold">Phone:</span>{" "}
                            {businessData.contact_info.office_phone}
                          </div>
                        )}
                        {businessData.contact_info.emergency_line && (
                          <div>
                            <span className="font-semibold">Emergency:</span>{" "}
                            {businessData.contact_info.emergency_line}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <div className="text-center py-6">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400 mx-auto mb-2" />
                <p className="text-xs text-gray-500">
                  Loading business data...
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

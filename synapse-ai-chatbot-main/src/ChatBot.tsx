import React, { useState, useEffect, useRef } from "react";
   import { Button } from "@/components/ui/button";
   import { Input } from "@/components/ui/input";
   import { ScrollArea } from "@/components/ui/scroll-area";
   import { Menu, Paperclip, X } from "lucide-react";
   import { getDocument, GlobalWorkerOptions, PDFDocumentProxy } from 'pdfjs-dist';

   // Set the worker source for pdf.js to match the installed version (5.2.133)
   GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.2.133/pdf.worker.min.js';

   type Message = {
     id: string;
     sender: "user" | "ai" | "system";
     text: string;
     timestamp: string;
   };

   const dummyResponses = [
     "That's an interesting question! Let me think about it.",
     "Cool, tell me more!",
     "I'm processing that... Here's a thought: What do you think about this?",
     "Nice one! How can I assist you further?",
     "Hmm, that's a good point! What's next?"
   ];

   const ChatBot: React.FC = () => {
     const [messages, setMessages] = useState<Message[]>([]);
     const [input, setInput] = useState<string>("");
     const [isTyping, setIsTyping] = useState<boolean>(false);
     const [historyOpen, setHistoryOpen] = useState<boolean>(false);
     const [parsedPdfText, setParsedPdfText] = useState<string>("");
     const [fileName, setFileName] = useState<string>("");
     const fileInputRef = useRef<HTMLInputElement>(null);
     const bottomRef = useRef<HTMLDivElement>(null);

     const GEMINI_API_KEY = "AIzaSyCGcy-7O50mE-uFEWu9q7FbIRQh-eP4Zxs";
     const MODEL_ID = "gemini-1.5-flash";
     const USE_DUMMY_RESPONSES = GEMINI_API_KEY === "Your API Key";

     const handleSend = async () => {
       if (!input.trim() && !parsedPdfText) return;

       const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

       if (input.trim()) {
         setMessages((prev) => [
           ...prev,
           { id: crypto.randomUUID(), sender: "user", text: input.trim(), timestamp },
         ]);
       }

       setInput("");
       setIsTyping(true);

       if (USE_DUMMY_RESPONSES) {
         setTimeout(() => {
           const reply = dummyResponses[Math.floor(Math.random() * dummyResponses.length)];
           setMessages((prev) => [
             ...prev,
             { id: crypto.randomUUID(), sender: "ai", text: reply, timestamp },
           ]);
           setParsedPdfText("");
           setFileName("");
           setIsTyping(false);
         }, 1000);
         return;
       }

       try {
         let finalInputToSend = "";

         if (input.trim() && parsedPdfText) {
           finalInputToSend = `${input.trim()}\n\n[Attached Document Content]\n${parsedPdfText}`;
         } else if (input.trim()) {
           finalInputToSend = input.trim();
         } else if (parsedPdfText) {
           finalInputToSend = parsedPdfText;
         }

         const payload = {
           contents: [{ role: "user", parts: [{ text: finalInputToSend }] }],
           generationConfig: { responseMimeType: "text/plain" },
         };

         const response = await fetch(
           `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent?key=${GEMINI_API_KEY}`,
           {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify(payload),
           }
         );

         const data = await response.json();
         const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "AI couldn't generate a reply.";

         setMessages((prev) => [
           ...prev,
           { id: crypto.randomUUID(), sender: "ai", text: reply, timestamp },
         ]);

         setParsedPdfText("");
         setFileName("");
       } catch (error) {
         setMessages((prev) => [
           ...prev,
           { id: crypto.randomUUID(), sender: "system", text: "Error fetching response.", timestamp },
         ]);
       } finally {
         setIsTyping(false);
       }
     };

     const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
       const file = e.target.files?.[0];
       if (file && file.type === "application/pdf") {
         setParsedPdfText("");
         setFileName(file.name);

         const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
         setMessages((prev) => [
           ...prev,
           {
             id: crypto.randomUUID(),
             sender: "system",
             text: `📄 1 file uploaded: ${file.name}`,
             timestamp,
           },
         ]);
         parsePDF(file);
       }
     };

     const parsePDF = async (file: File) => {
       const reader = new FileReader();
       reader.onload = async () => {
         const typedarray = new Uint8Array(reader.result as ArrayBuffer);
         console.log("📄 TypedArray Length:", typedarray.length);
         if (typedarray.length === 0) {
           console.error("FileReader returned an empty array buffer.");
           setMessages((prev) => [
             ...prev,
             {
               id: crypto.randomUUID(),
               sender: "system",
               text: "Error: Empty file data.",
               timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
             },
           ]);
           return;
         }

         try {
           const pdf: PDFDocumentProxy = await getDocument(typedarray).promise;
           let fullText = "";
           for (let i = 1; i <= pdf.numPages; i++) {
             const page = await pdf.getPage(i);
             const textContent = await page.getTextContent();
             const pageText = textContent.items
               .map((item: any) => item.str)
               .join(" ");
             fullText += `\n\nPage ${i}:\n${pageText}`;
           }
           setParsedPdfText(fullText);
           console.log("📄 Parsed PDF Text:", fullText);
         } catch (error) {
           console.error("Error parsing PDF:", error);
           setMessages((prev) => [
             ...prev,
             {
               id: crypto.randomUUID(),
               sender: "system",
               text: "Error parsing PDF file.",
               timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
             },
           ]);
         }
       };
       reader.readAsArrayBuffer(file);
     };

     useEffect(() => {
       bottomRef.current?.scrollIntoView({ behavior: "smooth" });
     }, [messages, isTyping]);

     return (
       <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 text-gray-100">
         <div
           className={`fixed top-0 left-0 h-full bg-gray-800/50 backdrop-blur-md w-64 z-50 p-4 transition-transform border-r border-gray-700/50 ${
             historyOpen ? "translate-x-0" : "-translate-x-full"
           } md:w-72 md:translate-x-0 md:static md:h-auto md:flex md:flex-col`}
         >
           <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
               Chat History
             </h2>
             <X className="cursor-pointer md:hidden text-gray-400 hover:text-white" onClick={() => setHistoryOpen(false)} />
           </div>
           <ScrollArea className="h-[90%] space-y-4 pr-2">
             {messages
               .filter((msg) => msg.sender === "user" || msg.sender === "ai")
               .map((msg) => (
                 <div
                   key={msg.id}
                   className={`p-3 rounded-xl text-sm backdrop-blur-md border border-gray-600/20 shadow-md hover:shadow-lg transition-all duration-300 ${
                     msg.sender === "user" ? "bg-indigo-600/30" : "bg-gray-700/30"
                   }`}
                 >
                   <strong>{msg.sender === "user" ? "You:" : "AI:"} </strong>
                   {msg.text}
                   <span className="text-xs opacity-60 mt-1 block">{msg.timestamp}</span>
                 </div>
               ))}
           </ScrollArea>
         </div>

         <div className="flex flex-col flex-grow w-full">
           <div className="flex items-center p-4 border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-md shadow-lg">
             <Menu className="cursor-pointer mr-4 text-gray-400 hover:text-white md:hidden" onClick={() => setHistoryOpen(true)} />
             <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
               Synapse AI Chatbot
             </h1>
           </div>

           <ScrollArea className="flex-1 p-6 space-y-6 overflow-y-auto">
             {messages.map((msg) => (
               <div
                 key={msg.id}
                 className={`flex items-start gap-3 animate-fade-in ${
                   msg.sender === "user" ? "justify-end" : msg.sender === "ai" ? "justify-start" : "justify-center"
                 }`}
               >
                 {msg.sender === "ai" && (
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                     AI
                   </div>
                 )}
                 <div
                   className={`max-w-[80%] p-4 rounded-2xl backdrop-blur-md border border-gray-600/20 shadow-lg hover:shadow-xl transition-all duration-300 ${
                     msg.sender === "user"
                       ? "bg-indigo-600/30 text-white"
                       : msg.sender === "ai"
                       ? "bg-gray-700/30 text-gray-100"
                       : "bg-gray-800/30 text-gray-400 italic text-center"
                   }`}
                 >
                   <p className="text-sm md:text-base">{msg.text}</p>
                   <span className="text-xs opacity-60 mt-1 block">
                     {msg.sender === "user" ? "You" : msg.sender === "ai" ? "AI" : "System"} • {msg.timestamp}
                   </span>
                 </div>
                 {msg.sender === "user" && (
                   <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                     U
                   </div>
                 )}
               </div>
             ))}
             {isTyping && (
               <div className="flex justify-start items-center gap-3 animate-fade-in">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                   AI
                 </div>
                 <div className="flex space-x-2 p-4 bg-gray-700/30 backdrop-blur-md rounded-2xl border border-gray-600/20 shadow-lg">
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                   <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                 </div>
               </div>
             )}
             <div ref={bottomRef} />
           </ScrollArea>

           <div className="p-4 border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-md shadow-lg flex gap-3 items-center">
             <Button
               variant="ghost"
               className="text-gray-400 hover:text-white transition-colors duration-200"
               onClick={() => fileInputRef.current?.click()}
             >
               <Paperclip />
             </Button>
             <input
               type="file"
               accept="application/pdf"
               ref={fileInputRef}
               onChange={handleFileUpload}
               className="hidden"
             />
             <Input
               placeholder="Type your message..."
               value={input}
               onChange={(e) => setInput(e.target.value)}
               onKeyDown={(e) => {
                 if (e.key === "Enter") handleSend();
               }}
               className="flex-1 p-3 bg-gray-700/50 backdrop-blur-md text-gray-100 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 placeholder-gray-400 text-lg"
             />
             <Button
               onClick={handleSend}
               className="px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-lg"
             >
               Send
             </Button>
           </div>
         </div>
       </div>
     );
   };

   export default ChatBot;
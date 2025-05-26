## SYNAPSE AI CHATBOT ##
 
A modern, responsive chatbot web application built with React, TypeScript, and Tailwind CSS. This chatbot allows users to send messages and receive dummy responses, with a sleek UI featuring a chat history sidebar and smooth animations. The app is designed to integrate with the Google Gemini API for AI-generated responses, but currently uses dummy responses due to the absence of an API key.
Features

## >Interactive Chat Interface: Send messages and receive responses in a clean, user-friendly UI.
## >Chat History Sidebar: View past conversations in a collapsible sidebar (responsive for mobile and desktop).
## >Smooth Animations: Messages fade in, and a typing indicator provides a polished user experience.
## >Customizable: Easily modify the chatbot's name, styling, and functionality.
## >Dummy Responses: Predefined responses are used until a Gemini API key is provided for real AI responses.

Based on the chatbot project at `D:\CHATBOT`, I'll list the tech stack in a clear, bulleted format. Since you’ve asked to exclude the PDF parsing functionality (which used `pdfjs-dist` and wasn’t working), I’ll focus on the core technologies powering the functional parts of the app, such as the chat interface, UI, and dummy response system. This matches the project as described in the `README.md` I provided earlier.

---

### Tech Stack for SYNAPSE AI CHATBOT:

- **Frontend Framework**:
  - **React** (`^18.2.0`): For building the user interface with components like `ChatBot.tsx`.
  - **React DOM** (`^18.2.0`): For rendering React components into the browser DOM.

- **Language**:
  - **TypeScript** (`^5.0.2`): For type safety and enhanced development experience (e.g., type definitions in `ChatBot.tsx`).

- **Build Tool**:
  - **Vite** (`^6.3.5`): For bundling the app and providing a fast development server with hot module replacement (HMR).

- **Styling**:
  - **Tailwind CSS** (`^3.4.1`): Utility-first CSS framework for styling the UI (e.g., gradients, responsive design).
  - **PostCSS** (`^8.4.27`): For processing CSS, including Tailwind, with plugins like Autoprefixer.
  - **Autoprefixer** (`^10.4.14`): Adds vendor prefixes to CSS for better browser compatibility.
  - **tailwindcss-animate** (`^1.0.7`): Tailwind plugin for animations (e.g., `animate-fade-in` for messages).

- **UI Components**:
  - **shadcn/ui**: Reusable UI components (e.g., `Button`, `Input`, `ScrollArea`) styled with Tailwind CSS.
  - **Radix UI** (`@radix-ui/react-scroll-area@^1.0.5`): Low-level UI primitives used by shadcn/ui for components like `ScrollArea`.

- **Icons**:
  - **Lucide React** (`^0.279.0`): Icon library for UI elements (e.g., `Menu`, `Paperclip`, `X` icons).

- **Utilities**:
  - **class-variance-authority** (`^0.7.0`): For managing variant-based styling in shadcn/ui components.
  - **clsx** (`^2.0.0`): For conditionally joining class names in components.
  - **tailwind-merge** (`^2.0.0`): For merging Tailwind classes without conflicts.

- **Backend/API (Optional)**:
  - **Gemini API**: Configured to fetch AI responses (using `gemini-1.5-flash` model), but currently using dummy responses due to a placeholder API key.

- **Development Tools**:
  - **Node.js** (`@types/node@^20.0.0`): Runtime environment for running the app and build tools.
  - **npm**: Package manager for installing dependencies and running scripts (e.g., `npm run dev`).

---

### Notes
- The tech stack focuses on the working features: the chat interface, UI, and dummy response system.
- I’ve excluded `pdfjs-dist` since the PDF parsing functionality isn’t working, as per your request.
- The Gemini API integration is listed as optional since it’s not active (the API key is set to `"Your API Key"` in `ChatBot.tsx`).

It’s currently 04:29 PM IST on Monday, May 26, 2025. Let me know if you’d like to adjust this list or dive deeper into any specific technology!

## Installation:

## Follow these steps to set up and run the project locally:

Clone the Repository:
git clone https://github.com/your-username/my-awesome-chatbot.git
cd my-awesome-chatbot

Install Dependencies:
npm install

Run the Development Server:
npm run dev

Open http://localhost:5173 in your browser to see the chatbot in action.

(Optional) Configure Gemini API:

To enable real AI responses, obtain a Gemini API key from Google AI Studio.
Update the GEMINI_API_KEY in src/ChatBot.tsx:const GEMINI_API_KEY = "your-gemini-api-key";

The app will then use the Gemini API (gemini-1.5-flash model) instead of dummy responses.



## Usage:

*Send Messages: Type a message in the input field and press "Send" or hit Enter.
*View Chat History: Toggle the sidebar (via the menu icon on mobile) to see past messages.
*Customize the Chatbot:
*Change the chatbot's name in src/ChatBot.tsx:<h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
  SYNAPSE AI CHATBOT
</h1>

Modify the styling by adjusting Tailwind classes in src/ChatBot.tsx.


Project Structure
SYNAPSE-AI-CHATBOT/
│
├── node_modules/           # Dependencies
├── public/                 # Static assets
├── src/                    # Source code
│   ├── ChatBot.tsx         # Main chatbot component
│   ├── components/         # UI components (shadcn/ui)
│   ├── App.tsx             # Root component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles (Tailwind)
├── package.json            # Project metadata and dependencies
├── tsconfig.json           # TypeScript configuration
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # Project documentation

Contributing
Contributions are welcome! To contribute:

Fork the repository.
Create a new branch (git checkout -b feature/your-feature).
Make your changes and commit them (git commit -m "Add your feature").
Push to your branch (git push origin feature/your-feature).
Open a Pull Request.

License
This project is licensed under the MIT License. See the LICENSE file for details.
Acknowledgements

shadcn/ui for the beautiful UI components.
Tailwind CSS for the styling framework.
Vite for the fast build tool.
Lucide React for the icons.

Contact
For questions or feedback, feel free to reach out:

GitHub: Subhro27
Email: subhrog20@gmail.com


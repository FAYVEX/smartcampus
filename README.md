

### 📥 Installation  

Follow these steps to set up the project locally:  

1️⃣ **Clone the Repository**  
```sh
git clone <YOUR_GIT_URL>
```

2️⃣ **Navigate to the Project Directory**  
```sh
cd <YOUR_PROJECT_NAME>
```

3️⃣ **Install Dependencies**  
```sh
npm install
```

4️⃣ **Start the Development Server**  
```sh
npm run dev
```
This will launch the application with **hot-reloading** enabled for seamless development.  

---

### 📁 Project Structure  

```
SmartCampus/
│── Detection/                  # Python scripts for hand and face detection
│   ├── Hand_detector_module.py  # Module for hand detection
│   ├── Hand_detection_min.py    # Minimal hand detection script
│   ├── face_detection_module.py # Module for face detection
│   ├── face_detection_min.py    # Minimal face detection script
│
│── src/                         # Main React application source code
│   ├── App.tsx                   # Root application component
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # UI components
│   │   │   ├── sidebar.tsx       # Sidebar component
│   │   │   ├── button.tsx        # Button component
│   │   │   ├── input.tsx         # Input component
│   │   │   ├── dialog.tsx        # Dialog component
│   │   │   ├── label.tsx         # Label component
│   │   ├── hooks/                # Custom hooks
│   │   │   ├── use-mobile.ts     # Hook to detect mobile devices
│   │   ├── integrations/         # Integration files
│   │   │   ├── supabase/         # Supabase integration
│   │   │   │   ├── client.ts     # Supabase client configuration
│   │   │   │   ├── types.ts      # Type definitions for Supabase
│   ├── pages/                    # Application pages
│   │   ├── Imp.tsx               # Important notifications page
│   │   ├── safety.tsx            # Safety features page
│   │   ├── TravelBuddy.tsx       # Travel buddy system page
│   │   ├── AdminDashboard.tsx    # Admin dashboard page
│   │   ├── LostFound.tsx         # Lost and found items page
│
│── supabase/                     # Supabase configuration files
│   ├── config.toml               # Supabase project settings
│
│── public/                       # Static assets (favicon, images, etc.)
│   ├── favicon.ico               # Favicon for the application
│   ├── og-image.png              # Open Graph image for social media sharing
│   ├── placeholder.svg           # Placeholder image
│
│── tailwind.config.ts            # Tailwind CSS configuration
│── eslint.config.js              # ESLint configuration
│── tsconfig.json                 # TypeScript configuration
│── tsconfig.app.json             # TypeScript configuration for the application
│── tsconfig.node.json            # TypeScript configuration for Node.js
│── vite.config.ts                # Vite configuration
│── videoplayback.webm            # Sample video file for testing
```

---

### 🎯 Running Hand & Face Detection  

Navigate to the **Detection/** directory and execute the scripts:

```sh
cd Detection
python Hand_detection_min.py     # Runs minimal hand detection
python face_detection_min.py     # Runs minimal face detection
```
These scripts utilize **OpenCV and MediaPipe** for real-time hand and face recognition.  

---

### 🔧 Configuration  

#### ✅ **Supabase Setup**  

1. Set up your Supabase project and retrieve the required API keys.  
2. Update the **Supabase configuration** in:  
   ```
   src/integrations/supabase/client.ts
   ```
3. Add your Supabase credentials:  

```ts
const SUPABASE_URL = "<YOUR_SUPABASE_URL>";
const SUPABASE_PUBLISHABLE_KEY = "<YOUR_SUPABASE_PUBLISHABLE_KEY>";
```

Now, your project is configured and ready to use! 🚀  




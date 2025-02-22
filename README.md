# 🚀 AI-Powered Lesson Planner  

An AI-driven web application built with **React.js** to help educators generate structured, editable lesson plans effortlessly. Powered by **Google Gemini API**, it streamlines lesson planning with a clean UI and exportable PDFs.  

---

## 📌 Table of Contents  
- [🛠 Tech Stack](#-tech-stack)  
- [✨ Features](#-features)  
- [🚀 Installation](#-installation)  
- [🖥 Usage](#-usage)  
- [⚙ Configuration](#-configuration)  
- [📦 Dependencies](#-dependencies)  
- [📌 Current Progress](#-current-progress)  
- [🤝 Contributing](#-contributing)  

---

## 🛠 Tech Stack  
- **Frontend:** React.js (Vite)  
- **UI Library:** ShadCN + TailwindCSS  
- **AI Integration:** Google Gemini API (Free Version)  
- **State Management:** React State (or Context API if needed)  
- **PDF Handling:** `jsPDF`  
- **Deployment:** Vercel  

---

## ✨ Features  

### 1️⃣ **User Authentication (Dummy Login)**  
- Users log in with pre-set credentials (`demouser/demopass`).  

### 2️⃣ **AI-Powered Lesson Plan Generator**  
- Users input lesson details (Topic, Grade Level, Objectives, Materials, etc.).  
- **Google Gemini API** generates a structured lesson plan.  

### 3️⃣ **Editable & Formatted Output**  
- **ShadCN components** (Input, Textarea, Card, Accordion, Checkbox, etc.) ensure a clean UI.  
- Users can modify the generated content before finalizing.  

### 4️⃣ **Download as PDF**  
- The finalized lesson plan can be exported as a **PDF** using `jsPDF`.  

---

## 🚀 Installation  

### 🔹 **Clone the Repository**  
```bash
git clone https://github.com/shubhujais15/AI-Powered-Lesson-Planner.git
cd AI-Powered-Lesson-Planner
```

### 🔹 **Install Dependencies**  
```bash
npm install
```

### 🔹 **Add ShadCN Components**  
Run the following command to install the required **ShadCN components**:  
```bash
npx shadcn@latest add checkbox accordion button card input label table textarea
```

### 🔹 **Run the Development Server**  
```bash
npm run dev
```
- The app runs on `http://localhost:5173/` by default.  

---

## 🖥 Usage  
1. **Login** using the pre-set credentials (`demouser/demopass`).  
2. **Enter Lesson Details** such as Topic, Grade Level, Objectives, and Materials.  
3. **Generate Plan** using AI and modify the output if needed.  
4. **Download as PDF** for easy sharing and printing.  

---

## ⚙ Configuration  

- To use the **Google Gemini API**, create a `.env` file and add:  
```env
VITE_GEMINI_API_KEY=your_api_key_here
```
- Replace `your_api_key_here` with your actual **Google Gemini API key**.  

---

## 📦 Dependencies  

| Package | Purpose |
|---------|---------|
| **React.js** | Frontend framework |
| **Vite** | Development environment |
| **ShadCN** | UI components |
| **TailwindCSS** | Styling framework |
| **jsPDF** | PDF export functionality |
| **Google Gemini API** | AI-based lesson generation |

---

## 📌 Current Progress  

- ✅ **Frontend UI with ShadCN Components**  
- ✅ **Dummy Authentication**  
- ✅ **State Management using React**  
- 🔄 **Fixing Deployment Issues on Vercel**  
- 🔜 **AI Integration & PDF Export**  

---

## 🤝 Contributing  
We welcome contributions! 🚀  

### Steps to Contribute  
1. **Fork** the repository.  
2. **Clone** your forked repository.  
3. **Create a new branch** for your feature/fix.  
4. **Commit** your changes and push.  
5. **Submit a Pull Request (PR)**.  

# 🀄 Chinese Flashcards (HSK Companion)

<div align="center">

<img src="https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=1200&auto=format&fit=crop" alt="Project Banner" width="100%" height="300" style="object-fit:cover; border-radius: 12px">

<br/>

**A blazing fast, mobile-first vocabulary flashcard app built with React & Vite.**
<br/>
*Zero API costs. Zero latency. 100% Static.*

[**🚀 Live Demo**](https://your-username.github.io/hsk-words/) · [**🐛 Report Bug**](../../issues) · [**✨ Request Feature**](../../issues)

</div>

---

## 📖 About The Project

**Chinese Flashcards** is a modern, lightweight web application designed to help students master Chinese vocabulary (HSK). Unlike complex language apps that require logins, subscriptions, or heavy downloads, this project is built to be **instant** and **focused**.

Originally powered by AI, this project has evolved into a **purely static architecture**. This means it loads in milliseconds, works on any device, and requires **no API keys** or backend servers to run. It reads a simple `words.json` file, making it the perfect template for anyone wanting to build their own flashcard deck.

### ✨ Key Features

* **⚡ Instant Loading:** Built as a static site, it loads in milliseconds with no database lag.
* **📱 Mobile-First Design:** Optimized for touch interactions, feeling like a native app on iOS and Android.
* **🃏 Review Mode:** "Tinder-style" flashcards with smooth flip animations to test your memory.
* **📜 List Mode:** A searchable, scrollable dictionary view of your entire vocabulary.
* **🔊 Comprehensive Details:** Displays Hanzi, Pinyin, English Meaning, and **Example Sentences with Pinyin**.
* **🎨 Beautiful UI:** Clean, distraction-free interface built with Tailwind CSS and "Chinese Red" theming.

---

## 🛠️ Tech Stack

This project is built with the latest modern web technologies:

* **Framework:** [React 19](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/) (Super fast HMR)
* **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict typing)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Icons:** [Lucide React](https://lucide.dev/)
* **Deployment:** GitHub Pages / Vercel (Static Hosting)

---

## 🚀 Getting Started

To run this project locally on your machine, follow these simple steps.

### Prerequisites

* Node.js (v18 or higher)
* npm or yarn

### Installation

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/your-username/hsk-words.git](https://github.com/your-username/hsk-words.git)
    cd hsk-words
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  Open `http://localhost:5173` (or the port shown in your terminal) to view the app.

---

## 📝 How to Add New Words

Since this app is **static**, you have full control over your data. No complex admin panels—just a simple JSON file.

1.  Open `public/words.json`.
2.  Add a new entry to the list using this format:

```json
{
  "id": "unique-id-here",
  "character": "快乐",
  "pinyin": "kuài lè",
  "meaning": "happy",
  "exampleSentence": "祝你生日快乐！",
  "exampleSentencePinyin": "Zhù nǐ shēngrì kuàilè!",
  "exampleMeaning": "Happy birthday to you!",
  "createdAt": 1709500000000
}
 

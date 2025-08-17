# 🍽️ QMenu — Multilingual Café Menu Platform

![QMenu Hero](https://socialify.git.ci/dola5xd/QMenu/image?language=1&logo=https%3A%2F%2Fq-menu-delta.vercel.app%2Fassets%2Flogo-cafe.svg&name=1&owner=1&stargazers=1&theme=Light)

> A modern multilingual café menu platform — QR-ready, customizable, and built for restaurants.

---

## 🌐 Live Demo

- **Main Website:** [QMenu](https://q-menu-delta.vercel.app/)

---

## 🖼️ Screenshots

#### 💻 Desktop Preview

![Desktop Preview](/Screenshots/Desktop-preview.png)

---

## ⚙️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS + ShadCN/UI + Radix UI
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod Validation
- **Auth:** NextAuth (Firebase Adapter)
- **Database:** Firebase Firestore
- **Storage:** Firebase + Cloudinary

---

## 📦 Installation

```bash
# Clone project
git clone https://github.com/your-username/qmenu.git
cd qmenu

# Install dependencies
npm install

# Start dev server
npm run dev
```

---

## 🧪 Environment Variables

Example `.env`:

```env
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
FIREBASE_API_KEY=your_api_key
FIREBASE_PROJECT_ID=your_project_id
CLOUDINARY_URL=your_cloudinary_url
```

---

## 📁 Folder Highlights

```
app/
├── [lang]/           # Multilingual pages (en, ar)
├── components/       # Reusable UI components
├── _providers/       # Global providers (Auth, Lang, Theme)
├── _lib/             # Auth configs & helpers
├── _utils/           # Utility functions
└── page.tsx          # Home entry
```

---

## 🤝 Contributing

🚀 Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

📜 This project is licensed under the **MIT License**.

---

💖 Made with passion by **Adel Yasser**

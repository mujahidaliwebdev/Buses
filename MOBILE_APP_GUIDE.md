# AsaanSafar Mobile App (Android) Guide 📱

Aap **AsaanSafar** ki fully-functional Android App do (2) different treeqo se bana aur chala sakty hain. Dono options aapki is website ke features ko mobile view me complete native support ke sath render karengi.

---

## Option 1: Progressive Web App (PWA) — *Fastest & Easiest!* ⚡
Aapko Play Store par publish karny ki zarorat nahi hai. Users direct website ko high-performance app ki tarah apny Android phone par save kar sakty hain.

### Kaise Install Karein:
1. Apne Android phone me **Google Chrome** browser open karein aur website link (jaise `https://asaansafar.com` ya temporary deployment URL) open karein.
2. Screen ke bottom par aapko automatic pop-up milega: **"Add AsaanSafar to Home Screen"** ya chrome options (3 dots) par click karke **"Install App"** select karein.
3. App automatic download hokar mobile desktop par green status bar aur native splash-screen ke sath launch ho jaye gi!

---

## Option 2: Fully Native Android App (.APK) using Capacitor 📦
Aap is project ke assets ko native Java/Kotlin code me package karke distribution APK file bana sakty hain jisay direct WhatsApp par share kia ja sakta hai ya Google Play Store par publish kiya ja sakta hai.

### Prerequisite (Requirement):
Aap ke pass local system (PC/Laptop) par niche di gayi tools installed honi chahiye:
- **Node.js** (Installed)
- **Android Studio** (With Android SDK)

---

### Step-by-Step Native Build Command Flow:

Aapne bas apny laptop/PC terminal me niche di gayi standard commands sequential run karni hain:

#### Step 1: Web App Build Create Karein
Sab se pehle pure code ko build folder me compile karein:
```bash
npm run build
```

#### Step 2: Android Platform Add Karein (Only for the first time)
Native Android project structure aur resources initialize karny ke liye:
```bash
npx cap add android
```
*(Yani default files direct `/android` directory me create ho jaye gi).*

#### Step 3: Web Assets ko Sync Karein
Jab bhi aap website me koi changing karein, use Android folder me synchronize karne ke liye:
```bash
npm run build
npx cap sync
```

#### Step 4: Android Studio me Project Open Karein
Project ko build aur package karne ke liye direct Android Studio me open karein:
```bash
npx cap open android
```

#### Step 5: Final APK Generate Karein (Android Studio Me):
1. Android Studio open hote hi build automatic sync ho jayegi.
2. Top menu bar par jayein: **Build** -> **Build Bundle(s) / APK(s)** -> **Build APK(s)**.
3. Finish hone par right-bottom me "Locate" notification par click karein. Aap ka **`app-debug.apk`** ready hai! Isay mobile me install karein aur run karein.

---

### App Icon aur Splash Screen Customize Kaise Karein?
Capacitor standard command framework ke sath automatic generator run karta hai:
```bash
# Generator tool run karke custom icons automatically resize karein:
npx @capacitor/assets generate --android
```
Aap direct `android/app/src/main/res/` folder me manually icon files exchange kar sakty hain.

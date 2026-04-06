<div align="center">

<img src="https://img.shields.io/badge/HackDays%202026-GCET%20%C3%97%20HackBase%20%C3%97%20MLH-0A66C2?style=for-the-badge&logo=hack-the-box&logoColor=white" />
<img src="https://img.shields.io/badge/Theme-Best%20Use%20of%20Google%20Gemini%20API-4285F4?style=for-the-badge&logo=google&logoColor=white" />
<img src="https://img.shields.io/badge/Round%201-PPT%20%2B%20Prototype-success?style=for-the-badge" />

<br/><br/>

# 🍱 ResQFood

## *Rescuing Surplus Food with AI. Delivering Hope in Real-Time.*

> **"The food exists. The people are hungry. The only thing missing is intelligence."**

<br/>

[![GitHub Repo](https://img.shields.io/badge/GitHub-ResQFood-black?style=flat-square&logo=github)](https://github.com/Aayush9808/ResQFood)
[![Powered by Gemini](https://img.shields.io/badge/Powered%20by-Google%20Gemini%201.5%20Pro-orange?style=flat-square&logo=google)](https://ai.google.dev)
[![Platform](https://img.shields.io/badge/Platform-Web%20%2B%20Mobile-blueviolet?style=flat-square)]()
[![Status](https://img.shields.io/badge/Status-Prototype%20Ready-brightgreen?style=flat-square)]()

</div>

---

## ⚡ TL;DR — Understand in 10 Seconds

| | |
|---|---|
| **The Problem** | 1 in 3 meals cooked in India is wasted. 194 million Indians are undernourished. The gap is coordination — not food. |
| **The Solution** | ResQFood connects surplus food donors to NGOs and volunteers — in real-time, using AI. |
| **How It Works** | Donor speaks or photographs food → **Gemini AI** extracts data, predicts spoilage, matches the right NGO → Volunteer delivers |
| **Why Gemini** | Multilingual voice input, image understanding, contextual spoilage reasoning, smart NGO matching — all in one API call |
| **The Impact** | Every rescue feeds ~30–50 people and avoids ~5 kg of CO₂ emissions |

---

## 🌍 The Problem — By the Numbers

<div align="center">

| Stat | Source |
|------|--------|
| 🗑️ **1.3 billion tonnes** of food wasted globally every year | FAO, 2023 |
| 🇮🇳 **68.7 million tonnes** of food wasted in India annually | UNEP Food Waste Index, 2024 |
| 😔 **194 million people** undernourished in India | FAO State of Food Security, 2023 |
| 💸 India's food waste costs **₹92,000 crore** per year | ASSOCHAM Report |
| 🌡️ Food waste generates **8–10%** of global greenhouse gas emissions | UNEP, 2023 |
| ⏱️ Cooked food becomes unsafe in **2–4 hours** without refrigeration | FSSAI Guidelines |

</div>

<br/>

> 💬 **The cruelest irony:** A wedding hall throws away 40 kg of food while an orphanage 3 km away sends children to sleep hungry.
>
> This isn't a food shortage. **It's a coordination failure.**

### Why Existing Solutions Fall Short

| Solution | Type | Why It Fails |
|---|---|---|
| WhatsApp Groups | Manual alerts | Unstructured, slow, zero matching intelligence |
| Too Good To Go | Commercial resale | Paid model, not donation-focused, not multilingual |
| Generic Food Banks | Fixed-location collection | No real-time coordination, language barriers |
| Manual NGO calls | Phone-based | Inconsistent, unscalable, time-consuming |
| **ResQFood** ✅ | **AI-powered rescue** | **Solves all of the above** |

---

## 💡 The Solution — ResQFood

```
📸  Donor snaps a photo or speaks in their language
              ↓
🧠  Gemini AI understands food, estimates urgency, matches NGO
              ↓
📲  NGO receives instant alert — accepts with one tap
              ↓
🚴  Nearest volunteer is GPS-routed to pick up and deliver
              ↓
📊  Impact logged: meals saved · CO₂ offset · donor streak updated
```

> 💬 **Think of it as Swiggy for surplus food** — powered by Gemini, built for impact, and completely free.

---

## 🧠 The Gemini API — The Brain, Not a Feature

> Most teams say *"we used AI."*
> We say: **without Gemini, ResQFood literally cannot function.**

Here's exactly what Gemini does — concretely, not vaguely:

---

### 🔷 1. Multimodal Food Intake — Text + Voice + Image

A tired hotel cook at 11 PM doesn't fill forms. They snap a photo and speak in Hindi.

```
INPUT  (Voice — Hindi):
  "Aaj raat 40 plate biryani bachi hai, kal tak kharab ho jayegi"

INPUT  (Image): [Photo of food containers on counter]

GEMINI OUTPUT (structured JSON):
{
  "food_name":         "Biryani",
  "quantity":          "~40 plates (est. 8 kg)",
  "language":          "Hindi",
  "dietary_type":      "Non-vegetarian",
  "storage":           "No refrigeration observed",
  "time_since_cooked": "~2–3 hours",
  "spoilage_window":   "12–14 hours",
  "urgency":           "HIGH",
  "allergen_flag":     "Possible nuts/traces"
}
```

**Why only Gemini?** No other API handles noisy multilingual voice + real-world food images + multi-step reasoning in a single, coherent call.

---

### 🔷 2. Contextual Spoilage Urgency Prediction

Gemini doesn't use a lookup table. It **reasons like a food safety expert.**

```
Context sent to Gemini:
  → Food type: Paneer Curry (dairy + protein)
  → Ambient temperature: 32°C (summer)
  → Time since cooked: 3 hours
  → Storage: Open vessel, no refrigeration

Gemini Reasoning:
  "Dairy-based protein in 32°C summer heat degrades rapidly.
   Per FSSAI safe-zone guidelines: max 4 hours unrefrigerated.
   Remaining window: ~1 hour.
   → URGENCY: CRITICAL. Dispatch within 30 minutes."
```

This is **contextual judgment under real-world constraints** — impossible with rule-based systems.

---

### 🔷 3. Intelligent Multi-Factor NGO Matching

**Nearest NGO ≠ Best NGO.** Gemini decides which organization actually gets the food.

```
Factors Gemini evaluates simultaneously:
  ✔  Distance (≤5 km preferred)
  ✔  NGO's current stated capacity
  ✔  Dietary compatibility (veg / non-veg)
  ✔  Volunteer availability at that NGO
  ✔  Historical pickup acceptance rate
  ✔  Food quantity vs. NGO serving size

Gemini Match Output:
  "Recommend: Roti Bank (2.3 km)
   Reason: Serves non-veg, volunteer on standby,
   historically accepts biryani, can serve 45+ people.
   → Confidence: 94%"
```

---

### 🔷 4. Multilingual — 20+ Indian Languages, Zero Friction

India has 22 official languages. Gemini processes **Hindi, Tamil, Kannada, Bengali, Marathi, Telugu** natively — no translation middleware, no data loss.

> This removes the **single greatest adoption barrier** for food donation in Tier 2/3 cities.

---

### 🔷 5. Weekly AI Waste-Reduction Insights for Donors

Gemini analyzes donation patterns to prevent surplus at the source:

> *"Your hostel wastes most food on Monday evenings after assembly. Reducing dal preparation by 15–20% on that day could prevent ~4 kg of weekly waste."*

ResQFood transforms from a rescue platform into a **waste prevention system.**

---

## ⚙️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         DONOR                                    │
│       [Text Input]    [Voice / Hindi]    [Image Upload]          │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│              GEMINI API — INTAKE & INTELLIGENCE LAYER            │
│                                                                  │
│  ┌──────────────────────┐    ┌───────────────────────────────┐   │
│  │  Multimodal Parser   │    │  Spoilage Urgency Predictor   │   │
│  │  (text+voice+image)  │    │  (contextual AI reasoning)    │   │
│  └──────────────────────┘    └───────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────┐    ┌───────────────────────────────┐   │
│  │  NGO Matching Engine │    │  Multilingual Processor       │   │
│  │  (multi-factor AI)   │    │  (20+ Indian languages)       │   │
│  └──────────────────────┘    └───────────────────────────────┘   │
└────────────────────────────┬─────────────────────────────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐
  │  NGO PORTAL  │  │  VOLUNTEER   │  │ DONOR DASHBOARD │
  │  Dashboard   │  │  Mobile App  │  │ + AI Insights   │
  │  Accept/Deny │  │  GPS Routing │  │ Impact Reports  │
  └──────┬───────┘  └──────┬───────┘  └─────────────────┘
         │                 │
         └────────┬────────┘
                  ▼
        ┌──────────────────────┐
        │   FOOD RESCUED ✅    │
        │   Impact Logged 📊   │
        └──────────────────────┘
```

---

## 🎬 Demo Flow — A Real Rescue in 5 Steps

> *Scenario: Mehul's Dhaba has 30 leftover plates after a wedding event. It's 10 PM.*

---

**Step 1 — Donor Lists Food** `~30 seconds`

```
Mehul opens ResQFood → taps "Donate Food"
Speaks (Hindi): "30 plate rajma chawal, hotel ke bahar ready hai"
→ Gemini transcribes · translates · extracts structured data
→ Spoilage window: 4 hours  |  Urgency: HIGH
```

**Step 2 — AI Matches Best NGO** `2 seconds, automated`

```
Gemini evaluates 3 nearby NGOs →
  "Asha Foundation" selected:
  ✔ 3.1 km away
  ✔ Vegetarian-compatible
  ✔ 40-person capacity available
  ✔ Volunteer on standby
  Confidence: 91%
```

**Step 3 — NGO Receives Alert** `instant push notification`

```
Asha Foundation coordinator sees:
  "30 plates Rajma Chawal at Mehul's Dhaba — 3.1 km
   Spoilage window: 4 hrs  |  Pickup needed by: 2:00 AM
   [Accept]   [Decline]"
→ Taps ACCEPT
```

**Step 4 — Volunteer Dispatched** `under 3 minutes`

```
Nearest volunteer Priya (1.2 km away):
→ GPS-routed pickup task sent to phone
→ Picks up → delivers → marks "Delivered"
→ Total elapsed time: 38 minutes
```

**Step 5 — Impact Logged** `automated`

```
Platform records:
  → 30 meals rescued
  → ~45 people fed
  → 6 kg CO₂ emissions avoided
  → Donor streak: "8 donations this month"
  → Mehul receives: "You fed 45 people tonight. Thank you."
```

---

## 🎯 Key Features

| Feature | What It Does | Why It Matters |
|---|---|---|
| 📣 **Voice-First Donation** | Donate by speaking in any language | Zero friction — no forms, no typing |
| 🌐 **20+ Language Support** | Gemini processes regional Indian languages natively | Unlocks Tier 2/3 city participation |
| ⏳ **Live Spoilage Timer** | Countdown on every food listing | Eliminates delays that cause waste |
| 🎯 **Smart NGO Matching** | 6-factor Gemini decision engine | Right food goes to the right place |
| 🗺️ **Volunteer GPS Routing** | Optimized pickup paths | Faster delivery, less fuel waste |
| 📊 **AI Waste Insights** | Weekly Gemini pattern analysis | Prevents surplus before it happens |
| 🏅 **Gamification** | Streaks, badges, leaderboards | Builds long-term donor habit |
| 📡 **Low-Connectivity Mode** | Critical actions work on 2G | Accessible anywhere in India |
| 🏢 **NGO Capacity Tracker** | NGOs update real-time availability | Prevents over-dispatch |
| 📈 **Impact Dashboard** | Live meals saved + CO₂ offset | Accountability and motivation |

---

## 🌍 Real-World Impact

### Who Benefits — and How

```
🍽️  DONORS  (Restaurants · Hotels · Hostels · Events)
     → Eliminate waste guilt
     → Earn verifiable CSR impact certificates
     → Gemini tells them HOW to waste less going forward

🏠  NGOs  (Orphanages · Old-age homes · Shelters · Kitchens)
     → Free, quality, AI-matched food — no cold-calling
     → Real-time alerts with food details, quantity, and ETA

🚴  VOLUNTEERS  (Students · Local heroes · Delivery partners)
     → GPS-guided tasks, zero confusion
     → Certificates, recognition, social impact credits

🌱  ENVIRONMENT
     → Every rescue: ~5 kg CO₂ avoided
     → Measurable SDG 12 (Responsible Consumption) contribution
```

### Impact at Scale

| Deployment Scale | Estimated Meals Rescued / Month |
|---|---|
| 1 city (Delhi NCR), 500 donors | ~1.5 lakh meals |
| 5 metro cities | ~7.5 lakh meals |
| 50 cities across India | ~75 lakh meals |
| National rollout (Tier 1 + Tier 2 cities) | **1 crore+ meals annually** |

> **194 million undernourished Indians. Thousands of restaurants discarding food daily. ResQFood + Gemini closes the gap.**

---

## 🧩 Why ResQFood Stands Out

| Dimension | ResQFood | Other Tools |
|---|---|---|
| **AI Role** | Gemini is the operational core | Bolted-on chatbots |
| **Language Support** | 20+ languages natively | English-only |
| **Spoilage Intelligence** | Contextual reasoning per food type | Static timers or none |
| **NGO Matching** | 6-factor AI decision | Nearest-distance only |
| **Donor UX** | Speak → done in 30 seconds | Multi-step forms |
| **Business Model** | Free for everyone | Paid or commercial |
| **India-Readiness** | 2G support + regional languages | Metro-centric |
| **Waste Prevention** | AI proactively reduces surplus | Purely reactive |

---

## 🔮 Future Roadmap

```
Phase 1  (Now – 3 months)    MVP: Gemini intake + matching + volunteer GPS routing
Phase 2  (3–6 months)        Partner with Zomato/Swiggy restaurant data APIs
Phase 3  (6–12 months)       Predictive surplus: Gemini warns BEFORE over-cooking
Phase 4  (12–18 months)      Municipal Corporation API + FSSAI compliance integration
Phase 5  (18–24 months)      Carbon credit generation for large recurring donors
Phase 6  (2+ years)          Southeast Asia · Africa · Middle East expansion
```

> **The multilingual engine is already built-in. Going global requires zero architectural changes.**

---

## 🛠️ Tech Stack

| Layer | Technology | Role |
|---|---|---|
| **AI Core** | Google Gemini 1.5 Pro | Multimodal intake · spoilage prediction · NGO matching |
| **Frontend** | React Native + Next.js | Mobile app + donor/NGO web dashboards |
| **Backend** | Node.js / FastAPI | API gateway · real-time event handling |
| **Database** | Firebase Realtime DB + PostgreSQL | Live updates + structured records |
| **Maps** | Google Maps API + Distance Matrix | Routing · proximity search |
| **Auth** | Firebase Auth (OTP-based) | Lightweight, no email required |
| **Notifications** | Firebase Cloud Messaging | Instant NGO + volunteer alerts |
| **Storage** | Firebase Storage | Food images |
| **Hosting** | Google Cloud Platform | Scalable, same ecosystem as Gemini |

---

## 📸 Screenshots

> *Replace placeholders with actual prototype screenshots before final submission*

| Screen | File |
|---|---|
| 🏠 Home / Donate CTA | `screenshots/01_home.png` |
| 🎙️ Voice Donation + Gemini Live Transcription | `screenshots/02_voice_input.png` |
| 🍛 AI Food Card with Spoilage Timer | `screenshots/03_food_listing.png` |
| 🎯 Gemini NGO Match Result | `screenshots/04_ngo_match.png` |
| 🗺️ Volunteer GPS Routing View | `screenshots/05_volunteer_map.png` |
| 📊 Gemini Weekly Waste Insights | `screenshots/06_donor_insights.png` |

---

## 🚀 Run Locally

```bash
# Clone
git clone https://github.com/Aayush9808/ResQFood.git
cd ResQFood

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Fill in: GEMINI_API_KEY · Firebase config · GOOGLE_MAPS_API_KEY

# Start dev server
npm run dev
```

---

## 👥 Team

> Built at **HackDays 2026** — Galgotias College of Engineering & Technology

| Name | Role |
|---|---|
| **Aayush Kumar Shrivastav** | Team Lead · Full Stack + Gemini AI Integration |
| *(Teammate 2)* | *(Role)* |
| *(Teammate 3)* | *(Role)* |
| *(Teammate 4)* | *(Role)* |

---

<div align="center">

---

> ### *"This is not just a platform. It's a lifeline."*

**194 million Indians are hungry. Tonnes of food are thrown away every single day.**  
**ResQFood + Gemini is how we fix that — starting today.**

---

*Built with purpose at HackDays 2026 · GCET × HackBase × MLH*

[![GitHub](https://img.shields.io/badge/GitHub-Aayush9808%2FResQFood-black?style=flat-square&logo=github)](https://github.com/Aayush9808/ResQFood)

</div>

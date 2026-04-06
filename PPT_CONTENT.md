# 📊 ResQFood — PPT Slide Content
### HackDays 2026 | Theme: Best Use of Google Gemini API Keys
> **Ready-to-paste content for each slide. Keep text crisp. Let visuals do the rest.**

---

---

## 🟦 SLIDE 1 — Title Slide

---

### HEADING (Center, Large)
# ResQFood

### TAGLINE (Below heading)
> *"Rescuing surplus food with AI, delivering hope in real-time."*

---

**Team Name:** `[Your Team Name]`

**Team Members:**
- `[Member 1 Name]` — `[Role]`
- `[Member 2 Name]` — `[Role]`
- `[Member 3 Name]` — `[Role]`
- `[Member 4 Name]` — `[Role]`

**Track:** AI/ML + Sustainability

**Event:** HackDays 2026 | GCET × HackBase × MLH

---

---

## 🟦 SLIDE 2 — Problem Statement & Solution

---

### HEADLINE
## The Food Paradox

---

### LEFT COLUMN — THE PROBLEM

**📌 The Numbers Don't Lie:**

- 🗑️ **1.3 billion tonnes** of food wasted every year *(FAO)*
- 😔 **194 million people** undernourished in India alone *(FAO, 2023)*
- 💸 India wastes food worth **₹92,000 crore** annually *(ASSOCHAM)*
- ⏱️ Cooked food is only safe for **2–4 hours** without refrigeration

---

**🔴 Core Problems:**

- Hotels, events, hostels over-cook — surplus goes to waste daily
- NGOs don't know what's available or where
- Manual coordination (WhatsApp calls) is too slow
- Language barriers block donations in Tier 2/3 cities
- **The food window closes in under 2 hours. No system acts fast enough.**

---

### RIGHT COLUMN — THE SOLUTION

**✅ ResQFood:**

> An AI platform that connects surplus food donors to NGOs — intelligently, instantly, in any language.

- Donor lists food in **30 seconds** (text / voice / image)
- **Gemini AI** extracts data + predicts spoilage urgency
- Best NGO matched **automatically**
- Volunteer dispatched with **GPS routing**
- Food rescued. People fed. Impact logged.

---

### HIGHLIGHT STAT (Bold, Center)
> **"The food exists. The people are hungry. The only missing piece is intelligence."**

---

---

## 🟦 SLIDE 3 — Tech Stack & APIs

---

### HEADLINE
## Built On. Powered By.

---

### CENTERPIECE — GEMINI API (Largest, Most Prominent)

```
🧠  GOOGLE GEMINI 1.5 PRO  ← Core Intelligence Engine
```

**What Gemini does in ResQFood:**

| Capability | How ResQFood Uses It |
|---|---|
| 📸 Multimodal Understanding | Reads food photos, voice clips, text — all at once |
| 🌐 Multilingual NLP | Processes Hindi, Tamil, Bengali, Marathi natively |
| 🧠 Contextual Reasoning | Predicts spoilage based on food type + temperature + time |
| 🎯 Decision Making | Selects best NGO from multiple factors simultaneously |
| 📊 Pattern Analysis | Generates weekly waste-reduction insights for donors |

---

**Supporting Stack:**

| Layer | Tech |
|---|---|
| Frontend | React Native (App) + Next.js (Web) |
| Backend | Node.js / FastAPI |
| Database | Firebase Realtime DB + PostgreSQL |
| Maps & Routing | Google Maps API + Distance Matrix |
| Notifications | Firebase Cloud Messaging |
| Auth | Firebase Auth (OTP) |
| Hosting | Google Cloud Platform |

---

### PUNCHLINE
> **"Other apps added a chatbot. We built Gemini into the core."**

---

---

## 🟦 SLIDE 4 — Workflow Diagram

---

### HEADLINE
## How a Rescue Happens in 5 Minutes

---

### FLOW DIAGRAM (Present as arrow chain)

```
┌──────────┐     ┌────────────────┐     ┌──────────────────┐
│  DONOR   │────▶│   GEMINI AI    │────▶│  DATA PROCESSOR  │
│          │     │                │     │                  │
│ Speaks / │     │ • Transcribes  │     │ • Structures     │
│ Photos   │     │ • Understands  │     │   food data      │
│ food     │     │ • Estimates    │     │ • Sets urgency   │
│          │     │   spoilage     │     │   timer          │
└──────────┘     └────────────────┘     └──────────────────┘
                                                 │
                                                 ▼
┌──────────┐     ┌────────────────┐     ┌──────────────────┐
│ DELIVERY │◀────│   VOLUNTEER    │◀────│  MATCHING ENGINE │
│  DONE ✅ │     │                │     │                  │
│          │     │ • GPS-routed   │     │ • Gemini picks   │
│ Impact   │     │   pickup       │     │   best NGO       │
│ logged   │     │ • Marks        │     │ • NGO accepts    │
│          │     │   complete     │     │   with 1 tap     │
└──────────┘     └────────────────┘     └──────────────────┘
```

---

### SIMPLIFIED VERSION (For slide visual)

```
  DONOR  ──▶  GEMINI AI  ──▶  URGENCY CHECK  ──▶  NGO MATCH  ──▶  VOLUNTEER  ──▶  DELIVERY ✅
```

---

### REAL EXAMPLE LINE
> Mehul (Hindi): *"30 plate rajma ready hai"* → Gemini → Asha Foundation (3.1km) → Priya (volunteer) → **38 minutes. 45 people fed.**

---

---

## 🟦 SLIDE 5 — Architecture Diagram

---

### HEADLINE
## System Architecture

---

```
═══════════════════════════════════════════════════════════════
                        INPUT LAYER
───────────────────────────────────────────────────────────────
   [Text Input]        [Voice Input]        [Image Upload]
   (Any language)      (Hindi/Tamil/etc.)   (Food photo)
═══════════════════════════════════════════════════════════════
                    ▼         ▼         ▼
═══════════════════════════════════════════════════════════════
                  AI LAYER  —  GOOGLE GEMINI 1.5 PRO
───────────────────────────────────────────────────────────────
  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐
  │  Multimodal  │  │  Spoilage    │  │   NGO Matching      │
  │  Parser      │  │  Predictor   │  │   Engine            │
  │              │  │  (Urgency)   │  │   (6-factor AI)     │
  └──────────────┘  └──────────────┘  └─────────────────────┘
═══════════════════════════════════════════════════════════════
                         ▼
═══════════════════════════════════════════════════════════════
                      BACKEND LOGIC
───────────────────────────────────────────────────────────────
     Node.js API  |  Firebase Realtime DB  |  Maps API
═══════════════════════════════════════════════════════════════
                         ▼
═══════════════════════════════════════════════════════════════
                      OUTPUT LAYER
───────────────────────────────────────────────────────────────
  ┌─────────────┐    ┌──────────────┐    ┌─────────────────┐
  │ NGO PORTAL  │    │  VOLUNTEER   │    │ DONOR DASHBOARD │
  │ Alert+Accept│    │  GPS + Task  │    │  AI Insights    │
  └─────────────┘    └──────────────┘    └─────────────────┘
═══════════════════════════════════════════════════════════════
                    FOOD RESCUED ✅
═══════════════════════════════════════════════════════════════
```

---

---

## 🟦 SLIDE 6 — USP (Unique Selling Points)

---

### HEADLINE
## Why ResQFood Wins

---

### 6 POWER POINTS (One per callout card on slide)

---

**🧠 1. Gemini is the Engine, Not an Add-on**
> Most apps bolt on a chatbot. Gemini IS ResQFood's coordinator.
> Remove Gemini → the platform stops working.

---

**🌐 2. Truly Multilingual — Built for India**
> Hindu, Tamil, Kannada, Bengali — Gemini handles all, natively.
> First food rescue platform usable by a Tier 3 city cook.

---

**⏱️ 3. Spoilage Intelligence — Not Just a Timer**
> Gemini reasons: food type + temperature + time = exact urgency.
> No other app predicts *when* food will go bad contextually.

---

**🎯 4. Smart Matching — 6 Factors, Not Just Distance**
> Distance + capacity + diet + volunteer + history + quantity.
> The right food reaches the right NGO, every time.

---

**🚫 5. Zero Friction for Donors**
> Speak for 15 seconds. Photo optional. Done.
> No forms. No sign-up complexity. Built for busy kitchen staff.

---

**📊 6. Prevents Waste, Doesn't Just React to It**
> Gemini's weekly insights tell donors HOW to cook less surplus.
> The only platform that addresses root cause, not just symptoms.

---

### BOTTOM HIGHLIGHT
> **"194M Indians are hungry. Tonnes of food are discarded daily. ResQFood + Gemini is the fix."**

---

---

## 🟦 SLIDE 7 — Feasibility

---

### HEADLINE
## This Works. Today. At Scale.

---

### 4 PILLARS (2×2 grid layout on slide)

---

**⚡ BUILDABLE NOW**
- Gemini API: live and accessible
- Firebase + Google Maps: production-ready
- MVP deployable in 2–3 weeks
- No proprietary hardware needed

---

**🔌 API-FIRST ARCHITECTURE**
- Google Gemini 1.5 Pro — handles all AI logic
- Google Maps — routing already integrated
- Firebase — real-time sync without extra infra
- Standard REST backend — any developer can extend it

---

**📈 HIGHLY SCALABLE**

| Scale | What Changes |
|---|---|
| 1 city | Same codebase |
| 10 cities | Add city-wise NGO DB |
| National | Cloud auto-scaling (GCP) |
| Global | Language support already built |

---

**🌍 REAL-WORLD READY**
- Works on 2G (low-connectivity mode)
- OTP login — no email, no barrier
- Handles Hindi/Tamil/Kannada — Day 1
- FSSAI food safety logic embedded in Gemini prompts

---

### BOTTOM PUNCHLINE
> **"This isn't a prototype that needs years of R&D. It needs 3 weeks and a Gemini API key."**

---

---

## 🟦 SLIDE 8 — Impact & Vision

---

### HEADLINE
## From a Hackathon to a Movement

---

### IMPACT NUMBERS (Big, bold, center)

| | |
|---|---|
| 🍽️ **45 people fed** | Per single rescue event |
| 🌍 **5 kg CO₂ saved** | Per rescue |
| 📱 **30 seconds** | Time to list food |
| 🇮🇳 **1 crore+ meals** | Potential annually at national scale |

---

### FUTURE ROADMAP (Timeline format)

```
Now       →  MVP + Gemini integration  
3 months  →  Partner with Zomato/Swiggy surplus data  
6 months  →  Predictive surplus (Gemini warns before over-cooking)  
12 months →  Carbon credits for large donors  
2 years   →  Southeast Asia · Africa · Middle East  
```

---

### 3 CLOSING IMPACT LINES (One per line, increasing weight)

> *"Every day in India, enough food is wasted to feed every hungry child twice over."*

> *"We're not building an app. We're building the infrastructure for a hunger-free India."*

> **"This is not just reducing waste. This is saving lives."**

---

### FINAL CTA (Bottom of slide)

```
🔗 GitHub:   github.com/Aayush9808/ResQFood
📧 Contact:  ashrivastav2209@gmail.com
```

---

---

> ## 💡 PRESENTER TIPS
>
> - **Slide 2:** Lead with the 194M stat. Let the silence after that number land.
> - **Slide 3:** Point directly at "Gemini 1.5 Pro" and say *"This is the entire brain of our system."*
> - **Slide 4:** Walk through the Mehul example live — it makes the flow real.
> - **Slide 6:** Pick your top 3 USPs to speak about; don't read all 6.
> - **Slide 8:** End on the closing line. Pause. Don't rush.

---

*ResQFood · HackDays 2026 · Built with Google Gemini*

# SoftScanner Web UI – Continuous Quality Assessment Frontend
This is the **SoftScanner Web UI**, an **Angular-based interactive frontend** designed to support the **continuous quality assessment** of web applications as part of the **SoftScanner** platform. The UI allows users to select quality goals, track metrics, and visualize assessments dynamically.

SoftScanner's assessment pipeline automates **instrumentation, telemetry collection, metric computation, and quality evaluation** based on the **SoftScanner Quality Mapping Model (SSQMM)**, which aligns with the **ISO/IEC 25010 (2023) quality standards**.

---

## 🌟 Key Features
- **📊 Continuous Quality Assessment** → Supports **timestamped goal assessments** with **real-time updates**.
- **📈 Interactive Data Visualization** → Line charts for goal evolution & bar charts for metric contributions.
- **📡 API-Driven Architecture** → Seamlessly integrates with the SoftScanner backend.
- **🗂️ Modular & Scalable** → Components are structured for **reusability and scalability**.
- **🔗 Non-Intrusive Analysis** → Works **without modifying source code**, leveraging **automated instrumentation**.
- **⚡ Real-Time SSE Updates** → Fetches **live assessment progress & results** via **Server-Sent Events (SSE)**.

---

## Demo & Tutorial Videos
### SoftScanner Platform Videos
- [Installation of SoftScanner](https://youtu.be/gejrlsAMwnw)
- [Installation and Overview of an Angular/Node.js Test Application](https://youtu.be/pnItMPW2JiE)
- [Using SoftScanner with an Angular Web Application for User Engagement](https://youtu.be/jpTOXk8TpBE)

### Continuous Quality Assessment for Web Applications (CQAWA) Challenge Videos
- [CQAWA Challenge 1: Reconciling Diverse Stakeholder Quality Perspectives](https://youtu.be/VmfXqgDhzWE)
- [CQAWA Challenge 2: Bridging the Gap Between Conceptual Quality Goals and Technical Observable Data](https://youtu.be/7OCJfO5lQ64)
- [CQAWA Challenge 3: Minimizing Performance Overhead in Data Collection](https://youtu.be/Zsnhsx9Lc1M)
- [CQAWA Challenge 4: Minimizing Codebase Modifications for Instrumentation](https://youtu.be/bLY8h29H934)

---

## 📁 Project Structure
```plaintext
src/app
├── components
│   ├── metadata-form               # Handles metadata input for assessment
│   ├── quality-assessment          # Orchestrates the quality assessment process
│   ├── quality-model               # Displays the goal-based quality model
├── modules
│   ├── material.module.ts          # Angular Material modules encapsulated here
├── services
│   ├── api.service.ts              # Handles backend communication
│   ├── chart-data.service.ts       # Provides visualization data
├── shared
│   ├── components
│   │   ├── collapsible-goal-panels # Organizes selected goals dynamically
│   │   ├── goal-assessment-overview# Displays goal assessment history
│   │   ├── goal-details            # Shows details of selected goals
│   │   ├── metric-details          # Displays metric-specific information
│   │   ├── metrics-dashboard       # Handles per-metric tracking
│   │   ├── progress-bar            # Tracks real-time assessment progress
│   ├── models
│   │   └── types.model.ts          # Contains data types and interfaces
├── app-routing.module.ts
├── app.component.ts                # Root component (hosts Quality Assessment)
├── app.module.ts
```

---

## 🔧 Setup & Installation
### 1️⃣ Prerequisites
Ensure you have the following installed:
- **Node.js** (>= 14.x)
- **Angular CLI** (>= 12.x)

### 2️⃣ Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/softscanner-sw/softscanner-web-ui.git
cd softscanner-web-ui
npm install
```

### 3️⃣ Running the Application
Start the development server:
```bash
ng serve
```
Then, open **[http://localhost:4200](http://localhost:4200)** in your browser.

---

## 📡 API Integration
SoftScanner Web UI communicates with the **SoftScanner Backend** to fetch **quality models, metrics, and assessment results**.

### 🔗 Key API Endpoints
| Method   | Endpoint                            | Description                                              |
| -------- | ----------------------------------- | -------------------------------------------------------- |
| **GET**  | `/api/quality-model`                | Retrieves the quality model and associated goals.        |
| **POST** | `/api/assessment`                   | Initiates a quality assessment based on user selections. |
| **GET**  | `/api/progress?assessmentId=XYZ`    | Streams real-time progress updates via SSE.              |
| **GET**  | `/api/assessments?assessmentId=XYZ` | Streams assessment results via SSE.                      |

---

## 📊 Visualization Components
| Component                    | Description                                             |
| ---------------------------- | ------------------------------------------------------- |
| **Goal Assessment Overview** | Tracks goal performance evolution over time.            |
| **Metrics Dashboard**        | Displays per-metric details, including historical data. |
| **Collapsible Goal Panels**  | Provides an intuitive interface to explore goals.       |
| **Progress Bar**             | Displays real-time assessment progress updates.         |

---

## 🛠️ How It Works
1. **Select Quality Goals** → Users specify the quality goals they want to assess.
2. **Automated Instrumentation** → The backend **injects telemetry agents** into the web application.
3. **Data Collection** → The instrumented application dynamically collects **metrics** as the user interacts with it.
4. **Real-Time Visualization** → The UI updates charts based on **live assessment results** streamed via SSE.

---

## 🖥️ Connecting with SoftScanner Backend
SoftScanner Web UI is designed to work **seamlessly** with the **SoftScanner backend**. Ensure the backend is running on `http://localhost:3000` before launching the frontend.

For backend setup instructions, please refer to the [SoftScanner Backend Repository](https://github.com/softscanner-sw/softscanner-backend).

---

## 🌍 Example Usage
### **1️⃣ Starting an Assessment**
1. Launch the **SoftScanner Backend** (`npm start`).
2. Open the **SoftScanner Web UI** (`ng serve`).
3. **Select quality goals** via the UI.
4. Click **"Start Assessment"** to initiate the process.
5. Open your web application **in a browser** in multiple tabs for multiple sessions and interact with the application → SoftScanner will **automatically analyze interactions**.

### 2️⃣ Viewing Results
- **Real-time Updates** View live progress and assessment results.
- **Interactive Charts:** Analyze goal assessment history with dynamic line charts.
- **Metric Contributions:** Understand metric impact via detailed bar charts.

---

## Version 2.5.0
This release introduces major improvements:
- **Angular Material Integration:** UI components now leverage Angular Material for a modern, consistent look and feel. All required modules are encapsulated in a new `MaterialModule`.
- **Quality Assessment Orchestrator:** A new **Quality Assessment** component has been introduced. It now serves as the central orchestrator for the assessment process, offloading responsibilities from the root `AppComponent`.
- **Simplified AppComponent:** The root component now hosts a single child—the Quality Assessment component—resulting in a cleaner and more modular architecture.

---

## 📜 License
SoftScanner Web UI is licensed under the **MIT License**.

# Urraan Online Training - Task 05: Student Task & Study Goal Hub (EduTrack)

## 📌 Project Overview
**EduTrack** is a modern, responsive, high-performance Vanilla JavaScript web application crafted specifically for students to organize, manage, and accomplish their homework, assignments, exam preparation, and personal study goals.

Built from the ground up using **semantic HTML5**, **Vanilla CSS3** (no external framework bloat), and **modular Vanilla JavaScript**, the application delivers a fluid user experience featuring persistent storage, intuitive drag-and-drop task reordering, real-time statistics, deadline tracking, and light/dark theme support.

---

## 🚀 Key Features & Requirements Matrix

| Requirement | Implementation Details |
| :--- | :--- |
| **Add New Tasks** | Clean, accessible input form for task name, optional study notes/details, category, priority, and due dates with quick-date shortcut chips (*Today*, *Tomorrow*, *In 1 Week*). |
| **Display All Tasks** | Rich dynamic cards displaying completion checkbox, drag grip handle, task title, notes, category badges, priority indicators, relative due date countdowns, and quick actions. |
| **Mark as Completed** | Custom-styled animated checkbox with smooth line-through styling, state change toasts, and live updates to stats & progress bars. |
| **Edit Task Names & Details** | Full-featured edit modal allowing modification of task titles, notes, categories, priorities, and deadlines with keyboard accessibility (`Esc` to dismiss). |
| **Delete Tasks** | Instant task deletion with action notifications, plus a *Clear Completed* bulk action. |
| **Search by Name** | Instant real-time filtering as you type, matching against task names, descriptions, and category tags, with a one-click clear button and `/` keyboard shortcut. |
| **Filter by Status** | Tabbed filters for **All**, **Pending**, **Completed**, and **Overdue** tasks. |
| **LocalStorage Persistence** | Automatic synchronization of all tasks, ordering, and theme preferences to browser `localStorage` (`edutrack_tasks_v1`). Pre-seeded with realistic study goals on first run. |
| **Dashboard Statistics** | Top analytical cards displaying **Total Tasks**, **Pending Tasks**, **Completed Tasks**, and **Overdue Tasks**, accompanied by a gradient progress bar and motivational study mottos. |
| **Due Dates & Overdue Detection** | Due date pickers with relative human-readable badges (e.g. *Due Today*, *Due Tomorrow*, *In 3 days*). Overdue tasks are highlighted with red glow alerts (`⚠️ Overdue by X days`). |
| **Sorting Options** | Dropdown sorting by **Custom Drag Order**, **Due Date (Earliest / Latest)**, **Priority (Urgent → Low)**, and **Alphabetical (A-Z / Z-A)**. |
| **Task Categories** | 4 curated academic categories with distinct color codes and icons: **📚 Homework**, **📝 Assignment**, **🎯 Exam**, and **🌟 Personal**. Includes category filter dropdown. |
| **Drag & Drop Reordering** | Native HTML5 Drag and Drop API with visual ghosting, dynamic drop-indicator guides, and automatic saving of custom order to `localStorage`. |
| **Dark Mode Support** | Sleek dual-theme design system (Light Slate & Deep Obsidian Night) with smooth transitions, animated theme toggle, and auto-detection of OS system preferences. |
| **Data Backup & Export** | One-click JSON backup export button allowing students to download their task database. |

---

## 🎨 Design & Aesthetics
- **Gold Glassmorphic Architecture**: Ultra-premium frosted glass cards featuring multi-layered backdrop blur (`backdrop-filter: blur(18px) saturate(180%)`), golden specular inner highlights (`inset 0 1px 1px rgba(255, 255, 255, 0.8)`), fine gold-trimmed translucent borders (`rgba(212, 175, 55, 0.32)`), and radiant golden elevation shadows.
- **Dynamic Gold Ambient Background**: Fixed multi-stop gold mesh gradient canvas with 3 continuously drifting golden ambient orbs (`glow-1`, `glow-2`, `glow-3`) with smooth keyframe animations and a subtle gold stardust sparkle mesh.
- **Dual Luxury Gold Themes**:
  - **✨ Champagne Pearl Gold Glass (Light)**: Luminous warm ivory champagne backdrop with polished golden controls, molten gold progress bar, and crystal frosted surfaces.
  - **🌙 Royal Obsidian Onyx Gold Glass (Dark)**: Deep obsidian onyx canvas infused with glowing amber/gold nebulae, golden frosted glass cards, and high-contrast warm cream typography.
- **Modern Typography**: Styled with Google Fonts **Plus Jakarta Sans** (headings) and **Inter** (body) for clean legibility and gold gradient title treatment.
- **Micro-Interactions**: Smooth hover elevations, button active presses, checkbox toggle animations, and transient toast feedback.
- **Accessibility**: ARIA labels, semantic roles, high-contrast badges, keyboard focus rings, and screen-reader polite regions.

---

## 📁 Project Structure
```
Task 05/
├── index.html       # Semantic HTML5 single-page application layout
├── style.css        # Vanilla CSS3 styling, design tokens & dark mode overrides
├── script.js        # Core Vanilla JS state management, drag & drop, and CRUD logic
└── README.md        # Comprehensive documentation and feature guide
```

---

## 🛠️ How to Run Locally

### Option 1: Direct Browser Launch
1. Navigate to `Task 05/` in your file explorer.
2. Double-click **`index.html`** to open it directly in Google Chrome, Microsoft Edge, Firefox, or Safari.

### Option 2: VS Code Live Server
1. Open the `Task 05` folder in **Visual Studio Code**.
2. Right-click on **`index.html`** and select **"Open with Live Server"**.
3. The application will launch at `http://127.0.0.1:5500/index.html`.

---

## ⌨️ Useful Keyboard Shortcuts
- **`/`**: Instantly focuses the task search input.
- **`Enter`**: Submits the *Add Task* form or saves the *Edit Modal*.
- **`Escape`**: Closes the task edit modal.

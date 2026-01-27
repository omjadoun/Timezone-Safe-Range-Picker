
# Timezone-Safe Date & Time Range Picker

A high-performance, accessible, and timezone-aware date/time range picker built from scratch with React, TypeScript, and Tailwind CSS.

## 🚀 Key Features

- **Timezone-Aware**: Built using the native `Intl` API to handle complex timezone conversions and DST transitions without heavy external libraries.
- **DST Ambiguity Handling (Option A)**:
  - **Spring Forward**: Automatically detects and prevents selection of "non-existent" times during DST gaps.
  - **Fall Back**: Detects ambiguous times (times that occur twice) and presents a premium choice modal for the user to specify their intended occurrence.
- **Accessibility**: Full keyboard navigation support (arrow keys for calendar, tab for time inputs) and ARIA grid semantics.
- **Sub-Component Architecture**: Individual components for Calendar, TimePicker, and Timezone selection are exposed for modular use.
- **Storybook & Chromatic**: Comprehensive documentation of states and edge cases, integrated with Chromatic for visual regression testing.

## 🛠️ Tech Stack

- **Framework**: React 18 (Vite)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS
- **Testing**: Storybook 7 + Chromatic
- **Linting**: ESLint + TypeScript ESLint

## 📦 Getting Started

### Installation
```bash
npm install
```

### Run Locally
```bash
npm run dev
```

### Run Storybook
```bash
npm run storybook
```

### Build for Production
```bash
npm run build
```

## 🧩 Usage

```tsx
import { RangePicker } from './components/RangePicker';

function App() {
  return (
    <RangePicker
      constraints={{
        minDurationMinutes: 30,
        maxDurationMinutes: 10080
      }}
    />
  );
}
```

## 🧪 Testing DST
To test the advanced DST logic:
1. Set timezone to **New York**.
2. **Spring Forward**: Go to March 8, 2026, and try to select 02:30 AM.
3. **Fall Back**: Go to November 2, 2025, and select 01:30 AM to see the Choice Overlay.
=======
# Timezone-Safe-Range-Picker


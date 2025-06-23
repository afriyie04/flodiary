# Component Extraction Summary

This document summarizes all the reusable components that were extracted from the FloDiary codebase to improve code organization and reusability.

## New Components Created

### 1. **DashboardSidebar** (`src/components/DashboardSidebar.jsx`)
- **Purpose**: Reusable sidebar navigation for all dashboard pages
- **Features**: 
  - Mobile responsive with overlay
  - Navigation items with icons
  - Active state management
  - Auto-close on mobile
- **Props**: `sidebarOpen`, `setSidebarOpen`, `activePage`
- **Used in**: HomePage, CalendarPage, SymptomsPage, CycleHistoryPage, ProfilePage

### 2. **MobileHeader** (`src/components/MobileHeader.jsx`)
- **Purpose**: Mobile-only header with hamburger menu
- **Features**: 
  - Hamburger menu button
  - Page title display
  - Responsive design (hidden on desktop)
- **Props**: `title`, `onMenuClick`
- **Used in**: All dashboard pages (via DashboardLayout)

### 3. **DashboardLayout** (`src/components/DashboardLayout.jsx`)
- **Purpose**: Complete layout wrapper for dashboard pages
- **Features**: 
  - Combines sidebar and mobile header
  - Manages sidebar state
  - Consistent layout structure
- **Props**: `children`, `activePage`, `title`
- **Used in**: HomePage, CalendarPage, SymptomsPage, CycleHistoryPage, ProfilePage

### 4. **PageHeader** (`src/components/PageHeader.jsx`)
- **Purpose**: Consistent page headers with title and subtitle
- **Features**: 
  - Responsive typography
  - Optional mobile title display
  - Subtitle support
- **Props**: `title`, `subtitle`, `showMobileTitle`
- **Used in**: All dashboard pages

### 5. **StatsCard** (`src/components/StatsCard.jsx`)
- **Purpose**: Reusable statistics display cards
- **Features**: 
  - Customizable background colors
  - Responsive sizing
  - Title, value, and unit display
- **Props**: `title`, `value`, `unit`, `bgColor`
- **Used in**: HomePage, CycleHistoryPage

### 6. **CalendarGrid** (`src/components/CalendarGrid.jsx`)
- **Purpose**: Interactive calendar display with cycle data
- **Features**: 
  - Color-coded days (period, fertile, ovulation, current)
  - Week headers
  - Different sizes (default, large)
  - Click handlers for days
  - Responsive design
- **Props**: `days`, `periodDays`, `fertileDays`, `ovulationDays`, `currentDay`, `onDayClick`, `size`
- **Used in**: HomePage, CalendarPage

### 7. **CalendarLegend** (`src/components/CalendarLegend.jsx`)
- **Purpose**: Legend for calendar color meanings
- **Features**: 
  - Color indicators for period, fertile, ovulation
  - Responsive sizing
  - Multiple size variants
- **Props**: `size`
- **Used in**: HomePage, CalendarPage

### 8. **ToggleSwitch** (`src/components/ToggleSwitch.jsx`)
- **Purpose**: Reusable toggle switch for settings
- **Features**: 
  - Multiple size variants (small, default, large)
  - Smooth animations
  - Accessible click handling
- **Props**: `enabled`, `onChange`, `size`
- **Used in**: ProfilePage

### 9. **FormInput** (`src/components/FormInput.jsx`)
- **Purpose**: Consistent form input styling
- **Features**: 
  - Label support with required indicators
  - Pink background with purple focus states
  - Consistent styling across all forms
  - Supports all input types
- **Props**: `label`, `type`, `name`, `value`, `onChange`, `placeholder`, `required`, `className`, `...props`
- **Used in**: LoginPage, SignupPage, ProfilePage

## File Structure Changes

### Before Extraction
```
src/
├── components/
│   ├── Footer.jsx
│   └── NavigationBar.jsx
└── pages/
    ├── HomePage.jsx (800+ lines with duplicated sidebar code)
    ├── CalendarPage.jsx (600+ lines with duplicated sidebar code)
    ├── SymptomsPage.jsx (500+ lines with duplicated sidebar code)
    ├── CycleHistoryPage.jsx (400+ lines with duplicated sidebar code)
    ├── ProfilePage.jsx (600+ lines with duplicated sidebar code)
    ├── LoginPage.jsx (repetitive form styling)
    └── SignupPage.jsx (repetitive form styling)
```

### After Extraction
```
src/
├── components/
│   ├── Footer.jsx
│   ├── NavigationBar.jsx
│   ├── DashboardSidebar.jsx ⭐ NEW
│   ├── MobileHeader.jsx ⭐ NEW
│   ├── DashboardLayout.jsx ⭐ NEW
│   ├── PageHeader.jsx ⭐ NEW
│   ├── StatsCard.jsx ⭐ NEW
│   ├── CalendarGrid.jsx ⭐ NEW
│   ├── CalendarLegend.jsx ⭐ NEW
│   ├── ToggleSwitch.jsx ⭐ NEW
│   └── FormInput.jsx ⭐ NEW
└── pages/
    ├── HomePage.jsx (reduced to ~150 lines)
    ├── CalendarPage.jsx (reduced to ~120 lines)
    ├── SymptomsPage.jsx (reduced to ~130 lines)
    ├── CycleHistoryPage.jsx (reduced to ~90 lines)
    ├── ProfilePage.jsx (reduced to ~180 lines)
    ├── LoginPage.jsx (cleaner with FormInput)
    └── SignupPage.jsx (cleaner with FormInput)
```

## Benefits Achieved

### 1. **Code Reduction**
- **Total lines reduced**: ~2000+ lines of duplicated code eliminated
- **HomePage**: 800+ → 150 lines (81% reduction)
- **CalendarPage**: 600+ → 120 lines (80% reduction)
- **SymptomsPage**: 500+ → 130 lines (74% reduction)
- **CycleHistoryPage**: 400+ → 90 lines (78% reduction)
- **ProfilePage**: 600+ → 180 lines (70% reduction)

### 2. **Consistency**
- All dashboard pages now use identical sidebar/navigation
- Consistent form styling across login/signup/profile
- Unified calendar display logic
- Standardized stats card appearance

### 3. **Maintainability**
- Single source of truth for each component
- Bug fixes apply to all usage locations
- Easy to add new dashboard pages
- Simplified testing (test components in isolation)

### 4. **Reusability**
- Components can be easily reused in new pages
- Props-based customization
- Flexible sizing and styling options

### 5. **Developer Experience**
- Cleaner, more readable page files
- Easier to understand page-specific logic
- Better component organization
- Faster development of new features

## Usage Examples

### Adding a New Dashboard Page
```jsx
import DashboardLayout from "../components/DashboardLayout";
import PageHeader from "../components/PageHeader";

function NewPage() {
  return (
    <DashboardLayout activePage="new-page" title="New Page">
      <div className="max-w-4xl mx-auto">
        <PageHeader 
          title="New Page"
          subtitle="Description of the new page"
        />
        {/* Page content */}
      </div>
    </DashboardLayout>
  );
}
```

### Using Form Components
```jsx
import FormInput from "../components/FormInput";

function MyForm() {
  return (
    <form>
      <FormInput
        label="Email"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
    </form>
  );
}
```

### Using Calendar Components
```jsx
import CalendarGrid from "../components/CalendarGrid";
import CalendarLegend from "../components/CalendarLegend";

function MyCalendar() {
  return (
    <div>
      <CalendarGrid 
        days={days}
        periodDays={[1,2,3]}
        fertileDays={[14,15]}
        size="large"
      />
      <CalendarLegend size="large" />
    </div>
  );
}
```

This extraction significantly improves the codebase maintainability, reduces duplication, and makes it much easier to add new features or make changes across the application. 
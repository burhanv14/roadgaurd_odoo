# Theme System Documentation

This project includes a comprehensive theme system that supports light mode, dark mode, and automatic system theme detection.

## Features

- ✅ **Light/Dark Mode**: Manual theme selection
- ✅ **System Theme**: Automatic detection of system preference
- ✅ **Persistent Storage**: Theme preference saved in localStorage
- ✅ **SSR Compatible**: No hydration mismatches
- ✅ **Real-time Updates**: Responds to system theme changes
- ✅ **TypeScript Support**: Fully typed theme system
- ✅ **Tailwind Integration**: Uses CSS custom properties for seamless theme switching

## Quick Start

### 1. Using the Theme Hook

```tsx
import { useTheme } from '@/hooks/useTheme';

function MyComponent() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  
  return (
    <div>
      <p>Current theme: {theme}</p>
      <p>Resolved theme: {resolvedTheme}</p>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('system')}>System Mode</button>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### 2. Using Theme Components

```tsx
import { ThemeToggle } from '@/components/ui/ThemeToggle';

function Header() {
  return (
    <header>
      {/* Simple icon toggle */}
      <ThemeToggle variant="icon" />
      
      {/* Dropdown selector */}
      <ThemeToggle variant="dropdown" />
      
      {/* Segmented control */}
      <ThemeToggle variant="segmented" />
    </header>
  );
}
```

### 3. Conditional Rendering Based on Theme

```tsx
import { useIsDark, useIsLight, useResolvedTheme } from '@/hooks/useTheme';

function ThemedComponent() {
  const isDark = useIsDark();
  const isLight = useIsLight();
  const resolvedTheme = useResolvedTheme();
  
  if (isDark) {
    return <div>Dark mode content</div>;
  }
  
  return <div>Light mode content</div>;
}
```

## Hook Reference

### `useTheme()`

Main hook for theme management.

**Returns:**
- `theme`: Current theme setting (`'light' | 'dark' | 'system'`)
- `resolvedTheme`: Actual applied theme (`'light' | 'dark'`)
- `systemTheme`: Current system preference (`'light' | 'dark'`)
- `setTheme(theme)`: Function to set theme
- `toggleTheme()`: Function to toggle between themes
- `getSystemTheme()`: Function to get current system theme
- `mounted`: Boolean indicating if component has mounted (SSR safety)

### `useResolvedTheme()`

Lightweight hook that returns only the resolved theme.

### `useIsDark()` / `useIsLight()`

Boolean hooks for checking current theme state.

## Component Reference

### `ThemeToggle`

Flexible theme toggle component with multiple variants.

**Props:**
- `variant`: `'icon' | 'dropdown' | 'segmented'` (default: `'icon'`)
- `className`: Additional CSS classes

**Variants:**
- **icon**: Simple button with sun/moon icons
- **dropdown**: Select dropdown with all options
- **segmented**: Segmented control with icons and labels

## Theme Structure

The theme system uses Tailwind CSS custom properties defined in `src/index.css`:

```css
:root {
  /* Light theme variables */
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* ... more variables */
}

.dark {
  /* Dark theme variables */
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... more variables */
}
```

## CSS Classes

Use these Tailwind classes for theme-aware styling:

### Backgrounds
- `bg-background`: Main background
- `bg-card`: Card/surface background
- `bg-muted`: Muted background

### Text
- `text-foreground`: Primary text
- `text-muted-foreground`: Secondary text
- `text-primary`: Accent text

### Borders
- `border-border`: Standard borders
- `border-input`: Input borders

### Example Usage

```tsx
function Card({ children }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h2 className="text-foreground text-xl font-semibold mb-2">
        Card Title
      </h2>
      <p className="text-muted-foreground">
        {children}
      </p>
    </div>
  );
}
```

## System Integration

### ThemeProvider Setup

The `ThemeProvider` is already configured in `App.tsx`:

```tsx
import { ThemeProvider } from '@/contexts/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      {/* Your app content */}
    </ThemeProvider>
  );
}
```

### Storage

Theme preferences are automatically persisted to `localStorage` under the key `roadguard-theme`.

### System Theme Detection

The system automatically detects and responds to changes in the user's system theme preference using the `prefers-color-scheme` media query.

## Utilities

Additional theme utilities are available in `@/lib/theme.utils.ts`:

```tsx
import { 
  getThemeClasses, 
  applyTheme, 
  getSystemTheme,
  createThemeMediaQuery 
} from '@/lib/theme.utils';
```

## Best Practices

1. **Use Theme Variables**: Always use the predefined CSS custom properties instead of hard-coded colors.

2. **Test Both Themes**: Ensure your components work well in both light and dark modes.

3. **Respect System Preference**: Default to `system` theme to respect user's OS preference.

4. **Handle SSR**: Use the `mounted` property from `useTheme()` to avoid hydration mismatches.

5. **Performance**: Use lighter hooks like `useResolvedTheme()` when you don't need the full theme state.

## Troubleshooting

### Theme Not Persisting
Check if localStorage is available and not blocked.

### Hydration Mismatch
Use the `mounted` property to conditionally render theme-dependent content:

```tsx
const { resolvedTheme, mounted } = useTheme();

if (!mounted) {
  return <div>Loading...</div>;
}

return <div className={resolvedTheme === 'dark' ? 'dark-content' : 'light-content'} />;
```

### Custom Colors Not Working
Ensure you're using the CSS custom properties defined in `index.css` and that they're properly configured in your Tailwind config.

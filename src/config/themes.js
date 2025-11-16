// Theme configurations
export const themes = {
  default: {
    name: 'Default',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#EC4899',
      success: '#10B981',
      warning: '#F59E0B',
      danger: '#EF4444',
      background: '#F9FAFB',
      surface: '#FFFFFF',
      text: '#1F2937',
      textLight: '#6B7280',
      border: '#E5E7EB'
    },
    fonts: 'Inter, sans-serif',
    spacing: 'normal'
  },
  dark: {
    name: 'Dark Mode',
    colors: {
      primary: '#10B981',
      secondary: '#F59E0B',
      accent: '#06B6D4',
      success: '#34D399',
      warning: '#FBBF24',
      danger: '#F87171',
      background: '#111827',
      surface: '#1F2937',
      text: '#F3F4F6',
      textLight: '#9CA3AF',
      border: '#374151'
    },
    fonts: 'Courier, monospace',
    spacing: 'compact'
  },
  minimal: {
    name: 'Minimal',
    colors: {
      primary: '#000000',
      secondary: '#808080',
      accent: '#333333',
      success: '#228B22',
      warning: '#FFB800',
      danger: '#DC143C',
      background: '#FFFFFF',
      surface: '#F5F5F5',
      text: '#000000',
      textLight: '#666666',
      border: '#CCCCCC'
    },
    fonts: 'Georgia, serif',
    spacing: 'wide'
  },
  vibrant: {
    name: 'Vibrant',
    colors: {
      primary: '#EC4899',
      secondary: '#06B6D4',
      accent: '#F59E0B',
      success: '#14B8A6',
      warning: '#EA580C',
      danger: '#DC2626',
      background: '#FDF2F8',
      surface: '#FFFFFF',
      text: '#9F1239',
      textLight: '#C2185B',
      border: '#FBCFE8'
    },
    fonts: 'Poppins, sans-serif',
    spacing: 'normal'
  },
  corporate: {
    name: 'Corporate',
    colors: {
      primary: '#1E40AF',
      secondary: '#047857',
      accent: '#0369A1',
      success: '#065F46',
      warning: '#92400E',
      danger: '#7F1D1D',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      text: '#0F172A',
      textLight: '#475569',
      border: '#E2E8F0'
    },
    fonts: 'Helvetica, Arial, sans-serif',
    spacing: 'comfortable'
  }
};

export const getTheme = (themeName) => themes[themeName] || themes.default;

export const themeList = Object.entries(themes).map(([key, value]) => ({
  id: key,
  name: value.name
}));

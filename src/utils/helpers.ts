export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const formatDisplayDate = (dateString: string): string => {
  const date = new Date(dateString + 'T00:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (formatDate(date) === formatDate(today)) {
    return 'Today';
  }
  if (formatDate(date) === formatDate(yesterday)) {
    return 'Yesterday';
  }
  
  return date.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });
};

export const getTodayString = (): string => {
  return formatDate(new Date());
};

export const getMoodEmoji = (mood?: 1 | 2 | 3 | 4 | 5): string => {
  if (!mood) return '—';
  const emojis = ['😢', '😕', '😐', '🙂', '😄'];
  return emojis[mood - 1];
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};


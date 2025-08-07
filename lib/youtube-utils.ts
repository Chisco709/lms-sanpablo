export const extractYoutubeId = (url: string): string | null => {
  // Handle different YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const getYoutubeThumbnail = (youtubeId: string): string => {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
};

export const getYoutubeEmbedUrl = (youtubeId: string): string => {
  return `https://www.youtube.com/embed/${youtubeId}`;
};

export const isValidYoutubeUrl = (url: string): boolean => {
  const youtubeId = extractYoutubeId(url);
  return youtubeId !== null;
};

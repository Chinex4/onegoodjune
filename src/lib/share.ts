// Substack has no public share link, so its button copies the link instead.
export const substackHome = "https://substack.com/home";
export function shareLinks(url: string, title: string) {
  const link = encodeURIComponent(url);
  const text = encodeURIComponent(title);
  return {
    x: `https://x.com/intent/post?text=${text}&url=${link}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${link}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${link}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
  };
}

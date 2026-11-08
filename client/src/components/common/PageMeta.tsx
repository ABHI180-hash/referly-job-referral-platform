import React, { useEffect } from 'react';

interface PageMetaProps {
  title: string;
  description?: string;
}

export const PageMeta: React.FC<PageMetaProps> = ({ title, description }) => {
  useEffect(() => {
    // 1. Update document title
    const fullTitle = title.includes('Referly') ? title : `${title} | Referly`;
    document.title = fullTitle;

    // 2. Update meta description
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', description);

      let ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) {
        ogDesc.setAttribute('content', description);
      }
    }

    // 3. Update OG title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle);
    }

    // 4. Smoothly reset scroll position to top on page navigation
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [title, description]);

  return null;
};

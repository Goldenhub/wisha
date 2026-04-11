import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
}

export default function SEO({ 
  title = 'Wisha', 
  description = 'Create beautiful celebration pages and collect heartfelt wishes from friends and family.' 
}: SEOProps) {
  useEffect(() => {
    const fullTitle = title === 'Wisha' ? title : `${title} | Wisha`;
    document.title = fullTitle;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', fullTitle);
    }
    
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
}

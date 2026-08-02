import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Scroll to the anchored section. Retry briefly in case the section
      // hasn't finished rendering when the route first mounts.
      const id = hash.replace('#', '');
      let tries = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else if (tries < 10) {
          tries += 1;
          setTimeout(tryScroll, 80);
        }
      };
      // small initial delay so the new page's DOM is in place
      setTimeout(tryScroll, 60);
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;

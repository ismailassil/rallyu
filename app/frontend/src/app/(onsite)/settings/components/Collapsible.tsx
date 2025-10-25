import { useState, useRef, useEffect } from 'react';

interface CollapsibleProps {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
}

const Collapsible = ({ title, children, defaultExpanded = false }: CollapsibleProps) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [height, setHeight] = useState(0);

  const contentRef = useRef(null);

  useEffect(() => {
    if (contentRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        setHeight(contentRef.current.scrollHeight);
      });

      // Start watching the content element
      resizeObserver.observe(contentRef.current);

      // Set initial height immediately
      setHeight(contentRef.current.scrollHeight);

      // Cleanup: stop watching when component unmounts or children change
      return () => resizeObserver.disconnect();
    }
  }, [children]); // Re-run this effect when children change

  return (
    <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-white/4">
      <button
        type="button"
        className="flex w-full items-center justify-between p-4 text-left font-bold text-white transition-colors hover:bg-white/6 sm:p-5"
        onClick={() => setIsExpanded(prev => !prev)}
        aria-expanded={isExpanded}
      >
        <span>{title}</span>
        <span className="text-xl font-bold text-white/80">
          {isExpanded ? '−' : '+'}
        </span>
      </button>

      <div
        style={{
          height: isExpanded ? `${height}px` : '0px',
          transition: 'height 1s ease-in-out',
          overflow: 'hidden'
        }}
      >
        <div ref={contentRef} className='p-4 '>
          {children}
        </div>

      </div>
    </div>
  );
};

export default Collapsible;

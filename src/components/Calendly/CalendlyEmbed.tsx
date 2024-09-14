'use client';

import React, { useEffect, CSSProperties } from 'react';

interface CalendlyEmbedProps {
  url: string;
  style?: CSSProperties;
}

const CalendlyEmbed: React.FC<CalendlyEmbedProps> = ({ url, style }) => {
  useEffect(() => {
    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.setAttribute(
      'src',
      'https://assets.calendly.com/assets/external/widget.js',
    );
    head?.appendChild(script);
  }, []);

  const defaultStyle: CSSProperties = {
    minHeight: '650px',
    width: '100%',
  };

  const combinedStyle = { ...defaultStyle, ...style };

  return (
    <div
      className="calendly-inline-widget"
      data-url={url}
      style={combinedStyle}
    ></div>
  );
};

export default CalendlyEmbed;

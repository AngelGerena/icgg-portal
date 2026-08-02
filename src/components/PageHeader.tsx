import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader = ({ title, subtitle }: PageHeaderProps) => (
  <header className="icgg-pageheader">
    <div className="icgg-pageheader-inner">
      <p className="icgg-pageheader-eyebrow">Iglesia Cristiana Gracia y Gloria</p>
      <h1 className="icgg-pageheader-title">{title}</h1>
      <div className="icgg-pageheader-divider" />
      {subtitle && <p className="icgg-pageheader-sub">{subtitle}</p>}
    </div>
  </header>
);

export default PageHeader;

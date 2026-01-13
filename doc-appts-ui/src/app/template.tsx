'use client';

import './globals.css';
import TemplateWrapper from './templateWrapper';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
    {/*<html lang="en">
      <body>*/}
        <TemplateWrapper>{children}</TemplateWrapper>
      {/*</body>
    </html>*/}
    </>
  );
}
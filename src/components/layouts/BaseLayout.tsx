import React from 'react';

import { Navbar } from '@components/modules/Navbar';

export const BaseLayout: React.FC = ({ children }) => (
  <>
    <Navbar />
    {children}
  </>
);

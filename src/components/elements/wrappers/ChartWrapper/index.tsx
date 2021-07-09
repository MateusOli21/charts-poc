import React from 'react';

import styles from './ChartWrapper.module.css';

export const ChartWrapper: React.FC = ({ children }) => (
  <div className={styles.container}>{children}</div>
);

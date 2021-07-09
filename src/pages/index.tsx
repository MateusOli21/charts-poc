import React from 'react';

import { BaseLayout } from '@components/layouts';

import styles from '../styles/Home.module.css';

const Home: React.FC = () => (
  <BaseLayout>
    <div className={styles.container}>
      <h1>Hello world</h1>
    </div>
  </BaseLayout>
);

export default Home;

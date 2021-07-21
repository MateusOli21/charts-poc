import React from 'react';

import { BaseLayout } from '@components/layouts';
import { ChartWrapper } from '@components/elements/wrappers';
import { FakeStockChart } from '@components/modules/areasCharts';

import styles from '../styles/Home.module.css';

const Home: React.FC = () => (
  <BaseLayout>
    <div className={styles.container}>
      <ChartWrapper>
        <h2>Gráfico fake</h2>
        <FakeStockChart width={1180} height={560} />
      </ChartWrapper>
    </div>
  </BaseLayout>
);

export default Home;

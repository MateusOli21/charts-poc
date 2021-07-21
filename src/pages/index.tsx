import React from 'react';

import { BaseLayout } from '@components/layouts';
import { ChartWrapper } from '@components/elements/wrappers';
import {
  FakeStockChart,
  PriceEvolutionChart,
} from '@components/modules/areasCharts';

import styles from '../styles/Home.module.css';

const Home: React.FC = () => (
  <BaseLayout>
    <div className={styles.container}>
      <ChartWrapper>
        <h2>Gráfico fake</h2>
        <FakeStockChart width={1180} height={560} />
      </ChartWrapper>

      <ChartWrapper>
        <PriceEvolutionChart
          width={1180}
          height={560}
          padding={24}
          chatTitle="Evolução de preço"
        />
      </ChartWrapper>
    </div>
  </BaseLayout>
);

export default Home;

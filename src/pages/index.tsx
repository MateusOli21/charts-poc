import React from 'react';

import { BaseLayout } from '@components/layouts';
import { SimpleBarChart } from '@components/modules/barsCharts';
import { ChartWrapper } from '@components/elements/wrappers';

import styles from '../styles/Home.module.css';

const Home: React.FC = () => (
  <BaseLayout>
    <div className={styles.container}>
      <ChartWrapper>
        <h2>Gráfico de barra simples</h2>
        <SimpleBarChart width={720} height={330} />
      </ChartWrapper>
    </div>
  </BaseLayout>
);

export default Home;

import React from 'react';

import { BaseLayout } from '@components/layouts';
import { ChartWrapper } from '@components/elements/wrappers';
import { SimpleBarChart } from '@components/modules/barsCharts';

import styles from '@styles/BarsChartPage.module.css';

const BarsChartPage: React.FC = () => (
  <BaseLayout>
    <div className={styles.container}>
      <ChartWrapper>
        <h2>Gráfico de barra simples</h2>
        <SimpleBarChart width={720} height={330} />
      </ChartWrapper>
    </div>
  </BaseLayout>
);

export default BarsChartPage;

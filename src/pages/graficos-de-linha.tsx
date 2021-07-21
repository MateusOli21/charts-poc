import React from 'react';

import { ChartWrapper } from '@components/elements/wrappers';
import { BaseLayout } from '@components/layouts';
import { BaseAreaChart } from '@components/modules/areasCharts';

import styles from '@styles/LinesChartPage.module.css';

const LineCharts: React.FC = () => (
  <BaseLayout>
    <div className={styles.container}>
      <ChartWrapper>
        <h2>Gráfico base</h2>
        <BaseAreaChart width={720} height={490} />
      </ChartWrapper>
    </div>
  </BaseLayout>
);

export default LineCharts;

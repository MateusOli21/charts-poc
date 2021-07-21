import React from 'react';
import Link from 'next/link';

import styles from './navbar.module.css';

export const Navbar: React.FC = () => (
  <header className={styles.container}>
    <Link href="/">
      <h1>Charts</h1>
    </Link>

    <nav>
      <ul className={styles.list}>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/graficos-de-barra">Barras</Link>
        </li>
        <li>
          <Link href="/graficos-de-linha">Linhas</Link>
        </li>
      </ul>
    </nav>
  </header>
);

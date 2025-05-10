import React from 'react';
import styles from './AppLayout.module.css';

interface AppLayoutProps {
  header?: React.ReactNode;
  leftPanel?: React.ReactNode;
  mainPanel?: React.ReactNode;
  rightPanel?: React.ReactNode;
  bottomPanel?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  header,
  leftPanel,
  mainPanel,
  rightPanel,
  bottomPanel,
}) => {
  // eslint-disable-next-line no-console
  console.log('[AppLayout] Rendering', {
    header: !!header,
    leftPanel: !!leftPanel,
    mainPanel: !!mainPanel,
    rightPanel: !!rightPanel,
    bottomPanel: !!bottomPanel,
  });
  if (!header) console.warn('[AppLayout] No header');
  if (!mainPanel) console.warn('[AppLayout] No mainPanel');
  return (
    <div className={styles.appLayout}>
      {header && <header className={styles.header}>{header}</header>}
      <main className={styles.mainContent}>
        {leftPanel && <aside className={styles.leftPanel}>{leftPanel}</aside>}
        {mainPanel && <section className={styles.mainPanel}>{mainPanel}</section>}
        {rightPanel && <aside className={styles.rightPanel}>{rightPanel}</aside>}
      </main>
      {bottomPanel && <footer className={styles.bottomPanel}>{bottomPanel}</footer>}
    </div>
  );
};
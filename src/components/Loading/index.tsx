import styles from './styles.module.scss';

export function Loading(): JSX.Element {
  return (
    <div className={styles.loadingContainer}>
      <img src="/images/loading.svg" alt="loading" />
      <strong>Carregando...</strong>
    </div>
  );
}

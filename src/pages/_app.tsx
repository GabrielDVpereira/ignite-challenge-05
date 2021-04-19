import { AppProps } from 'next/app';
import { ToastContainer } from 'react-toastify';
import '../styles/globals.scss';
import 'react-toastify/scss/main.scss';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <>
      <ToastContainer />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;

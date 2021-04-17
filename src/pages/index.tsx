import Head from 'next/head';

import { GetStaticProps } from 'next';
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';
import Header from '../components/Header';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { PostPagination, getPostsByPage } from '../services/postsService';
import { formatDate } from '../../utils/formating';

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  return (
    <>
      <Head>
        <title>Space Travelling | Home</title>
      </Head>
      <div className={commonStyles.container}>
        <Header />
        {postsPagination.results.map((post, i) => (
          <div className={styles.post} key={post.uid}>
            <h2>{post.data.title}</h2>
            <p>{post.data.subtitle}</p>

            <div>
              <div>
                <AiOutlineCalendar />
                <time>{formatDate(post.first_publication_date)}</time>
              </div>
              <div>
                <AiOutlineUser />
                <span>{post.data.author}</span>
              </div>
            </div>
          </div>
        ))}

        {postsPagination.next_page && <a>Carregar mais posts</a>}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const postsResponse = await getPostsByPage(1);
  return {
    props: { postsPagination: postsResponse },
  };
};

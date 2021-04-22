import { useState } from 'react';

import Head from 'next/head';

import { GetStaticProps } from 'next';
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Header } from '../components/Header';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { PostPagination, Post, getPostsByPage } from '../services/postsService';
import { formatDate } from '../../utils/formating';

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [nextPage, setNextPage] = useState<number | null>(() => {
    if (postsPagination.next_page) {
      return 2;
    }
    return null;
  });

  const [posts, setPosts] = useState<Post[]>(postsPagination.results);

  const loadMorePosts = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts?page=${nextPage}`
      );
      if (response.ok) {
        const responseJson: PostPagination = await response.json();
        setNextPage(prevState => {
          if (responseJson.next_page) {
            return prevState + 1;
          }
          return null;
        });
        setPosts(prevState => [...prevState, ...responseJson.results]);
      }
    } catch (err) {
      console.log(err);
      toast.error('Error to get more posts');
    }
  };
  return (
    <>
      <Head>
        <title>Space Travelling | Home</title>
      </Head>

      <Header />
      <div className={commonStyles.container}>
        {posts.map(post => (
          <div className={styles.post} key={post.uid}>
            <Link href={`/post/${post.uid}`}>
              <h2>{post.data.title}</h2>
            </Link>
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

        {postsPagination.next_page && (
          <button
            className={styles.loadButton}
            type="button"
            onClick={loadMorePosts}
          >
            Carregar mais posts
          </button>
        )}
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const postsResponse = await getPostsByPage();
  return {
    props: { postsPagination: postsResponse },
    revalidate: 60 * 10, // 10 min
  };
};

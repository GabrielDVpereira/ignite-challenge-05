/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import {
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlineClockCircle,
} from 'react-icons/ai';
import Head from 'next/head';
import Link from 'next/link';

import { Header } from '../../components/Header';

import { Loading } from '../../components/Loading';
import { formatDate } from '../../../utils/formating';
import { getPostByUid, getPaths, Post } from '../../services/postService';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { CommentsSection } from '../../components/CommentsSection';

export interface PostProps {
  post: Post;
  preview?: boolean;
}

const WORDS_PER_MINUTE = 200;

export default function PostPage({ post, preview }: PostProps) {
  const router = useRouter();

  const getTotalLengthBody = (body: { text: string }[]): number => {
    return body.reduce((total, { text }) => {
      return total + text.split(' ').length;
    }, 0);
  };

  const calculateTimeReading = () => {
    const totalWords = post.data.content.reduce(
      (totalContent, content) =>
        totalContent +
        content.heading.split(' ').length +
        getTotalLengthBody(content.body),
      0
    );

    return Math.ceil(totalWords / WORDS_PER_MINUTE);
  };

  console.log(router.isFallback);

  if (router.isFallback) {
    return <Loading />;
  }

  return (
    <>
      <Head>
        <title>Space Travelling | {post.data.title}</title>
      </Head>
      <div className={styles.conatinerAnimated}>
        <Header />
        <img
          className={styles.banner}
          src={post.data.banner.url}
          alt="banner"
        />
        <div className={commonStyles.container}>
          <div className={styles.post}>
            <h1>{post.data.title}</h1>
            <div className={styles.postInfo}>
              <span>
                <AiOutlineCalendar /> {formatDate(post.first_publication_date)}
              </span>
              <span>
                <AiOutlineUser /> {post.data.author}
              </span>
              <span>
                <AiOutlineClockCircle />
                {calculateTimeReading()} min
              </span>
            </div>

            {post.edited && (
              <span className={styles.edited}>
                {formatDate(
                  post.last_publication_date,
                  "'*editado em 'dd LLL yyyy ', às 'p"
                )}
              </span>
            )}

            <div className={styles.postContent}>
              {post.data.content.map(section => (
                <div key={Math.random()}>
                  <h2>{section.heading}</h2>
                  {section.body.map(paragraph => (
                    <p key={Math.random()}>{paragraph.text}</p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.navigationSection}>
            {post.previus && (
              <div>
                <span>{post.previus.title}</span>
                <Link href={`/post/${post.previus.slug}`}>
                  <a>Post anterior</a>
                </Link>
              </div>
            )}

            {post.next && (
              <div>
                <span>{post.next.title}</span>
                <Link href={`/post/${post.next.slug}`}>
                  <a>Próximo post</a>
                </Link>
              </div>
            )}
          </div>

          <CommentsSection />

          {preview && (
            <aside className={styles.preview}>
              <Link href="/api/exit-preview">
                <a>Sair do modo Preview</a>
              </Link>
            </aside>
          )}
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await getPaths();
  return {
    paths: response.paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async context => {
  const {
    params: { slug },
    preview = false,
    previewData,
  } = context;

  const post = await getPostByUid(String(slug), previewData?.ref ?? null);

  return {
    props: { post, preview },
  };
};

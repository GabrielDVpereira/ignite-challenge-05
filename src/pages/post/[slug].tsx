/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GetStaticPaths, GetStaticProps } from 'next';

import {
  AiOutlineCalendar,
  AiOutlineUser,
  AiOutlineClockCircle,
} from 'react-icons/ai';
import { formatDate } from '../../../utils/formating';
import { getPostByUid, Post } from '../../services/postService';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

export interface PostProps {
  post: Post;
}

const WORDS_PER_MINUTE = 200;

export default function PostPage({ post }: PostProps) {
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

  return (
    <>
      <img className={styles.banner} src={post.data.banner.url} alt="banner" />
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

          <div className={styles.postContent}>
            {post.data.content.map(section => (
              <div key={section.heading}>
                <h2>{section.heading}</h2>
                {section.body.map(paragraph => (
                  <p>{paragraph.text}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(TODO);

  return {
    paths: [],
    fallback: 'blocking',
  };

  // TODO
};

export const getStaticProps: GetStaticProps = async context => {
  const {
    params: { slug },
  } = context;

  const post = await getPostByUid(String(slug));

  // // TODO

  return {
    props: { post },
  };
};

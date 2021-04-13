import { GetStaticProps } from 'next';
import { AiOutlineCalendar, AiOutlineUser } from 'react-icons/ai';
import Header from '../components/Header';

import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home(): JSX.Element {
  return (
    <div className={commonStyles.container}>
      <Header />
      {[1, 2, 3, 4, 5, 6].map((_, i) => (
        <div className={styles.post}>
          <h2>Como utilizar Hooks</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime eius
            deserunt placeat nulla vitae, quis ipsam ea animi sunt eaque!
          </p>

          <div>
            <div>
              <AiOutlineCalendar />
              <time>15 mar 2021</time>
            </div>
            <div>
              <AiOutlineUser />
              <span>Joseph Oliveira</span>
            </div>
          </div>
        </div>
      ))}

      <a>Carregar mais posts</a>
    </div>
  );
}

// export const getStaticProps = async () => {
//   // const prismic = getPrismicClient();
//   // const postsResponse = await prismic.query(TODO);

//   // TODO
// };

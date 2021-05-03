import Prismic from '@prismicio/client';
import { getPrismicClient } from './prismic';

export interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

export interface PostPagination {
  next_page: string;
  results: Post[];
}

function formatPosts(posts): Post[] {
  return posts.map(post => ({
    uid: post.uid,
    first_publication_date: post.first_publication_date,
    data: {
      title: post.data.title,
      subtitle: post.data.subtitle,
      author: post.data.author,
    },
  }));
}

export async function getPostsByPage(page?: number): Promise<PostPagination> {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.author', 'posts.subtitle'],
      page,
      pageSize: 5,
    }
  );

  const postsFormated = formatPosts(postsResponse.results);

  return {
    next_page: postsResponse.next_page,
    results: postsFormated,
  };
}

export async function getPostPreviewByRef(
  ref: string
): Promise<PostPagination> {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.author', 'posts.subtitle'],
      ref,
      pageSize: 5,
    }
  );

  const postsFormated = formatPosts(postsResponse.results);

  return {
    next_page: postsResponse.next_page,
    results: postsFormated,
  };
}

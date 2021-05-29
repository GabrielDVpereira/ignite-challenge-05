/* eslint-disable no-use-before-define */
import Prismic from '@prismicio/client';
import { getPrismicClient } from './prismic';

export interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
  edited: boolean;
  previus: {
    title: string | null;
    slug: string | null;
  };
  next: {
    title: string | null;
    slug: string | null;
  };
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}
interface StaticPostPaths {
  paths: { params: { slug: string } }[];
}
export async function getPaths(): Promise<StaticPostPaths> {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.uid'],
      pageSize: 100,
    }
  );
  return {
    paths: postsResponse.results.map(post => ({ params: { slug: post.uid } })),
  };
}

export async function getPostByUid(
  slug: string,
  ref?: string | null
): Promise<Post> {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', slug, { ref });

  const prevPost = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      orderings: '[document.first_publication_date]',
      after: response.id,
      pageSize: 1,
    }
  );

  const nextPost = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      orderings: '[document.first_publication_date desc]', // the latest after the current post
      after: response.id,
      pageSize: 1,
    }
  );

  const edited =
    response.first_publication_date !== response.last_publication_date;

  const previus = prevPost?.results[0]
    ? {
        title: prevPost?.results[0]?.data.title,
        slug: prevPost?.results[0]?.uid,
      }
    : null;

  const next = nextPost?.results[0]
    ? {
        title: nextPost?.results[0]?.data.title,
        slug: nextPost?.results[0]?.uid,
      }
    : null;

  return { ...response, edited, previus, next };
}

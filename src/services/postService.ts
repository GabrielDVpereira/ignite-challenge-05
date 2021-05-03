/* eslint-disable no-use-before-define */
import Prismic from '@prismicio/client';
import { getPrismicClient } from './prismic';

export interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
  edited: boolean;
  previus: {
    title: string;
    slug: string;
  };
  next: {
    title: string;
    slug: string;
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

  console.log(response);

  const prevPost = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      after: response.id,
      orderings: '[my.post.date desc]',
      pageSize: 1,
    }
  );

  const nextPost = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      after: response.id,
      orderings: '[my.post.date desc]',
      pageSize: 1,
    }
  );

  const edited =
    response.first_publication_date !== response.last_publication_date;

  const previus = {
    title: prevPost?.results[0]?.data.title,
    slug: prevPost?.results[0]?.uid,
  };
  const next = {
    title: nextPost?.results[0]?.data.title,
    slug: nextPost?.results[0]?.uid,
  };

  return { ...response, edited, previus, next };
}

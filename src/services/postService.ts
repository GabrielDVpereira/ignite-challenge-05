/* eslint-disable no-use-before-define */
import Prismic from '@prismicio/client';
import { getPrismicClient } from './prismic';

export interface Post {
  first_publication_date: string | null;
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
  return response;
}

/* eslint-disable no-use-before-define */
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
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

export async function getPostByUid(slug: string): Promise<Post> {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('posts', slug, {});
  const post = formatPostResponse(response);
  return post;
}

function formatPostResponse(unformatedPost): Post {
  return {
    first_publication_date: unformatedPost.first_publication_date,
    data: {
      title: unformatedPost.data.title,
      banner: {
        url: unformatedPost.data.banner.url,
      },
      author: unformatedPost.data.author,
      content: unformatedPost.data.content.map(content => ({
        heading: content.heading,
        body: content.body.map(body => ({ text: body.text })),
      })),
    },
  };
}

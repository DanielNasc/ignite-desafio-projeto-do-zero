import { GetStaticProps } from 'next';
import { useState } from 'react';
import { PostPreview } from '../components/PostPreview';

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

function formatPosts(postsResponse: any): PostPagination {
  const results = postsResponse.results.map(
    ({ uid, first_publication_date, data }) => ({
      uid,
      first_publication_date,
      data: {
        title: data.title,
        subtitle: data.subtitle,
        author: data.author,
      },
    })
  );

  return {
    next_page: postsResponse.next_page,
    results,
  };
}

/*
  Nesse arquivo você deve renderizar todos os posts da paginação e exibir 
  o botão Carregar mais posts caso existam mais posts a ser carregados 
  (ou seja, o valor next_page retornado pela Prismic não pode ser null). 
  Caso contrário, o botão não deve ser renderizado.
*/

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { results } = postsPagination;

  const [posts, setPosts] = useState(results);
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function handleAddMorePosts(): Promise<void> {
    if (!nextPage) {
      return;
    }

    const nextPosts = await fetch(nextPage);
    const nextPostsJson = await nextPosts.json();
    const nextPostsFormatted = formatPosts(nextPostsJson);

    setPosts([...posts, ...nextPostsFormatted.results]);
    setNextPage(nextPostsFormatted.next_page);
  }

  return (
    <div className={`${commonStyles.commonContainer}`}>
      {posts.map((post: Post) => (
        <PostPreview key={post.uid} post={post} />
      ))}

      {nextPage && (
        <button
          onClick={handleAddMorePosts}
          type="button"
          className={styles.loadMorePosts}
        >
          Carregar mais posts
        </button>
      )}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('post', {
    pageSize: 1,
  });

  const postsPagination = formatPosts(postsResponse);

  return {
    props: {
      postsPagination,
    },
  };
};

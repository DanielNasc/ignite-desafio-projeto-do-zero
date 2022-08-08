import { GetStaticProps } from 'next';
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

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  return (
    <div className={`${commonStyles.commonContainer}`}>
      {postsPagination.results.map((post: Post) => (
        <PostPreview key={post.uid} post={post} />
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('post', {
    pageSize: 1,
  });

  const postsPreview = postsResponse.results.map(
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

  const postPagination: PostPagination = {
    next_page: postsResponse.next_page,
    results: postsPreview,
  };

  return {
    props: {
      postsPagination: postPagination,
    },
  };
};

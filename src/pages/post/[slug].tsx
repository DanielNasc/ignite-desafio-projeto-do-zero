import { asHTML } from '@prismicio/helpers';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
// import Image from 'next/image';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import { formatDate } from '../../utils/formatDate';
import { timeToRead } from '../../utils/timeToRead';

import styles from './post.module.scss';

interface Post {
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

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const { isFallback } = useRouter();

  if (isFallback) {
    return (
      <div className={`${commonStyles.commonContainer} ${styles.loading}`}>
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <div
        style={{
          background: `url(${post.data.banner.url}) no-repeat center`,
        }}
        className={styles.banner}
      />
      <div
        className={`${commonStyles.commonContainer} ${styles.postContainer}`}
      >
        <h1>{post.data.title}</h1>

        <div className={styles.info}>
          <span>
            <FiCalendar />
            {formatDate(post.first_publication_date)}
          </span>
          <span>
            <FiUser />
            {post.data.author}
          </span>
          <span>
            <FiClock />
            {timeToRead(post.data.content)} min
          </span>
        </div>

        <div className={styles.content}>
          {post.data.content.map(({ heading, body }) => (
            <div key={heading}>
              <h2>{heading}</h2>
              <div
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                dangerouslySetInnerHTML={{ __html: asHTML<any>(body) }} // eslint-disable-line react/no-danger
                className={styles.body}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('post');

  /*
    Além disso, você deve utilizar o getStaticPaths para gerar as páginas 
    estáticas de alguns posts e setar o fallback como true para que o restante 
    seja gerado no momento da requisição. Nesse método é obrigatório utilizar o getByType do Prismic.
  */

  const paths = posts.results.map(post => ({
    params: {
      slug: post.uid,
    },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!params) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const slug = params.slug as string;

  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('post', slug);

  if (!response) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  // const post: Post = {
  //   first_publication_date: response.first_publication_date,
  //   data: {
  //     title: response.data.title,
  //     banner: {
  //       url: response.data.banner.url,
  //     },
  //     author: response.data.author,
  //     content: response.data.content.map(({ heading, body }) => ({
  //       heading,
  //       body: asHTML<typeof body>(body),
  //     })),
  //   },
  // };

  return {
    props: {
      post: response,
    },
  };
};

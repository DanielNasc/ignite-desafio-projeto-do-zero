import Link from 'next/link';
import { FiCalendar, FiUser } from 'react-icons/fi';

import { formatDate } from '../../utils/formatDate';

import commonStyles from '../../styles/common.module.scss';
import styles from './PostPreview.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPreviewProps {
  post: Post;
}

export function PostPreview({ post }: PostPreviewProps): JSX.Element {
  return (
    <Link href={`/post/${post.uid}`}>
      <div className={styles.postPreviewContainer}>
        <h1>{post.data.title}</h1>
        <p>{post.data.subtitle}</p>
        <div className={commonStyles.info}>
          <span>
            <FiUser />
            {post.data.author}
          </span>
          <span>
            <FiCalendar />
            {formatDate(post.first_publication_date)}
          </span>
        </div>
      </div>
    </Link>
  );
}

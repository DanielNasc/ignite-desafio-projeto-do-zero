import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { FiCalendar, FiUser } from 'react-icons/fi';

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

// format date with date-fns
function formatDate(date: string | null): string {
  if (!date) {
    return '';
  }

  return format(new Date(date), 'dd MMM yyyy', { locale: ptBR });
}

export function PostPreview({ post }: PostPreviewProps): JSX.Element {
  return (
    <div className={styles.postPreviewContainer}>
      <h1>{post.data.title}</h1>
      <p>{post.data.subtitle}</p>
      <div className={styles.postPreviewMeta}>
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
  );
}

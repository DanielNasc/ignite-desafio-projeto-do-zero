import Image from 'next/image';
import Link from 'next/link';

import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <div className={`${commonStyles.commonContainer} ${styles.container}`}>
      <Link href="/">
        <Image src="/images/logo.svg" width="238" height="25" alt="logo" />
      </Link>
    </div>
  );
}

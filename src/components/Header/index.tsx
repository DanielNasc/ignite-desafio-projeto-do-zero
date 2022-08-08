import Image from 'next/image';

import commonStyles from '../../styles/common.module.scss';
import styles from './header.module.scss';

export default function Header() {
  return (
    <div className={`${commonStyles.commonContainer} ${styles.container}`}>
      <Image src="/images/logo.svg" width="238" height="25" alt="logo" />
    </div>
  );
}

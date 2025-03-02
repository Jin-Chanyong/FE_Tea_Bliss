'use client';

import classNames from 'classnames/bind';

import { MyInfoProps } from '@/components/common/GlobalNavBar/MyInfo/MyInfo';
import styles from '@/components/common/GlobalNavBar/MyInfo/MyInfo.module.scss';
import Close from '@/icons/close.svg';

const cn = classNames.bind(styles);

interface PopupHeaderProps extends MyInfoProps {}

export default function PopupHeader({ toggle }: PopupHeaderProps) {
  return (
    <div className={cn('popupHeader')}>
      <h2>내 정보</h2>
      <button onClick={toggle}>
        <Close width={16} height={16} stroke={'#000'} />
      </button>
    </div>
  );
}

import React from 'react';
import {useLocation} from 'react-router-dom';
import styles from '../styles/DynamicHeader.module.css';

const DynamicHeader = () => {
  const location = useLocation();

  // 경로에 따른 아이콘 및 텍스트 매핑
  const headerData = {
    '/home': {icon: '/images/home_icon.png', text: '대시보드 홈'},
    '/roads-search': {icon: '/images/road_icon.png', text: '열선 도로 추천'},
    '/board-main': {icon: '/images/board_icon.png', text: '정보 게시판'},
    '/inquire': {icon: '/images/help_icon.png', text: '나의 문의 내역'},
    '/mypage': {icon: '/images/mypage_icon.png', text: '내 정보 수정'},
    '/admin-page': {icon: '/images/admin_icon.png', text: '[관리자] 각 동별 파일 요청 현황'}
  };

  const currentHeader = headerData[location.pathname] || {
    icon: '/images/default_icon.png',
    text: '페이지를 찾을 수 없습니다',
  };

  return (
      <div className={styles.head}>
        <b className={styles.headTxt}>{currentHeader.text}</b>
        <div className={styles.headIcon}/>
        <div className={styles.headLine}/>
      </div>
  );
};

export default DynamicHeader;

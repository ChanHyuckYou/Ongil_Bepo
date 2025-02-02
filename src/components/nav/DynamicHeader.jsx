// src/components/DynamicHeader.jsx
import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import styles from '../../styles/DynamicHeader.module.css';

const DynamicHeader = () => {
  const location = useLocation();
  const [sideNavWidth, setSideNavWidth] = useState(290); // 기본 사이드 네비게이션 너비
  const [isAdmin, setIsAdmin] = useState(false);

  // 컴포넌트 마운트 시 localStorage에서 관리자 여부 확인
  useEffect(() => {
    const adminFlag = localStorage.getItem('is_admin') === 'true';
    setIsAdmin(adminFlag);
  }, []);

  // 경로에 따른 기본 헤더 데이터
  const headerData = [
    {paths: ['/home'], icon: '/images/home_icon.png', text: '대시보드 홈'},
    {paths: ['/roads-search'], icon: '/images/road_icon.png', text: '열선 도로 추천'},
    {
      paths: ['/roads-recommend'],
      icon: '/images/road_icon.png',
      text: '열선 도로 추천'
    },
    {
      paths: ['/board-main', '/board-create', '/board-detail'],
      icon: '/images/board_icon.png',
      text: '정보 게시판'
    },
    {paths: ['/board-create'], icon: '/images/board_icon.png', text: '정보 게시판'},
    {paths: ['/inquire'], icon: '/images/help_icon.png', text: '나의 문의 내역'},
    {
      paths: ['/mypage-input'],
      icon: '/images/mypage_icon.png',
      text: '내 정보 수정'
    },
    {paths: ['/mypage'], icon: '/images/mypage_icon.png', text: '내 정보 수정'},
    // 원래는 '/admin-page' 경로일 때만 사용되던 관리자 항목
    {
      paths: ['/admin-page'],
      icon: '/images/admin_icon.png',
      text: '[관리자] 각 동별 파일 요청 현황'
    },
  ];

  // 현재 경로에 맞는 기본 헤더 선택
  let currentHeader = headerData.find((entry) =>
      entry.paths.some((path) => location.pathname.startsWith(path))
  );

  // 관리자 토큰이 있다면, 현재 헤더 텍스트 앞에 [관리자] 접두어를 추가하여 항상 관리자임을 표시
  if (isAdmin) {
    if (currentHeader) {
      // 이미 관리자 관련 텍스트가 없으면 접두어 추가
      if (!currentHeader.text.includes('[관리자]')) {
        currentHeader = {
          ...currentHeader,
          text: `[관리자] ${currentHeader.text}`,
        };
      }
    } else {
      // currentHeader가 없을 경우 기본 관리자 헤더 설정
      currentHeader = {
        icon: '/images/admin_icon.png',
        text: '[관리자] 대시보드',
      };
    }
  }

  // fallback: currentHeader가 없을 경우
  if (!currentHeader) {
    currentHeader = {
      icon: '/images/default_icon.png',
      text: '페이지를 찾을 수 없습니다',
    };
  }

  // 사이드 네비게이션 너비 재계산 (반응형)
  useEffect(() => {
    let timeoutId;
    const updateSideNavWidth = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const rootStyle = getComputedStyle(document.documentElement);
        const sideWidth = parseInt(
            rootStyle.getPropertyValue('--side-nav-width')
        ) || 290;
        setSideNavWidth(sideWidth);
      }, 150);
    };

    updateSideNavWidth();
    window.addEventListener('resize', updateSideNavWidth);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateSideNavWidth);
    };
  }, []);

  return (
      <div
          className={styles.head}
          style={{
            left: `${sideNavWidth}px`,
            width: `calc(100% - ${sideNavWidth}px)`,
          }}
      >
        <div className={styles.headIcon}/>
        <b className={styles.headTxt}>{currentHeader.text}</b>
        <div className={styles.headLine}/>
      </div>
  );
};

export default DynamicHeader;

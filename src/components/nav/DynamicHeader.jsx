import {useState, useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import styles from '../../styles/DynamicHeader.module.css';

const DynamicHeader = () => {
  const location = useLocation();
  const [sideNavWidth, setSideNavWidth] = useState(290); // SideNavigation 기본 너비

  // 경로에 따른 아이콘 및 텍스트 매핑
  const headerData = [
    {paths: ['/home'], icon: '/images/home_icon.png', text: '대시보드 홈'},
    {paths: ['/roads-search'], icon: '/images/road_icon.png', text: '열선 도로 추천'},
    {paths: ['/roads-recommend'], icon: '/images/road_icon.png', text: '열선 도로 추천'},
    {
      paths: ['/board-main', '/board-create'],
      icon: '/images/board_icon.png',
      text: '정보 게시판'
    },
    {paths: ['/board-create'], icon: '/images/board_icon.png', text: '정보 게시판'},
    {paths: ['/inquire'], icon: '/images/help_icon.png', text: '나의 문의 내역'},
    {paths: ['/mypage-input'], icon: '/images/mypage_icon.png', text: '내 정보 수정'},
    {paths: ['/mypage'], icon: '/images/mypage_icon.png', text: '내 정보 수정'},
    {
      paths: ['/admin-page'],
      icon: '/images/admin_icon.png',
      text: '[관리자] 각 동별 파일 요청 현황'
    },
  ];

  const currentHeader = headerData.find(entry =>
      entry.paths.includes(location.pathname)
  ) || {
    icon: '/images/default_icon.png',
    text: '페이지를 찾을 수 없습니다',
  };

  // 화면 크기 변화에 따른 SideNavigation 너비 계산
  useEffect(() => {
    let timeoutId;

    const updateSideNavWidth = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const rootStyle = getComputedStyle(document.documentElement);
        const sideWidth = parseInt(
            rootStyle.getPropertyValue('--side-nav-width')) || 290;
        setSideNavWidth(sideWidth);
      }, 150); // debounce 적용
    };

    updateSideNavWidth(); // 초기 설정
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
        <b className={styles.headTxt}>{currentHeader.text}</b>
        <div className={styles.headIcon}/>
        <div className={styles.headLine}/>
      </div>
  );
};

export default DynamicHeader;

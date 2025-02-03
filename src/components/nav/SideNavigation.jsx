// src/components/SideNavigation.jsx
import {useState, useEffect, useRef} from 'react';
import {useLocation} from "react-router-dom";
import styles from '../../styles/Navigation.module.css';
import useNavigations from "../Navigation/Navigations.jsx";
// auth.jsx에서 logout 함수를 import
import {logout} from "../ApiRoute/auth.jsx";

const SideNavigation = () => {
  const [selectedIndex, setSelectedIndex] = useState({group: 'top', index: 0});
  const [itemHeight, setItemHeight] = useState(60); // 기본 높이
  const [itemMargin, setItemMargin] = useState(20); // 기본 간격
  const [topStart, setTopStart] = useState(0); // 상단 아이템의 시작 위치
  const [bottomStart, setBottomStart] = useState(0); // 하단 아이템의 시작 위치

  const topContainerRef = useRef(null);
  const bottomContainerRef = useRef(null);
  const navigateTo = useNavigations();
  const location = useLocation();

  // localStorage에서 is_admin 가져오기
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  // Access Token(로그아웃 API 호출시 필요)
  const accessToken = localStorage.getItem('access_token');

  // 상단 메뉴
  const topItems = [
    {
      id: 0,
      label: '대시보드',
      page: 'Home',
      icon: '/images/home_img.png',
      path: '/home'
    },
    {
      id: 1,
      label: '열선 도로 추천',
      page: 'RoadsSearch',
      icon: '/images/road_img.png',
      path: '/road-search'
    },
    {
      id: 2,
      label: '정보 게시판',
      page: 'BoardMain',
      icon: '/images/board_img.png',
      path: ['/board-main', '/board-create']
    },
    {
      id: 3,
      label: '파일 요청 승인',
      page: 'AdminPage',
      icon: '/images/admin_img.png',
      path: '/admin-page',
      isAdminItem: true, // 관리자 전용
    },
  ];

  // 하단 메뉴
  const bottomItems = [
    {
      id: 4,
      label: '마이페이지',
      page: 'Mypage',
      icon: '/images/login_img.png',
      path: '/mypage'
    },
    {
      id: 5,
      label: '로그아웃',
      page: 'Login',
      icon: '/images/sign-out_img.png',
      path: '/'
    },
    {
      id: 6,
      label: '문의하기',
      page: 'Inquire',
      icon: '/images/help_img.png',
      path: '/inquire'
    },
  ];

  // 현재 경로
  const currentPath = location.pathname.replace(/\/$/, '');

  // 상단 메뉴 중, 관리자 메뉴는 isAdmin이 true일 때만 표시
  const filteredTopItems = topItems.filter((item) => {
    if (item.isAdminItem && !isAdmin) {
      return false;
    }
    return true;
  });

  // 레이아웃 계산 함수
  const updateLayout = () => {
    const rootStyle = getComputedStyle(document.documentElement);

    setItemHeight(parseInt(rootStyle.getPropertyValue('--item-height')) || 60);
    setItemMargin(parseInt(rootStyle.getPropertyValue('--item-margin')) || 20);

    if (topContainerRef.current) {
      setTopStart(topContainerRef.current.offsetTop);
    }
    if (bottomContainerRef.current) {
      setBottomStart(bottomContainerRef.current.offsetTop);
    }
  };

  useEffect(() => {
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);

  // 경로 변경 시, 해당 아이템을 active 처리
  useEffect(() => {
    const path = location.pathname;

    // 상단메뉴 체크
    const topIndex = filteredTopItems.findIndex((item) => {
      if (Array.isArray(item.path)) {
        return item.path.includes(path);
      }
      return item.path === path;
    });

    // 하단메뉴 체크
    const bottomIndex = bottomItems.findIndex((item) => {
      if (Array.isArray(item.path)) {
        return item.path.includes(path);
      }
      return item.path === path;
    });

    if (topIndex !== -1) {
      setSelectedIndex({group: 'top', index: topIndex});
    } else if (bottomIndex !== -1) {
      setSelectedIndex({group: 'bottom', index: bottomIndex});
    }
  }, [location.pathname, filteredTopItems]);

  // 메뉴 클릭 시 페이지 이동 or 로그아웃
  const handleNavigation = async (item, groupIndex, itemIndex) => {
    setSelectedIndex({group: groupIndex, index: itemIndex});

    if (item.label === '로그아웃') {
      // 로그아웃
      try {
        if (accessToken) {
          await logout(accessToken);  // 서버에 로그아웃 API 콜
        }
        // 로그아웃 후 로그인 페이지로
        navigateTo('Login');
      } catch (error) {
        console.error('로그아웃 실패:', error);
      }
    } else {
      // 일반 메뉴
      navigateTo(item.page);
    }
  };

  // selector(하이라이트 바) 위치 계산
  const calculateTop = () => {
    const totalItemHeight = itemHeight + itemMargin;
    if (selectedIndex.group === 'top') {
      return topStart + selectedIndex.index * totalItemHeight;
    } else {
      return bottomStart + selectedIndex.index * totalItemHeight;
    }
  };

  return (
      <div className={styles.leftNavi}>
        {/* 선택된 아이템 표시 (Selector) */}
        <div className={styles.selector1Icon}
             style={{top: `${calculateTop()}px`}}/>
        <div className={styles.selector2} style={{top: `${calculateTop()}px`}}/>

        {/* 상단 아이템 목록 */}
        <div className={styles.menuItems} ref={topContainerRef}>
          {filteredTopItems.map((item, index) => (
              <div
                  key={item.id}
                  className={`${styles.navItem} ${
                      selectedIndex.group === 'top' && selectedIndex.index
                      === index
                          ? styles.active
                          : ''
                  }`}
                  onClick={() => handleNavigation(item, 'top', index)}
              >
                <img src={item.icon} alt={item.label}/>
                <b>{item.label}</b>
              </div>
          ))}
        </div>

        {/* 하단 아이템 목록 */}
        <div className={styles.bottomNavContainer} ref={bottomContainerRef}>
          {bottomItems.map((item, index) => (
              <div
                  key={item.id}
                  className={`${styles.navItem} ${
                      selectedIndex.group === 'bottom' && selectedIndex.index
                      === index
                          ? styles.active
                          : ''
                  }`}
                  onClick={() => handleNavigation(item, 'bottom', index)}
              >
                <img src={item.icon} alt={item.label}/>
                <b>{item.label}</b>
              </div>
          ))}
        </div>
      </div>
  );
};

export default SideNavigation;

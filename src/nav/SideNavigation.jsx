import {useState, useEffect, useRef} from 'react';
import styles from '../styles/Navigation.module.css';
import useNavigations from "../components/Navigation/Navigations.jsx";

const SideNavigation = () => {
  const [selectedIndex, setSelectedIndex] = useState({group: 'top', index: 0});
  const [itemHeight, setItemHeight] = useState(60); // 기본 높이
  const [itemMargin, setItemMargin] = useState(20); // 기본 간격
  const [topStart, setTopStart] = useState(0); // 상단 아이템의 시작 위치
  const [bottomStart, setBottomStart] = useState(0); // 하단 아이템의 시작 위치

  const topContainerRef = useRef(null);
  const bottomContainerRef = useRef(null);
  const navigateTo = useNavigations();

  const handleNavigation = (page) => {
    navigateTo(page); // 페이지 이동 실행
  };

  const topItems = [
    {id: 0, label: '대시보드', page: 'Home', icon: '/images/home_img.png'},
    {
      id: 1,
      label: '열선 도로 추천',
      page: 'RoadsSearch',
      icon: '/images/road_img.png'
    },
    {id: 2, label: '정보 게시판', page: 'BoardMain', icon: '/images/board_img.png'},
    {
      id: 3,
      label: '파일 요청 승인',
      page: 'AdminPage',
      icon: '/images/admin_img.png'
    }, // 추가된 항목
  ];

  const bottomItems = [
    {id: 4, label: '마이페이지', page: 'Mypage', icon: '/images/login_img.png'},
    {id: 5, label: '로그아웃', page: 'Login', icon: '/images/sign-out_img.png'},
    {id: 6, label: '문의하기', page: 'Inquire', icon: '/images/help_img.png'},
  ];

  useEffect(() => {
    // CSS 변수에서 값 가져오기
    const rootStyle = getComputedStyle(document.documentElement);
    setItemHeight(parseInt(rootStyle.getPropertyValue('--item-height')) || 60);
    setItemMargin(parseInt(rootStyle.getPropertyValue('--item-margin')) || 20);

    // topNavContainer의 시작 위치 계산
    if (topContainerRef.current) {
      setTopStart(topContainerRef.current.offsetTop);
    }

    // bottomNavContainer의 시작 위치 계산
    if (bottomContainerRef.current) {
      setBottomStart(bottomContainerRef.current.offsetTop);
    }
  }, []);

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
        {/* 선택된 아이템 표시 */}
        <div
            className={styles.selector1Icon}
            style={{
              top: `${calculateTop()}px`,
            }}
        />
        <div
            className={styles.selector2}
            style={{
              top: `${calculateTop()}px`,
            }}
        />

        {/* 상단 아이템 */}
        <div className={styles.menuItems} ref={topContainerRef}>
          {topItems.map((item, index) => (
              <div
                  key={item.id}
                  className={`${styles.navItem} ${
                      selectedIndex.group === 'top' && selectedIndex.index
                      === index
                          ? styles.active
                          : ''
                  }`}
                  onClick={() => {
                    setSelectedIndex({group: 'top', index});
                    handleNavigation(item.page); // 네비게이션 실행
                  }}
              >
                <img src={item.icon} alt={item.label}/>
                <b>{item.label}</b>
              </div>
          ))}
        </div>

        {/* 하단 아이템 */}
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
                  onClick={() => {
                    setSelectedIndex({group: 'bottom', index});
                    handleNavigation(item.page); // 네비게이션 실행
                  }}
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

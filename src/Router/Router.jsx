import {useEffect} from "react";
import {Routes, Route, useNavigationType, useLocation} from "react-router-dom";
import Login from "../screens/Login.jsx";
import Signup from "../screens/Signup.jsx";
import Home from "../screens/Home.jsx";
import AdminPage from "../screens/Adminpage.jsx";
import BoardDetail from "../screens/BoardDetail.jsx";
import BoardCreate from "../screens/BoardCreate.jsx";
import BoardMain from "../screens/Board.jsx";
import Inquire from "../screens/Inquire.jsx";
import RoadsRecommend from "../screens/RoadsRecommend.jsx";
import RoadsSearch from "../screens/RoadsSearch.jsx";
import Mypage from "../screens/Mypage.jsx";
import Findpwd from "../screens/Findpwd.jsx";
import MypageInput from "../screens/MypageInput.jsx";
import TopNavigation from "../nav/TopNavigation.jsx";
import SideNavigation from "../nav/SideNavigation.jsx";
import DynamicHeader from "../nav/DynamicHeader.jsx";

function Router() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  // 경로에 따른 레이아웃 숨기기 설정
  const hideLayoutForPaths = ["/", "/signup", "/find-pwd"]; // 레이아웃 숨길 경로
  const isLayoutHidden = hideLayoutForPaths.includes(pathname);

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    // 경로와 타이틀/메타 데이터를 매핑
    const metaData = {
      "/": {title: "Login", description: "Login to access your account"},
      "/signup": {title: "Signup", description: "Sign up for a new account"},
      "/home": {title: "Welcome Page", description: "Welcome to our website!"},
      "/admin-page": {
        title: "Admin Dashboard",
        description: "Access your admin dashboard",
      },
      "/board-main": {
        title: "Board Main",
        description: "View the main discussion board",
      },
      "/board-detail": {
        title: "Board Detail",
        description: "View details of the board post",
      },
      "/board-create": {
        title: "Create Board Post",
        description: "Create a new post on the board",
      },
      "/mypage": {title: "My Page", description: "View your personal page"},
      "/inquire": {
        title: "Inquire",
        description: "Contact us for inquiries",
      },
      "/find-pwd": {
        title: "Find Password",
        description: "Recover your lost password",
      },
      "/mypage-input": {
        title: "Edit My Page",
        description: "Edit your personal information",
      },
      "/roads-recommend": {
        title: "Roads Recommendation",
        description: "Get recommendations for roads",
      },
      "/roads-search": {
        title: "Search Roads",
        description: "Search for roads information",
      },
    };

    const {title, description} = metaData[pathname] || {
      title: "Page Not Found",
      description: "This page does not exist",
    };

    // 문서 제목 및 메타 태그 업데이트
    document.title = title;
    const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]'
    );
    if (metaDescriptionTag) {
      metaDescriptionTag.content = description;
    }
  }, [pathname]);

  return (
      <>
        {/* 레이아웃 조건부 렌더링 */}
        {!isLayoutHidden && (
            <>
              <TopNavigation/>
              <SideNavigation/>
              <DynamicHeader/>
            </>
        )}

        {/* 라우트 정의 */}
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/find-pwd" element={<Findpwd/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/admin-page" element={<AdminPage/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/roads-recommend" element={<RoadsRecommend/>}/>
          <Route path="/board-main" element={<BoardMain/>}/>
          <Route path="/board-detail" element={<BoardDetail/>}/>
          <Route path="/board-create" element={<BoardCreate/>}/>
          <Route path="/mypage" element={<Mypage/>}/>
          <Route path="/inquire" element={<Inquire/>}/>
          <Route path="/mypage-input" element={<MypageInput/>}/>
          <Route path="/roads-search" element={<RoadsSearch/>}/>
        </Routes>
      </>
  );
}

export default Router;

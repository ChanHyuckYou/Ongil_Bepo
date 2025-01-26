import {useEffect} from "react";
import {Routes, Route, useNavigationType, useLocation} from "react-router-dom";
import Login from "../screens/Login.jsx";
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
import Resetpwd from "../screens/Resetpwd.jsx";
import Layout from "../components/nav/Layout.jsx"; // Layout 컴포넌트
import NotFound from "../screens/NotFound.jsx";

/*import BoardId from "../screens/BoardId.jsx"; // 동적 경로에 대한 컴포넌트*/

function Router() {
  const action = useNavigationType();
  const location = useLocation();
  const pathname = location.pathname;

  useEffect(() => {
    if (action !== "POP") {
      window.scrollTo(0, 0);
    }
  }, [action, pathname]);

  useEffect(() => {
    // 경로와 타이틀/메타 데이터를 매핑
    const metaData = {
      "/": {title: "Login", description: "Login to access your account"},
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
      "/reset-pwd": {
        title: "Reset Password",
        description: "Reset your password",
      },
      "/roads-recommend": {
        title: "Roads Recommendation",
        description: "Get recommendations for roads",
      },
      "/roads-search": {
        title: "Search Roads",
        description: "Search for roads information",
      },
      "/board/:id": { // 동적 경로에 대한 메타 데이터
        title: "Board Detail",
        description: "View details of the board post",
      },
      "/board-detail/:postId": {
        title: "Board Detail",
        description: "View details of the board post",
      },
    };

    const defaultMeta = {
      title: "Page Not Found",
      description: "This page does not exist",
    };

    const matchedPath = Object.keys(metaData).find((path) => {
      if (path.includes(":")) {
        const basePath = path.split("/:")[0]; // 동적 경로의 기본 경로 추출
        return pathname.startsWith(basePath); // 기본 경로가 일치하는지 확인
      }
      return path === pathname;
    });

    const {title, description} = metaData[matchedPath] || defaultMeta;

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
      <Routes>
        {/* 레이아웃이 필요한 경로들을 Layout으로 감쌈 */}
        <Route element={<Layout/>}>
          <Route path="/home" element={<Home/>}/>
          <Route path="/admin-page" element={<AdminPage/>}/>
          <Route path="/roads-recommend" element={<RoadsRecommend/>}/>
          <Route path="/roads-search" element={<RoadsSearch/>}/>
          <Route path="/board-main" element={<BoardMain/>}/>
          <Route path="/board-detail/:postId" element={<BoardDetail/>}/>
          <Route path="/board-create" element={<BoardCreate/>}/>
          {/*<Route path="/board/:id" element={<BoardId/>}/>  동적 경로 */}
          <Route path="/mypage" element={<Mypage/>}/>
          <Route path="/inquire" element={<Inquire/>}/>
        </Route>

        {/* 레이아웃이 필요 없는 경로들 */}
        <Route path="/" element={<Login/>}/>
        <Route path="/find-pwd" element={<Findpwd/>}/>
        <Route path="/reset-pwd" element={<Resetpwd/>}/>

        {/* 잘못된 경로 처리 */}
        <Route path="*" element={<NotFound/>}/>
      </Routes>
  );
}

export default Router;

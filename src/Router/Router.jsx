import {useEffect} from "react";
import {
  Routes,
  Route,
  useNavigationType,
  useLocation,
} from "react-router-dom";

import Login from "../screens/Login.jsx";
import Signup from "../screens/Signup.jsx";
import Home from "../screens/Home.jsx";
import AdminPage from "../screens/Adminpage.jsx";
import Board_detail from "../screens/BoardDetail.jsx";
import Board_create from "../screens/BoardCreate.jsx";
import Board_main from "../screens/Board.jsx";
import Inquire from "../screens/Inquire.jsx";
import Roads_recommend from "../screens/RoadsRecommend.jsx";
import Roads_search from "../screens/RoadsSearch.jsx";
import Mypage from "../screens/Mypage.jsx";
import Findpwd from "../screens/Findpwd.jsx";
import MypageInput from "../screens/MypageInput.jsx";

// 가정: NotFound 컴포넌트가 있음

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
    let title = "Default Title"; // 기본 타이틀
    let metaDescription = "Default description"; // 기본 메타 설명

    switch (pathname) {
      case "/":
        title = "Login";
        metaDescription = "Login to access your account";
        break;
        // 기타 경로 설정도 이와 같이 구체적인 타이틀과 메타 설명을 설정
      case "/home":
        title = "Welcome Page";
        metaDescription = "Welcome to our website!";
        break;
        // 추가 경로 설정
      default:
        title = "Page Not Found";
        metaDescription = "This page does not exist.";
        break;
    }

    document.title = title;
    const metaDescriptionTag = document.querySelector(
        'head > meta[name="description"]');
    if (metaDescriptionTag) {
      metaDescriptionTag.content = metaDescription;
    }
  }, [pathname]);

  return (
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/find-pwd" element={<Findpwd/>}/>
        <Route path="/home" element={<Home/>}/>
        <Route path="/admin-page" element={<AdminPage/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/roads-recommend" element={<Roads_recommend/>}/>
        <Route path="/board-main" element={<Board_main/>}/>
        <Route path="/board-detail" element={<Board_detail/>}/>
        <Route path="/board-create" element={<Board_create/>}/>
        <Route path="/mypage" element={<Mypage/>}/>
        <Route path="/inquire" element={<Inquire/>}/>
        <Route path="/mypage-input" element={<MypageInput/>}/>
        <Route path="/roads-search" element={<Roads_search/>}/>
      </Routes>
  );
}

export default Router;

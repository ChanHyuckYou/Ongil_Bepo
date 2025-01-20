// Layout.jsx
import "react";
import TopNavigation from "./TopNavigation.jsx";
import SideNavigation from "./SideNavigation.jsx";
import DynamicHeader from "./DynamicHeader.jsx";
import {Outlet} from "react-router-dom";

const Layout = () => {
  return (
      <>
        <TopNavigation/>
        <SideNavigation/>
        <DynamicHeader/>
        <Outlet/> {/* 자식 Route의 컴포넌트가 렌더링되는 위치 */}
      </>
  );
};

export default Layout;

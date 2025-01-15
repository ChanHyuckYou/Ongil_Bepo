import "react";
import {createRoot} from "react-dom/client";
import Router from "./Router/Router.jsx";
import reportWebVitals from "./reportWebVitals";
import {BrowserRouter} from "react-router-dom";
import "./global.css";
import TopNavigation from "./nav/TopNavigation.jsx";
import SideNavigation from "./nav/SideNavigation.jsx";
import DynamicHeader from "./nav/DynamicHeader.jsx";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
    <BrowserRouter>
      <Router/>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
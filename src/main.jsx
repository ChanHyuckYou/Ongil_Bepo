import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/Login.module.css'

import Login from './screens/Login.jsx'
import Findpwd from './screens/Findpwd.jsx'
import Signup from './screens/Signup.jsx'
import MypageInput from './screens/MypageInput.jsx'
import Adminpage from './screens/Adminpage.jsx'
import Home from './screens/Home.jsx'
import RoadsSearch from './screens/RoadsSearch.jsx'
import RoadsRecommend from './screens/RoadsRecommend.jsx'
import Board from './screens/Board.jsx'
import BoardDetail from './screens/BoardDetail.jsx'
import BoardCreate from './screens/BoardCreate.jsx'
import Inquire from './screens/Inquire.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BoardCreate />
  </StrictMode>,
)

import {useNavigate} from 'react-router-dom';

function useNavigations() {
  const navigate = useNavigate();

  return (page) => {
    switch (page) {
      case "Home":
        navigate('/home');
        break;
      case "Login":
        navigate('/');
        break;
      case "Signup":
        navigate('/signup');
        break;
      case "AdminPage":
        navigate('/admin-page');
        break;
      case "BoardMain":
        navigate('/board-main');
        break;
      case "BoardDetail":
        navigate('/board-detail');
        break;
      case "BoardCreate":
        navigate('/board-create');
        break;
      case "Mypage":
        navigate('/mypage');
        break;
      case "Inquire":
        navigate('/inquire');
        break;
      case "Findpwd":
        navigate('/find-pwd');
        break;
      case "MypageInput":
        navigate('/mypage-input');
        break;
      case "RoadsRecommend":
        navigate('/roads-recommend');
        break;
      case "RoadsSearch":
        navigate('/roads-search');
        break;
      default:
        navigate('/not-found');
        break;
    }
  };
}

export default useNavigations;

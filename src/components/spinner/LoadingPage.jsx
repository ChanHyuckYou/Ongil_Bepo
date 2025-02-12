import  { useEffect, useState } from "react";
// RingLoader import
import { RingLoader } from "react-spinners";
import styles from "../../styles/LoadingPage.module.css";
import {color} from "framer-motion";

// eslint-disable-next-line react/prop-types
const LoadingPage = ({ isLoading }) => {
  const [loadingTime, setLoadingTime] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    let dotInterval;
    let timeInterval;

    if (isLoading) {
      // 로딩 시간(초) 증가
      timeInterval = setInterval(() => {
        setLoadingTime((prevTime) => prevTime + 1);
      }, 1000);

      // 점 개수 업데이트
      dotInterval = setInterval(() => {
        setDots((prev) => (prev.length < 4 ? prev + "." : ""));
      }, 500);
    }

    return () => {
      clearInterval(timeInterval);
      clearInterval(dotInterval);
      setLoadingTime(0);
      setDots("");
    };
  }, [isLoading]);

  return (
      <div className={styles.container}>
        {isLoading && (
            <>
              {/* react-spinners의 RingLoader 사용 */}
              <RingLoader
                  color="#D70654"       // 로더 색상
                  size={60}             // 로더 사이즈(px)
                  loading={isLoading}   // 로더 표시 여부
                  speedMultiplier={1}   // 로딩 애니메이션 속도
              />

              {/* 로딩 시간 + 점 표시 */}
              <p  className={styles.text}>
                AI가 열선 도로 추천중입니다{dots} ({loadingTime}초)
              </p>
            </>
        )}
      </div>
  );
};

export default LoadingPage;

import React, {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {AiOutlineLoading3Quarters} from "react-icons/ai";
import styles from "../../styles/LoadingPage.module.css";

const LoadingPage = ({isLoading}) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState(""); // 점 개수를 관리하는 상태

  useEffect(() => {
    let dotInterval; // 점 업데이트 interval
    let progressInterval; // 진행도 업데이트 interval

    if (isLoading) {
      // 진행도 업데이트
      progressInterval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 1 : 100));
      }, 50);

      // 점 개수 업데이트
      dotInterval = setInterval(() => {
        setDots((prev) => (prev.length < 4 ? prev + "." : "")); // 점이 4개가 되면 초기화
      }, 500); // 점이 늘어나는 속도 (0.5초)
    }

    return () => {
      clearInterval(progressInterval);
      clearInterval(dotInterval);
      setProgress(0); // 로딩 완료 후 초기화
      setDots(""); // 점 개수 초기화
    };
  }, [isLoading]);

  return (
      <div className={styles.container}>
        {isLoading && (
            <>
              {/* 로딩 아이콘 */}
              <motion.div
                  className={styles.icon}
                  animate={{rotate: 360}}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
              >
                <AiOutlineLoading3Quarters size={40}/>
              </motion.div>
              <p className={styles.text}>AI가 열선도로를 추천중{dots}</p>

              {/* 로딩 바 */}
              <div className={styles.progressBarContainer}>
                <motion.div
                    className={styles.progressBar}
                    initial={{width: 0}}
                    animate={{width: `${progress}%`}}
                    transition={{duration: 0.2}}
                />
              </div>

              {/* 로딩 퍼센트 */}
              <p className={styles.text}>{progress}%</p>
            </>
        )}
      </div>
  );
};

export default LoadingPage;

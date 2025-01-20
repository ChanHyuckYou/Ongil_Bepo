import {useState, useEffect} from 'react';
import styles from '../styles/Adminpage.module.css';

const Adminpage = () => {
  const [data, setData] = useState([]);

  // 서버에서 데이터 가져오기
  useEffect(() => {
    const testData = [
      {
        id: 1,
        region: '부천시청',
        department: '도시안전관리부',
        status: '승인 대기',
        dateTime: '2025-01-09 03:11:26',
      },
      {
        id: 2,
        region: '서울시청',
        department: '환경관리부',
        status: '승인 대기',
        dateTime: '2025-01-10 14:22:45',
      },
      {
        id: 3,
        region: '인천시청',
        department: '교통운영부',
        status: '승인 대기',
        dateTime: '2025-01-11 09:00:00',
      },
    ];
    setData(testData); // 테스트 데이터를 상태에 설정
  }, []);

  // 승인/거부 처리
  const handleApprove = (id) => {
    console.log(`Approved request ID: ${id}`);
    // 서버에 승인 요청 전송 로직 추가
  };

  const handleReject = (id) => {
    console.log(`Rejected request ID: ${id}`);
    // 서버에 거부 요청 전송 로직 추가
  };

  return (
      <div className={styles.adminpage}>
        <div className={styles.adminContent}>
          <h1>승인 요청 목록</h1>
          <table className={styles.table}>
            <thead>
            <tr>
              <th>ID</th>
              <th>관할 구역</th>
              <th>부서</th>
              <th>승인 여부</th>
              <th>날짜 및 시간</th>
              <th>액션</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.region}</td>
                  <td>{item.department}</td>
                  <td>{item.status}</td>
                  <td>{item.dateTime}</td>
                  <td>
                    <button
                        className={styles.approveBtn}
                        onClick={() => handleApprove(item.id)}
                    >
                      승인
                    </button>
                    <button
                        className={styles.rejectBtn}
                        onClick={() => handleReject(item.id)}
                    >
                      거부
                    </button>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default Adminpage;

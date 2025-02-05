import { useState, useEffect } from 'react';
import styles from '../styles/Adminpage.module.css';
import { fetchFileRequests, approveFileRequest, rejectFileRequest } from '../components/ApiRoute/admin.jsx';

const Adminpage = () => {
  const [data, setData] = useState([]);

  // 데이터 가져오기
  const getData = async () => {
    try {
      const result = await fetchFileRequests();
      const formattedData = result.file_requests.map(item => ({
        id: item.log_id,
        email: item.user_email,
        department: item.user_dept,
        region: item.jurisdiction,
        dateTime: item.c_date,
        status: '승인 대기', // 기본 상태
      }));
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // 승인 처리
  const handleApprove = async (logId) => {
    try {
      const response = await approveFileRequest(logId);
      alert(response.message); // FastAPI에서 받은 메시지 표시
      setData(prevData => prevData.map(item =>
        item.id === logId ? { ...item, status: '승인 완료' } : item
      ));
    } catch (error) {
      console.error('Error approving request:', error);
      alert("승인 중 오류가 발생했습니다.");
    }
  };

  // 거부 처리
  const handleReject = async (logId) => {
    try {
      await rejectFileRequest(logId);
      alert("요청이 거부되었습니다.");
      setData(prevData => prevData.map(item =>
        item.id === logId ? { ...item, status: '거부됨' } : item
      ));
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert("거부 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className={styles.adminpage}>
      <h1>승인 요청 목록</h1>
      <div className={styles.adminContent}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>이메일</th>
                <th>부서</th>
                <th>관할 구역</th>
                <th>날짜 및 시간</th>
                <th>승인 여부</th>
                <th>승인 선택</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.email}</td>
                  <td>{item.department}</td>
                  <td>{item.region}</td>
                  <td>{item.dateTime}</td>
                  <td>{item.status}</td>
                  <td>
                    {item.status === '승인 대기' && (
                      <>
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
                      </>
                    )}
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

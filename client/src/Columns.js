import React, { useState, useEffect } from 'react';
import { fetchColumnsForBoard } from './api';

function Columns({ boardId }) {
  const [columns, setColumns] = useState([]); // 1단계: 초기 상태를 빈 배열로 설정

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const columnsData = await fetchColumnsForBoard(boardId);
        setColumns(columnsData);
      } catch (error) {
        console.error('컬럼을 불러오는 데 실패했습니다:', error);
      }
    };

    if (boardId) {
      fetchColumns();
    }
  }, [boardId]);

  return (
    <div className="columns">
      {columns.map((column) => (
        <div key={column.id} className="column">
          <div className="column-title">{column.name}</div>
          {/* 컬럼 관련 추가 내용 */}
        </div>
      ))}
    </div>
  );
}

export default Columns;

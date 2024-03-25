import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const accessToken = localStorage.getItem('accessToken');

export const createBoard = async (newBoard) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/board`,
      {
        ...newBoard,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } catch (error) {
    console.error('보드를 저장하는데 실패했습니다. : ', error);
    throw error;
  }
};
export const getMyId = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.id;
  } catch (error) {
    console.error('내 정보를 불러오는 데 실패했습니다: ', error);
    throw error;
  }
};

export const fetchBoards = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/board/myBoard`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data.boards;
  } catch (error) {
    console.error('보드를 불러오는 데 실패했습니다: ', error);
    throw error;
  }
};

export const fetchColumnsForBoard = async (boardId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/column/get-all/${boardId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('컬럼을 불러오는 데 실패했습니다: ', error);
    throw error;
  }
};

export const handleLogin = async (
  email,
  password,
  onLoginSuccess,
  onLoginFailure,
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    onLoginSuccess(response.data);
  } catch (error) {
    console.error('로그인 실패: ', error);
    if (onLoginFailure) onLoginFailure(error.response.data.message);
  }
};

export const fetchTasksForColumn = async (columnId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/task/get-all/${columnId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(`태스크를 불러오는 데 실패했습니다: `, error);
    throw error;
  }
};

export const addColumnToBoard = async (boardId, name) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/column/create-column`,
      {
        boardId,
        name,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(`컬럼을 저장하지 못했습니다.`, error);
    throw error;
  }
};

export const deleteColumnById = async (columnId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/column/${columnId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error(`컬럼을 삭제하지 못했습니다.`, error);
    throw error;
  }
};

/**
 * 보드 초대
 */
export const fetchNonColumnMembers = async (columnId) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/board/not-in-board/${columnId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.error(`초대 대상자를 불러오는 데 실패했습니다: `, error);
    throw error;
  }
};
export const inviteUserToBoard = async(boardId, userId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/board/${boardId}`,
      {
        inviteId: `[${userId}]`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } catch (error) {
    console.log("userId : "+userId)
    console.log(error)
    console.error(`초대에 실패했습니다: `, error);
    throw error;
  }
}

/**
 * Task 순서 변경 1
 * @param {*} columnId
 * @param {*} taskOrder
 */
export const updateTaskOrder = async (columnId, taskOrder) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/column/task-order/${columnId}`,
      {
        taskOrder: `[${taskOrder}]`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } catch (error) {
    console.error(`컬럼을 이동하지 못했습니다.`, error);
    throw error;
  }
};

export const moveTaskToAnotherColumn = async (columnId, taskId) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/task/chg-task-col`,
      {
        taskId: taskId,
        columnId: columnId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } catch (error) {}
};

/**
 * 컬럼 순서 변경
 */
export const updateColumnOrder = async (boardId, columnOrder) => {
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/board/column-order/${boardId}`,
      {
        columnOrder: `[${columnOrder}]`,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } catch (error) {
    console.error(`컬럼을 이동하지 못했습니다.`, error);
    throw error;
  }
};

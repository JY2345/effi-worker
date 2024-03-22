import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const accessToken = localStorage.getItem('accessToken');
export const fetchBoards = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/board`, {
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

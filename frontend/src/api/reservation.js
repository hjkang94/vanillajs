const BASE_URL = "https://frontend.tabling.co.kr";

const getReservations = async () => {
  try {
    const response = await fetch(`${BASE_URL}/v1/store/9533/reservations`);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error('네트워크 응답 에러');
    }
  } catch (e) {
    console.error(e);
  }
};

export { getReservations };
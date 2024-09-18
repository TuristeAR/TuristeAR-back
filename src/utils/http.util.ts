import status from 'http-status';

export const get = async (url: string): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    return await response.json();
  } catch (error) {
    return {
      error: error,
      status: status.INTERNAL_SERVER_ERROR,
    };
  }
};

export const post = async (url: string, body: any): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });

    return await response.json();
  } catch (error) {
    return {
      error: error,
      status: status.INTERNAL_SERVER_ERROR,
    };
  }
};

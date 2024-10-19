import { get, post } from '../../src/domain/utils/http.util';

global.fetch = jest.fn();

describe('http.util', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  describe('get', () => {
    it('should return data when fetch is successful', async () => {
      const mockResponse = { data: 'test' };

      (fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await get('https://example.com', {
        'Content-Type': 'application/json',
      });

      expect(result).toEqual(mockResponse);

      expect(fetch).toHaveBeenCalledWith('https://example.com', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
    });

    it('should return error and status when fetch fails', async () => {
      const mockError = new Error('Fetch failed');

      (fetch as jest.Mock).mockRejectedValue(mockError);

      const result = await get('https://example.com', {
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      expect(result).toEqual({
        error: mockError,
        status: 500,
      });
    });
  });

  describe('post', () => {
    it('should return data when fetch is successful', async () => {
      const mockResponse = { data: 'test' };

      (fetch as jest.Mock).mockResolvedValue({
        json: jest.fn().mockResolvedValue(mockResponse),
      });

      const result = await post(
        'https://example.com',
        {
          'Content-Type': 'application/json',
        },
        { key: 'value' },
      );

      expect(result).toEqual(mockResponse);

      expect(fetch).toHaveBeenCalledWith('https://example.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ key: 'value' }),
      });
    });

    it('should return error and status when fetch fails', async () => {
      const mockError = new Error('Fetch failed');

      (fetch as jest.Mock).mockRejectedValue(mockError);

      const result = await post(
        'https://example.com',
        { key: 'value' },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ key: 'value' }),
        },
      );

      expect(result).toEqual({
        error: mockError,
        status: 500,
      });
    });
  });
});

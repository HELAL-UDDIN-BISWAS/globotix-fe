import { act } from '@testing-library/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import useAuth from './useAuth';

// Mocking dependencies
jest.mock('axios');
jest.mock('js-cookie');

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.getState().logout();
  });

  it('should initialize with default values', () => {
    const store = useAuth.getState();
    expect(store.user).toBe(null);
    expect(store.isAuthenticated).toBe(false);
    expect(store.loading).toBe(true);
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = { status: 200, data: { email: 'test@example.com' } };
      axios.post.mockResolvedValueOnce(mockResponse);

      await act(async () => {
        const result = await useAuth.getState().login('test@example.com', 'password');
        expect(result).toEqual(mockResponse);
      });

      expect(Cookies.set).toHaveBeenCalledWith('password', 'password');
      expect(Cookies.set).toHaveBeenCalledWith('email', 'test@example.com');
    });

    it('should handle login error', async () => {
      const mockError = {
        response: {
          data: {
            error: {
              message: 'Invalid credentials',
              details: { data: { lockedOutTimingInMillisecond: 300000 } }
            }
          }
        }
      };
      axios.post.mockRejectedValueOnce(mockError);

      await act(async () => {
        const result = await useAuth.getState().login('test@example.com', 'wrong_password');
        expect(result).toEqual({
          msg: 'Invalid credentials',
          time: 300000
        });
      });
    });
  });

  describe('loginOtp', () => {
    it('should login with OTP successfully', async () => {
      const mockResponse = { data: { accessToken: 'token123', user: { id: 1, name: 'Test User' } } };
      axios.post.mockResolvedValueOnce(mockResponse);
      Cookies.get.mockReturnValueOnce('test@example.com');

      await act(async () => {
        const result = await useAuth.getState().loginOtp('123456');
        expect(result).toEqual(mockResponse);
      });

      const store = useAuth.getState();
      expect(store.user).toEqual(mockResponse.data);
      expect(store.isAuthenticated).toBe(true);
      expect(store.accessToken).toBe('token123');
      expect(Cookies.remove).toHaveBeenCalledWith('password');
      expect(Cookies.remove).toHaveBeenCalledWith('email');
      expect(Cookies.set).toHaveBeenCalledWith('accessToken', 'token123');
      expect(Cookies.set).toHaveBeenCalledWith('user', JSON.stringify(mockResponse.data));
    });

    it('should handle OTP login error', async () => {
      const mockError = { response: 'OTP Error' };
      axios.post.mockRejectedValueOnce(mockError);

      await act(async () => {
        const result = await useAuth.getState().loginOtp('wrong_otp');
        expect(result).toBe('OTP Error');
      });
    });
  });

  describe('logout', () => {
    it('should logout successfully', () => {
      useAuth.setState({ user: { id: 1 }, isAuthenticated: true });

      act(() => {
        useAuth.getState().logout();
      });

      const store = useAuth.getState();
      expect(store.user).toBe(null);
      expect(store.isAuthenticated).toBe(false);
      expect(Cookies.remove).toHaveBeenCalledWith('user');
      expect(Cookies.remove).toHaveBeenCalledWith('accessToken');
    });
  });

  describe('getMe', () => {
    it('should fetch user data successfully', async () => {
      const mockUser = { id: 1, name: 'Test User' };
      axios.get.mockResolvedValueOnce({ data: mockUser });
      Cookies.get.mockReturnValueOnce('token123');

      await act(async () => {
        await useAuth.getState().getMe();
      });

      const store = useAuth.getState();
      expect(store.user).toEqual(mockUser);
      expect(store.loading).toBe(false);
      expect(Cookies.set).toHaveBeenCalledWith('user', JSON.stringify(mockUser));
    });

    it('should handle getMe error', async () => {
      axios.get.mockRejectedValueOnce(new Error('Fetch error'));

      await act(async () => {
        await useAuth.getState().getMe();
      });

      const store = useAuth.getState();
      expect(store.loading).toBe(false);
      expect(store.user).toBe(null);
    });
  });
});
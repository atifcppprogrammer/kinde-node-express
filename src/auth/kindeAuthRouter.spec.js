import { getInternalClient } from '../setup';
import {
  setupKindeMock,
  mockClientConfig as mockConfig,
  getMockAuthURL,
} from '../mocks';
import request from 'supertest';

describe('kindeAuthRouter', () => {
  const app = setupKindeMock();

  describe('handleRegister()', () => {
    const internalClient = getInternalClient();
    const registerMock = jest.spyOn(internalClient, 'register');

    afterEach(() => {
      registerMock.mockClear();
    });

    it('redirects user to registration URL generated by internal client', async () => {
      const registerURL = getMockAuthURL({ start_page: 'registration' });
      registerMock.mockResolvedValue(registerURL);
      const response = await request(app).get('/register');
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe(registerURL.toString());
    });

    it('raises exception if optional organization code is invalid', async () => {
      const query = { org_code: '' };
      const response = await request(app).get('/register').query(query);
      expect(response.status).toBe(400);
      expect(response.text).toContain('org_code');
      expect(response.text).toContain('invalid value');
    });
  });
  describe('handleLogin()', () => {
    const internalClient = getInternalClient();
    const loginMock = jest.spyOn(internalClient, 'login');

    afterEach(() => {
      loginMock.mockClear();
    });

    it('redirects user to login URL generated by internal client', async () => {
      const loginURL = getMockAuthURL();
      loginMock.mockResolvedValue(loginURL);
      const response = await request(app).get('/login');
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe(loginURL.toString());
    });

    it('raises exception if optional organization code is invalid', async () => {
      const query = { org_code: '' };
      const response = await request(app).get('/login').query(query);
      expect(response.status).toBe(400);
      expect(response.text).toContain('org_code');
      expect(response.text).toContain('invalid value');
    });
  });

  describe('handleCallback()', () => {
    const internalClient = getInternalClient();
    const redirectToAppMock = jest.spyOn(internalClient, 'handleRedirectToApp');

    afterEach(() => {
      redirectToAppMock.mockClear();
    });

    it('redirects to siteUrl if internal client handles redirection successfully', async () => {
      redirectToAppMock.mockResolvedValue(undefined);
      const response = await request(app).get('/kinde_callback');
      expect(response.status).toBe(302);
      expect(redirectToAppMock).toHaveBeenCalledTimes(1);
      expect(response.headers.location).toBe(mockConfig.siteUrl);
    });

    it('redirects to unAuthorisedUrl if internal client fails to handle redirection', async () => {
      redirectToAppMock.mockRejectedValue(new Error('error'));
      const response = await request(app).get('/kinde_callback');
      expect(response.status).toBe(302);
      expect(response.headers.location).toBe(mockConfig.unAuthorisedUrl);
    });
  });
});
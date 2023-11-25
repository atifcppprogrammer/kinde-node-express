import { GrantType, createKindeServerClient } from '@kinde-oss/kinde-typescript-sdk';
import { version as frameworkSDKVersion } from '../version';

/**
 * @typedef {Object} SetupConfig
 * @property {string} issuerBaseUrl
 * @property {string} redirectUrl
 * @property {string} siteUrl
 * @property {string} secret
 * @property {string} unAuthorisedUrl
 * @property {string} clientId
 */

/**
 * @type{SetupConfig}
 */
let initialConfig;

/**
 * @type{import('@kinde-oss/kinde-typescript-sdk').ACClient}
 */
let internalClient;

/**
 * Returns the above `initialConfig` private to this module, throws an exception if
 * said `initialConfig` has not been initialized.
 *
 * @returns {SetupConfig}
 */
export const getInitialConfig = () => {
  if (initialConfig === undefined) {
    throw new Error('Initial config is not initialized');
  } else {
    return initialConfig;
  }
};

/**
 * Returns the above `internalClient` private to this module, throws an exception if
 * said `internalClient` has not been initialized.
 *
 * @returns{import('@kinde-oss/kinde-typescript-sdk').ACClient}
 */
export const getInternalClient = () => {
  if (internalClient === undefined) {
    throw new Error('Internal Kinde server client is not initialized');
  } else {
    return internalClient;
  }
};

/**
 * Validates provided config, raises exception if any required parameters are
 * missing otherwise returns same config.
 *
 * @param {SetupConfig} config
 * @returns {SetupConfig}
 */
export const validateInitialConfig = (config) => {
  const { issuerBaseUrl, redirectUrl, siteUrl, secret, unAuthorisedUrl, clientId } =
    config;

  if (!issuerBaseUrl) {
    throw new Error("Required config parameter 'issuerBaseUrl' is not provided");
  }

  if (!siteUrl) {
    throw new Error("Required config parameter 'siteUrl' is not provided");
  }

  if (!secret) {
    throw new Error("Required config parameter 'secret' is not provided");
  }

  if (!clientId) {
    throw new Error("Required config parameter 'clientId' is not provided");
  }

  if (!unAuthorisedUrl) {
    throw new Error("Required config parameter 'unAuthorisedUrl' is not provided");
  }

  if (!redirectUrl) {
    throw new Error("Required config parameter 'redirectUrl' is not provided");
  }

  return config;
};

/**
 * Initializes above `initialConfig` and `internalClient` raises an exception if
 * validation of provided config failes, returns created client otherwise.
 *
 * @param {SetupConfig} config
 * @returns{import('@kinde-oss/kinde-typescript-sdk').ACClient}
 */
export const setupInternalClient = (config) => {
  const { issuerBaseUrl, redirectUrl, siteUrl, secret, clientId } = config;

  initialConfig = validateInitialConfig(config);
  internalClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
    authDomain: issuerBaseUrl,
    redirectURL: redirectUrl,
    clientId: clientId ?? 'reg@live',
    clientSecret: secret,
    logoutRedirectURL: siteUrl,
    scope: 'openid profile email',
    framework: 'ExpressJS',
    frameworkVersion: frameworkSDKVersion,
  });

  return internalClient;
};

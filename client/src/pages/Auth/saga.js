import { call, put, takeLatest } from 'redux-saga/effects';
import { authorizeSelf, generateAccessToken, register } from '../../api/user';
import { loginSuccess, registerSuccess, requestLogin, requestLogout, requestRegister } from '../../shared/slices/auth';
import { clearAccessTokenToLocalStore, generateAuthenticationHeaders, handleAuthenticationErrorCodes, setAccessTokenToLocalStore } from '../../utils/authentication';

/**
 * 
 * @param {object} data
 * @param {object} data.payload
 * @param {string} data.payload.email
 * @param {string} data.payload.name
 * @param {string} data.payload.password
 */

export function* registerWorker({ payload }) {
  try {
    yield call(register, payload);
    window.location.href = '/auth'
  } catch (error) {
    console.log(error.message);
    const { code } = error.message;
    const message = handleAuthenticationErrorCodes(code);
    alert(message);
  } finally {
    yield put(registerSuccess(payload));
  }
}
/**
 * 
 * @param {object} data
 * @param {object} data.payload
 * @param {string} data.payload.email
 * @param {string} data.payload.password
 */

export function* loginWorker({ payload }) {
  try {
    // get access token
    const { item: accessToken } = yield call(generateAccessToken, payload);
    // store the access token in local storage
    yield call(setAccessTokenToLocalStore, accessToken);
    window.location.href = '/app'
  } catch (err) {
    console.log(err.message);
    alert(err.message)
  }
}

export function* logoutWorker() {
  pendo.clearSession();
  yield call(clearAccessTokenToLocalStore);
  window.location.href = '/auth';
}

export function* authWatcher() {
  yield takeLatest(requestRegister.type, registerWorker);
  yield takeLatest(requestLogin.type, loginWorker);
  yield takeLatest(requestLogout.type, logoutWorker);
}

export function* authorize(accessToken) {
  try {
    const { item: user } = yield call(authorizeSelf, generateAuthenticationHeaders(accessToken));
    yield put(loginSuccess(user));
    return user;
  } catch (err) {
    yield call(logoutWorker);
  }
}
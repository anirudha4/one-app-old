import { call, put } from "redux-saga/effects";
import { init } from "../../api/init";
import { generateAuthenticationHeaders } from "../../utils/authentication";
import { appInit } from "../slices/core";

export function * loadDataForOrganization(accessToken) {
    const { user, included }  = yield call(init, generateAuthenticationHeaders(accessToken));
    yield put(appInit({
        user,
        ...included
    }))
    return { user, included };
}
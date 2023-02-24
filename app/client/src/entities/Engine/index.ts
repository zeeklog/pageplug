import {
  fetchApplication,
  fetchApplicationPreviewWxaCode,
} from "actions/applicationActions";
import {
  setAppMode,
  updateAppStore,
  fetchCloudOSApi,
} from "actions/pageActions";
import {
  ApplicationPayload,
  ReduxActionErrorTypes,
  ReduxActionTypes,
} from "@appsmith/constants/ReduxActionConstants";
import { getPersistentAppStore } from "constants/AppConstants";
import { APP_MODE } from "entities/App";
import log from "loglevel";
import { call, put, select } from "redux-saga/effects";
import { failFastApiCalls } from "sagas/InitSagas";
import { getDefaultPageId } from "sagas/selectors";
import { getCurrentApplication } from "selectors/applicationSelectors";
import { isMobileLayout } from "selectors/editorSelectors";
import history from "utils/history";
import URLRedirect from "entities/URLRedirect/index";
import URLGeneratorFactory from "entities/URLRedirect/factory";
import { updateBranchLocally } from "actions/gitSyncActions";

export type AppEnginePayload = {
  applicationId?: string;
  pageId?: string;
  branch?: string;
  mode: APP_MODE;
  queryParams?: any;
};

export interface IAppEngine {
  setupEngine(payload: AppEnginePayload): any;
  loadAppData(payload: AppEnginePayload): any;
  loadAppURL(pageId: string, pageIdInUrl?: string): any;
  loadAppEntities(toLoadPageId: string, applicationId: string): any;
  loadGit(applicationId: string): any;
  completeChore(): any;
}

export class AppEngineApiError extends Error {}
export class PageNotFoundError extends AppEngineApiError {}
export class ActionsNotFoundError extends AppEngineApiError {}
export class PluginsNotFoundError extends AppEngineApiError {}
export class PluginFormConfigsNotFoundError extends AppEngineApiError {}

export default abstract class AppEngine {
  private _mode: APP_MODE;
  constructor(mode: APP_MODE) {
    this._mode = mode;
    this._urlRedirect = null;
  }
  private _urlRedirect: URLRedirect | null;

  abstract loadAppEntities(toLoadPageId: string, applicationId: string): any;
  abstract loadGit(applicationId: string): any;
  abstract startPerformanceTracking(): any;
  abstract stopPerformanceTracking(): any;
  abstract completeChore(): any;

  *loadAppData(payload: AppEnginePayload) {
    const { applicationId, branch, pageId, queryParams } = payload;

    // sync CloudOS api
    if (queryParams && queryParams.get("inCloudOS") === "true") {
      const depList = queryParams.get("depList") || "";
      const projectId = queryParams.get("projectId");
      const orgId = queryParams.get("orgId");
      if (projectId && orgId) {
        yield failFastApiCalls(
          [fetchCloudOSApi(pageId || "", depList.split(","), projectId, orgId)],
          [ReduxActionTypes.FETCH_CLOUDOS_API_SUCCESS],
          [ReduxActionErrorTypes.FETCH_CLOUDOS_API_ERROR],
        );
      }
    }

    const apiCalls: boolean = yield failFastApiCalls(
      [fetchApplication({ applicationId, pageId, mode: this._mode })],
      [
        ReduxActionTypes.FETCH_APPLICATION_SUCCESS,
        ReduxActionTypes.FETCH_PAGE_LIST_SUCCESS,
      ],
      [
        ReduxActionErrorTypes.FETCH_APPLICATION_ERROR,
        ReduxActionErrorTypes.FETCH_PAGE_LIST_ERROR,
      ],
    );
    if (!apiCalls)
      throw new PageNotFoundError(`Cannot find page with id: ${pageId}`);
    const application: ApplicationPayload = yield select(getCurrentApplication);
    yield put(updateAppStore(getPersistentAppStore(application.id, branch)));

    // get weapp WxaCode preview image
    const isMobile = yield select(isMobileLayout);
    const isPublishedMode = this._mode === APP_MODE.PUBLISHED;
    if (isMobile && isPublishedMode) {
      yield failFastApiCalls(
        [fetchApplicationPreviewWxaCode(application.id)],
        [ReduxActionTypes.FETCH_APPLICATION_PREVIEW_SUCCESS],
        [ReduxActionErrorTypes.FETCH_APPLICATION_PREVIEW_ERROR],
      );
    }

    const toLoadPageId: string = pageId || (yield select(getDefaultPageId));
    this._urlRedirect = URLGeneratorFactory.create(
      application.applicationVersion,
      this._mode,
    );
    return { toLoadPageId, applicationId: application.id };
  }

  *setupEngine(payload: AppEnginePayload): any {
    const { branch } = payload;
    yield put(updateBranchLocally(branch || ""));
    yield put(setAppMode(this._mode));
    yield put({ type: ReduxActionTypes.START_EVALUATION });
  }

  *loadAppURL(pageId: string, pageIdInUrl?: string) {
    try {
      if (!this._urlRedirect) return;
      const newURL: string = yield call(
        this._urlRedirect.generateRedirectURL.bind(this),
        pageId,
        pageIdInUrl,
      );
      if (!newURL) return;
      history.replace(newURL);
    } catch (e) {
      log.error(e);
    }
  }
}

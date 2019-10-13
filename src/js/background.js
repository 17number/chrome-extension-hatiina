'use strict';

import hotreload from "crx-hotreload";
import browser from "webextension-polyfill";
import HatenaApi from './hatena-api.js';
const hatenaApi = new HatenaApi();

browser.runtime.onMessage.addListener(async (message, sender, callback) => {
  let res, result;
  console.debug({message: message});
  switch (message.type) {
    case `GET_COMMENTS`:
      res = await hatenaApi.getComments(message.url);
      console.debug({res: res});
      result = {data: res};
      break;

    case `FETCH_COMMENTS_STARS`:
      res = await hatenaApi.countsStars(message.urls);
      console.debug({res: res});
      result = {data: res};
      break;

    default:
      result = {data: '', error: `INVALID MESSAGE`};
      break;
  }
  return result;
});

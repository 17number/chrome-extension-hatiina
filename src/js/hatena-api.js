const BOOKMARK_COMMENTS = `https://b.hatena.ne.jp/api/entry/TARGET_URL/bookmarks?commented_only=1&limit=5000`;
const COMMENT_STARS = `https://s.hatena.ne.jp/entry.json?no_comments=1`;

export default class HatenaApi {
  constructor() {
    this.axios = require("axios");
  }

  async getComments(url) {
    return await this.axios.get(
      BOOKMARK_COMMENTS.replace("TARGET_URL", this.convertToEncoded(url))
    );
  }

  async countsStars(urls) {
    return await this.axios.get(
      COMMENT_STARS + urls
    );
  }

  extractRawUrl(url) {
    return url.split("?")[0].split("#")[0];
  }

  convertToEncoded(url) {
    url = this.extractRawUrl(url);
    return encodeURIComponent(url);
  }
}

const BOOKMARK_BASE = `https://b.hatena.ne.jp`;
const BOOKMARK_LITE = `${BOOKMARK_BASE}/entry/jsonlite/?url=TARGET_URL`;
const BOOKMARK_COMMENTS = `${BOOKMARK_BASE}/api/entry/TARGET_URL/bookmarks?commented_only=1&limit=5000`;
const COMMENT_STARS = `https://s.hatena.com/entry.json?uri=TARGET_URI`;

export default class HatenaApi {
  constructor() {
    this.axios = require("axios");
  }

  async getComments(url) {
    return await this.axios.get(
      BOOKMARK_COMMENTS.replace("TARGET_URL", this.convertToEncoded(url))
    );
  }

  async getEntryInfo(url) {
    return await this.axios.get(
      BOOKMARK_LITE.replace('TARGET_URL', this.convertToEncoded(url))
    );
  }

  async getCommentStar(date, user, eid) {
    return await this.axios.get(
      COMMENT_STARS.replace(
        "TARGET_URI",
        encodeURIComponent(this.getCommentStarUrl(date, user, eid))
      )
    );
  }

  async countStars(date, user, eid) {
    const star = await this.getCommentStar(date, user, eid);
    let stars = {
      normal: 0,
      green: 0,
      red: 0,
      blue: 0,
      total: 0,
    };
    if (star.data.entries.length) {
      const entry = star.data.entries[0];
      stars.normal = entry.stars.length;
      stars.total += stars.normal;
      if (entry.colored_stars) {
        entry.colored_stars.forEach(coloredStar => {
          stars[coloredStar.color] = coloredStar.stars.length;
          stars.total += coloredStar.stars.length;
        });
      }
    }
    return stars;
  }

  getCommentStarUrl(date, user, eid) {
    return `${BOOKMARK_BASE}/${user}/${date}#bookmark-${eid}`;
  }

  extractRawUrl(url) {
    return url.split("?")[0].split("#")[0];
  }

  convertToEncoded(url) {
    url = this.extractRawUrl(url);
    return encodeURIComponent(url);
  }
}

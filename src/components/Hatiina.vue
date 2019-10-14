<template>
  <div>
    <details v-if="bookmarks.length">
      <summary>
        <span class="hatiina-text-with-image">
          <HatenaBookmarkLogo class="hatiina-hatebu-logo" />
        </span>
        ブコメ({{bookmarks.length}})を見る
      </summary>
      <HatiinaBookmark :encodedUrl="encodedUrl" />
      <div id="hatiina-comments">
        <div class="hatiina-comments-wrapper" v-for="(bookmark, index) in bookmarks" :key="index">
          <HatiinaComment :eid="eid" :bookmark="bookmark" />
        </div>
      </div>
    </details>
    <div v-else>
      <HatiinaLoader v-if="loading" />
      <div v-else>
        <span class="hatiina-text-with-image">
          <HatenaBookmarkLogo class="hatiina-hatebu-logo" />
        </span>
        ブコメ無し
        <HatiinaBookmark :encodedUrl="encodedUrl" />
      </div>
    </div>
  </div>
</template>

<script>
import HatenaBookmarkLogo from '@/img/hatenabookmark-logomark.svg';
import HatiinaComment from "@/components/HatiinaComment.vue";
import HatiinaBookmark from "@/components/HatiinaBookmark.vue";
import HatiinaLoader from "@/components/HatiinaLoader.vue";
const browser = require("webextension-polyfill");
const moment = require("moment-timezone");

export default {
  name: "Hatiina",
  components: {
    HatenaBookmarkLogo,
    HatiinaComment,
    HatiinaBookmark,
    HatiinaLoader,
  },
  data() {
    return {
      eid: 0,
      bookmarks: [],
      loading: true,
      encodedUrl: encodeURIComponent(location.href),
    };
  },
  methods: {
    async getComments() {
      const res = await browser.runtime.sendMessage({
        type: `GET_COMMENTS`,
        url: location.href,
      });
      const bookmarks = res.data.data.bookmarks;
      if (bookmarks.length) {
        this.eid = bookmarks[0].location_id;
      }
      await this.countsStars(bookmarks);
    },
    async countsStars(bookmarks) {
      let urls = "";
      let promises = [];
      bookmarks.forEach(async bookmark => {
        const date = moment(bookmark.created).tz("Asia/Tokyo").format("YYYYMMDD");
        this.bookmarks.push({
          name: bookmark.user.name,
          image: bookmark.user.image.image_url,
          comment: bookmark.comment,
          date: date,
          dateReadable: moment(bookmark.created).tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm"),
          stars: {normal: 0, red: 0, green: 0, blue: 0, total: 0},
        })

        const uri = `https://b.hatena.ne.jp/${bookmark.user.name}/${date}#bookmark-${this.eid}`;
        urls += `&uri=${encodeURIComponent(uri)}`;
        // API request の URL 最大長が 8196 まで(ぽい)
        if (urls.length >= 8000) {
          promises.push(this.fetchStars(urls));
          urls = "";
        }
      });
      if (urls.length) {
        promises.push(this.fetchStars(urls));
      }
      await Promise.all(promises);
      this.loading = false;
    },
    async fetchStars(urls) {
      const res = await browser.runtime.sendMessage({
        type: `FETCH_COMMENTS_STARS`,
        urls: urls,
      });
      res.data.data.entries.forEach(entry => {
        const user = entry.uri.replace("https://b.hatena.ne.jp/", "").split("/")[0];
        let b = this.bookmarks.filter(bookmark => bookmark.name === user)[0];
        b.stars.normal = entry.stars.length;
        b.stars.total += b.stars.normal;
        if (!entry.colored_stars) {
          return;
        }
        entry.colored_stars.forEach(coloredStar => {
          b.stars[coloredStar.color] = coloredStar.stars.length;
          b.stars.total += coloredStar.stars.length;
        })
      });
    }
  },
  async created() {
    await this.getComments();
    this.bookmarks.sort((a, b) => b.stars.total - a.stars.total);
  }
};
</script>

<style scoped lang="scss">
summary {
  margin-bottom: 10px;
  cursor: pointer;
}

.hatiina-hatebu-logo {
  width: 16px;
  height: 16px;
}
</style>

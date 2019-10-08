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
      await this.countStars(bookmarks);
    },
    async countStars(bookmarks) {
      this.bookmarks = await Promise.all(bookmarks.map(async bookmark => {
        const date = moment(bookmark.created).tz("Asia/Tokyo").format("YYYYMMDD");
        const res = await browser.runtime.sendMessage({
          type: `COUNT_COMMENT_STARS`,
          date: date,
          user: bookmark.user.name,
          eid: this.eid,
        });

        return {
          name: bookmark.user.name,
          image: bookmark.user.image.image_url,
          comment: bookmark.comment,
          date: date,
          dateReadable: moment(bookmark.created).tz("Asia/Tokyo").format("YYYY/MM/DD HH:mm"),
          stars: res.data,
        };
      }));
      this.loading = false;
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

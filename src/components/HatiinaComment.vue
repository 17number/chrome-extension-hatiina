<template>
  <div class="hatiina-comment-wrapper">
    <div class="hatiina-comment-user">
      <a :href="`https://b.hatena.ne.jp/${bookmark.name}`" target="_blank" rel="noopener noreferrer">
        <img :src="bookmark.image">
        <p>{{ bookmark.name }}</p>
      </a>
    </div>
    <div class="hatiina-comment-body">
      <div class="hatiina-comment-content">
        <p>{{ bookmark.comment }}</p>
      </div>
      <div class="hatiina-comment-footer">
        <a :href="`https://b.hatena.ne.jp/${bookmark.name}/${bookmark.date}#bookmark-${eid}`" target="_blank" rel="noopener noreferrer">
          {{ bookmark.dateReadable }}
        </a>
        <span class="star" v-if="bookmark.stars.normal">
          <img :src="require('@/img/star.png')">
          {{ `× ${bookmark.stars.normal}` }}
        </span>
        <span v-for="(color, index) in colors">
          <span class="star" v-if="bookmark.stars[color]">
            <img :src="require(`@/img/star_${color}.png`)">
            {{ `× ${bookmark.stars[color]}` }}
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HatiinaComment",
  props: [
    'bookmark',
    'eid',
  ],
  data() {
    return {
      colors: ['green', 'red', 'blue'],
    }
  }
};
</script>

<style scoped lang="scss">
.hatiina-comment-wrapper {
  display: flex;
  margin-bottom: 15px;

  .hatiina-comment-user {
    flex-basis: 10%;
    overflow: hidden;
    text-align: center;
    margin-right: 15px;
    padding-left: 5px;
    img {
      width: 50px;
      height: 50px;
      max-width: 100%;
      border-radius: 50%;
      border: 1px solid lightgray;
    }
    p {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .hatiina-comment-body {
    flex-basis: 90%;
    display: flex;
    flex-flow: column;
    justify-content: space-around;
    .hatiina-comment-content {
      margin-bottom: 5px;
    }

    .hatiina-comment-footer {
      a {
        margin-right: 5px;
      }
      img {
        width: 16px;
        height: 16px;
      }
      .star {
        margin-right: 5px;
        img {
          vertical-align: text-top;
        }
      }
    }
  }
}
</style>

<template>
  <div class="hatiina-hatebu-link">
    <a :href="`https://b.hatena.ne.jp/entry/panel/?url=${encodedUrl}`" target="_blank" rel="noopener noreferrer" class="hatiina-text-with-image">
      <font-awesome-icon :icon="['fas', 'bookmark']" class="hatiina-bookmark-plus" />
      ブックマークする
    </a>
  </div>
</template>

<script>
export default {
  name: "HatiinaBookmark",
  props: [
    'encodedUrl',
  ]
};
</script>

<style scoped lang="scss">
.hatiina-hatebu-link {
  margin-right: 3px;
  margin-bottom: 15px;

  .hatiina-text-with-image {
    vertical-align: middle;

    .hatiina-bookmark-plus {
      color: #1FA4DE;
      width: 16px;
      height: 16px;
    }
  }
}

details .hatiina-hatebu-link {
  margin-left: 15px;
}
</style>

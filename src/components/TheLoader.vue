<template>
  <div class="loader">
    <content-loader viewBox="0 0 250 38" primaryColor="#ccc">
      <rect x="0" y="0" rx="3" ry="3" width="100" height="8" />
      <rect x="0" y="12" rx="3" ry="3" width="250" height="6" />
      <rect x="0" y="22" rx="3" ry="3" width="250" height="6" />
      <rect x="0" y="32" rx="3" ry="3" width="50" height="6" />
    </content-loader>
  </div>
</template>

<script>
import { ContentLoader } from "vue-content-loader";
export default {
  name: "TheLoader",
  components: { ContentLoader },
};
</script>

<style lang="scss" scoped>
.loader {
  height: 105px;
  border-radius: 10px;
  background-color: #fff;
  padding: 20px 35px 20px 20px;
  margin-bottom: 10px;
  overflow: hidden;
}
</style>

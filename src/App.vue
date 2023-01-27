<template>
  <div id="app" :class="{ 'on-board': onBoard }" :style="appStyle">
    <router-view />
  </div>
</template>
 
<script>

export default {
  data() {
    return {
      onBoard: false
    };
  },
  async created() {
    try {
      await this.$store.dispatch({ type: "setUser" });
      await this.$store.dispatch({ type: "loadUsers" });
    } catch (err) {
      console.log("err", err);
    }

    window.fbAsyncInit = function() {
      window.FB.init({
        appId: "668161277923698",
        xfbml: true,
        version: "v2.7"
      });
      window.FB.AppEvents.logPageView();
    };

    (function(d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  },
  watch: {
    "$route.params.boardId": {
      async handler() {
        const { boardId } = this.$route.params;
        if (boardId) {
          try {
            await this.$store.dispatch({ type: "loadBoard", boardId });
            this.onBoard = true;
          } catch (err) {
            console.log("problem with getting board", err);
          }
        } else {
          try {
            await this.$store.dispatch({ type: "loadBoard", boardId: "" });
            this.onBoard = false;
          } catch (err) {
            console.log("problem with getting board", err);
          }
        }
      },
      immediate: true
    }
  },
  methods: {},
  computed: {
    board() {
      var board = this.$store.getters.board;
      return board;
    },
    appStyle() {
      if (!this.board || !this.board.style) return;
      if (this.board.style.imgUrl)
        return {
          backgroundImage: `url("${this.board.style.imgUrl}")`
        };
      return {
        backgroundColor: this.board.style.bgColor
      };
    }
  },
  components: {}
};
</script>

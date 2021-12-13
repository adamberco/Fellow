<template>
  <section class="home-page" v-if="boards">
    <app-header class="blue-header"  @addBoard="onAddBoard=true"/>
    <section class="home">
      <div class="menu">
        <nav>
          <div class="top-menu">
            <button class="action-btn">
              <span class="icon-wrapper">
                <span class="icon-sm icon-board"></span>
              </span>
              <span class="text">Boards</span>
            </button>
            <button class="action-btn">
              <span class="icon-wrapper">
                <span class="icon-sm icon-template-board"></span>
              </span>
              <span class="text">Templates</span>
            </button>
            <button class="action-btn">
              <span class="icon-wrapper">
                <span class="icon-sm icon-home"></span>
              </span>
              <span class="text">Home</span>
            </button>
          </div>
          <div class="bottom-menu">
            <div class="workspaces action-btn">
              <div class="add">
                <span class="text">Workspaces</span>
                <span class="icon-wrapper">
                  <span class="icon-sm icon-plus"></span>
                </span>
              </div>
            </div>
            <div class="fellow">
              <div class="action-btn">
                <div>
                  <span class="F-wrapper">
                    <span class="F">F</span>
                    <span>Fellow Workspaces</span>
                  </span>
                </div>
                <span class="arrow icon-wrapper">
                  <span class="fas fa-chevron-down"></span>
                </span>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <div class="boards">
        <div class="workspaces">
          <div class="main">
            <div class="nav">
              <span class="header-wrapper">
                <span class="icon-lg icon-member"></span>
                <span class="header">Boards</span>
              </span>
            </div>
            <ul class="workspaces-boards">
              <li
                v-for="board in boards"
                :key="board._id"
                :style="bgImage(board)"
                @click="setBoard(board._id)"
              >
                <span>{{ board.title }}</span>
              </li>
              <div class="add" @click.stop="onAddBoard = true">
                <div>Create new board</div>
                <div>{{ 10 - boards.length }} remaining</div>
              </div>
            </ul>
            <add-board v-show="onAddBoard" @close="onAddBoard=false" :onAddBoard="onAddBoard" />
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import appHeader from "@/cmps/app-header.cmp.vue";
import addBoard from "@/cmps/add-board.cmp.vue";
import { focus } from "vue-focus";

export default {
  directives: { focus },

  name: "Home",
  data() {
    return {
      user: null,
      onAddBoard: false,
      emptyTitle: true
    };
  },
  async created() {
    // get userId
    await this.$store.dispatch({ type: "loadBoards" });
    // const filterBy = {user: this.$store.getters.user}
    // await this.$store.dispatch({ type: 'loadBoards' , filterBy});
  },
  computed: {
    boards() {
      var boards = this.$store.getters.boards;
      return boards;
    }
  },
  methods: {
    bgImage(board) {
      if (!board) return;
      if (!board.style.imgUrl)
        return {
          backgroundColor: board.style.bgColor
        };
      // console.log('board', board);
      if (board.style.imgUrl.includes("http")) {
        return {
          backgroundImage: `url("${board.style.imgUrl}")`
        };
      }
    },
      async setBoard(boardId) {
      try {
        await this.$store.dispatch({ type: "loadBoard", boardId });
        this.$router.push("/b/" + boardId);
      } catch (err) {
        console.log("cant get board" + boardId, err);
      }
    }
  },
  components: {
    appHeader,
    addBoard
  }
};
</script>

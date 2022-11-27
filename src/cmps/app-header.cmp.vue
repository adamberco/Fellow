<template>
  <header class="main-header">
    <div class="left-container">
      <router-link
        class="logo"
        :to="$route.path !== '/home' ? '/home' : ''"
        aria-label="Back to home"
      >
        <span>
          <logo />
        </span>
        Fellow
      </router-link>
      <!-- <button>Workspaces <i class="fas fa-chevron-down"></i></button> -->
      <!-- <button>Recent <i class="fas fa-chevron-down"></i></button> -->
      <!-- <button>Starred <i class="fas fa-chevron-down"></i></button> -->
      <!-- <button>Templates <i class="fas fa-chevron-down"></i></button> -->
      <button @click="onAddBoard">Create</button>
    </div>
    <div class="container">
      <div class="input-container">
        <i class="fas fa-search search-icon"></i>
        <input
          autocomplete="off"
          autocorrect="off"
          spellcheck="false"
          type="search"
          placeholder="Search..."
          @input="checkInput"
          v-model="searchInput"
        />
      </div>
      <div class="search-modal" v-show="openSearch">
        <div class="search-header">Boards</div>
        <router-link
          :to="{ name: 'board', params: { boardId: board._id } }"
          class="search-item"
          v-for="board in searchedBoards"
          :key="board._id"
        >
          <!-- <div class="search-item" v-for="board in boards" :key="board._id"> -->
          <span class="bgc-item" :style="styleToShow(board)"></span
          ><span class="item-title">{{ board.title }}</span>
        </router-link>
      </div>

      <button class="header-bell" :class="notify" @click="toggleNotification">
        <span>
          <svg width="24" height="32" focusable="false" viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 2C11.4477 2 11 2.44772 11 3V3.078C10.2728 3.19668 9.65318 3.44603 9.1328 3.79295C8.39456 4.28511 7.91489 4.93416 7.60557 5.55279C7.29822 6.1675 7.14952 6.77011 7.07611 7.2106C7.039 7.43322 7.02007 7.62092 7.01035 7.75688C7.00549 7.82503 7.0029 7.88067 7.00153 7.92176C7.00085 7.94232 7.00046 7.95929 7.00025 7.9724L7.00005 7.98916L7.00001 7.99533L7 7.99786L7 7.99898C7 7.9995 7 8 8 8H7V11.723L4.14251 16.4855C3.95715 16.7944 3.95229 17.1792 4.1298 17.4927C4.30731 17.8062 4.63973 18 5 18H19C19.3603 18 19.6927 17.8062 19.8702 17.4927C20.0477 17.1792 20.0429 16.7944 19.8575 16.4855L17 11.723V8H16C17 8 17 7.9995 17 7.99898L17 7.99786L17 7.99533L17 7.98916L16.9997 7.9724C16.9995 7.95929 16.9992 7.94232 16.9985 7.92176C16.9971 7.88067 16.9945 7.82503 16.9896 7.75688C16.9799 7.62092 16.961 7.43322 16.9239 7.2106C16.8505 6.77011 16.7018 6.1675 16.3944 5.55279C16.0851 4.93416 15.6054 4.28511 14.8672 3.79295C14.3468 3.44603 13.7272 3.19668 13 3.078V3C13 2.44772 12.5523 2 12 2ZM9.00042 7.98839L9 8.00435V12C9 12.1812 8.95074 12.3591 8.85749 12.5145L6.76619 16H17.2338L15.1425 12.5145C15.0493 12.3591 15 12.1812 15 12V8.00436L14.9996 7.98839C14.999 7.97089 14.9977 7.9406 14.9947 7.89937C14.9888 7.81658 14.9765 7.69178 14.9511 7.5394C14.8995 7.22989 14.7982 6.8325 14.6056 6.44721C14.4149 6.06584 14.1446 5.71489 13.7578 5.45705C13.3773 5.20338 12.825 5 12 5C11.175 5 10.6227 5.20338 10.2422 5.45705C9.85544 5.71489 9.58511 6.06584 9.39443 6.44721C9.20178 6.8325 9.10048 7.22989 9.04889 7.5394C9.0235 7.69178 9.01118 7.81658 9.00527 7.89937C9.00233 7.9406 9.001 7.97089 9.00042 7.98839ZM14 19C14 20.1046 13.1046 21 12 21C10.8954 21 10 20.1046 10 19H14Z"
              fill="currentColor"
            />
          </svg>
        </span>
      </button>
      <notification-popup
        @close="showNotifyPopup = false"
        :showPopup="showNotifyPopup"
        :activities="$store.getters.getActivities"
      />
      <div
        class="user-section"
        @click="showUserPopup = !showUserPopup"
        v-if="user"
      >
        <avatar
          :username="user.fullname"
          :size="32"
          :lighten="200"
          :src="user.imgUrl"
          :title="`${user.fullname} (${user.username})`"
        ></avatar>
        <user-popup
          v-show="showUserPopup"
          :user="user"
          @closePopup="showUserPopup = false"
        ></user-popup>
      </div>
    </div>
  </header>
</template>

<script>
import Avatar from "vue-avatar";
import logo from "../cmps/logo.cmp.vue";
import userPopup from "../cmps/user-popup.cmp.vue";
import notificationPopup from "../cmps/notification-popup.cmp.vue";
// import { focus } from "vue-focus";
import addBoard from "@/cmps/add-board.cmp.vue";

export default {
  // directives: { focus },
  data() {
    return {
      showUserPopup: false,
      showNotifyPopup: false,
      openSearch: false,
      searchInput: "",
    };
  },
  methods: {
    toggleNotification() {
      this.showNotifyPopup = !this.showNotifyPopup;
      this.$store.commit({ type: "resetNotification" });
    },
    onAddBoard() {
      this.$emit("addBoard");
    },
    checkInput(ev) {
      this.openSearch = ev.target.value ? true : false;
    },
    styleToShow(board) {
      if (!board.style) return;
      if (board.style.imgUrl)
        return {
          backgroundImage: `url("${board.style.imgUrl}")`,
        };
      return {
        backgroundColor: board.style.bgColor,
      };
    },
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    notify() {
      return this.$store.getters.getNotificationCnt > 0 ? "bell-notify" : "";
    },
    boards() {
      return this.$store.getters.boards;
    },
    searchedBoards() {
      if (!this.boards) return;
      return this.boards.filter((board) =>
        board.title.toLowerCase().includes(this.searchInput.toLowerCase())
      );
    },
  },
  components: {
    logo,
    Avatar,
    userPopup,
    notificationPopup,
    addBoard,
  },
};
</script>

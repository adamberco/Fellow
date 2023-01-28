<template>
  <section class="card-popup members-popup" v-if="cardMembers" v-click-outside="close">
    <header class="popup-header">
      <h4>Members</h4>
      <div @click="close">
        <span class="close-popup icon-md icon-close"></span>
      </div>
    </header>
    <input type="text" placeholder="Search members" />
    <form @submit.prevent>
      <h5>Board members</h5>
      <ul>
        <li
          class="item js-member-item active selected"
          v-for="member in membersToShow"
          :key="member.id"
          @click="toggleMember(member)"
        >
          <a
            class="name js-select-member member-container"
            href="#"
            :memberId="member._id"
            :title="`${member.fullname} (${member.username})`"
            :autocompletetext="member.username"
          >
            <p class="member js-member member-icon">
              <avatar :username="member.fullname" :size="32" :lighten="200" :src="member.imgUrl"></avatar>
            </p>
            <p
              class="full-name"
              :name="`${member.fullname} (${member.username})`"
            >{{ member.fullname }}</p>
            <p class="username">({{ member.username }})</p>
            <span
              class="icon-sm icon-check checked-icon"
              :style="{
                display: checkMember(member._id) ? 'block' : 'none',
              }"
            ></span>
          </a>
        </li>
      </ul>
    </form>
  </section>
</template>

<script>
import Avatar from "vue-avatar";

export default {
  props: {
    cardMembers: {
      type: Array
    }
  },
  data() {
    return {
      selectedMembers: JSON.parse(JSON.stringify(this.cardMembers)),
      allMembers: this.$store.getters.board.members
    };
  },

  methods: {
    checkMember(memberId) {
      if (!this.$store.getters.card) return;
      return this.$store.getters.card.members.find(
        member => member._id === memberId
      );
      // return this.selectedMembers.find((member) => member._id === memberId);
    },
    close() {
      this.$emit("close");
    },
    toggleMember(member) {
      if (this.checkMember(member._id)) {
        const idx = this.selectedMembers.findIndex(
          mbr => mbr._id === member._id
        );
        this.selectedMembers.splice(idx, 1);
      } else {
        this.selectedMembers.push(member);
      }
      this.$emit("update", JSON.parse(JSON.stringify(this.selectedMembers)));
    }
  },
  computed: {
    membersToShow() {
      const members = JSON.parse(JSON.stringify(this.allMembers));
      const user = this.$store.getters.user;
      const idx = members.findIndex(mbr => mbr._id === user._id);
      members.splice(idx, 1);
      members.unshift(user);
      return members;
    }
  },
  components: {
    Avatar
  }
};
</script>

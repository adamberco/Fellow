<template>
  <section
    class="card"
    ref="card"
    :class="{ 'with-cover': card.style}"
    @click="showDetails"
    v-if="card"
  >
    <div class="cover-img" v-show="card.style" :style="getCover"></div>
    <span class="card-wrapper" @click.stop.prevent>
      <span
        v-for="label in getLabels"
        :key="label.id"
        :class="[label.colorClass, setLabelClass]"
        class="open-label"
        @click.stop="onLabelClick"
        @mouseover="islabelHover = true"
        @mouseleave="islabelHover = false"
      >
        <span class="text-label">{{ label.txt }}</span>
      </span>
    </span>
    <span class="edit-wrapper">
      <span class="icon-sm icon-edit q-edit"></span>
    </span>
    <section class="card-title">
      <p :ref="card.id">{{ card.title }}</p>
    </section>
    <section class="card-icons">
      <div class="icon-wrapper" v-if="card.isWatch">
        <span class="icon-sm icon-watch badge"></span>
      </div>
      <div class="icon-wrapper date" v-if="card.dueDate" :class="dateClass" @click.stop="checkCard">
        <span class="clock icon-sm icon-clock badge"></span>
        <input id="cbp" type="checkbox" v-model="card.isComplete" />
        <label for="cbp"></label>
        <span class="icon-text">{{ dateToShow }}</span>
      </div>
      <div class="icon-wrapper" v-if="card.description">
        <span class="icon-sm icon-desc badge"></span>
      </div>
      <div class="icon-wrapper" v-if="card.attachments && card.attachments.length">
        <span class="icon-sm icon-attach badge"></span>
        <span class="icon-text">{{ card.attachments.length }}</span>
      </div>
      <div class="icon-wrapper" v-if="card.checklists && card.checklists.length && todos">
        <span class="icon-sm icon-checklist badge"></span>
        <span class="icon-text">{{ doneTodos }}/{{ todos }}</span>
      </div>
    </section>
    <div v-show="card.members.length" class="card-members-preview">
      <avatar
        v-for="member in card.members"
        :key="member._id"
        :username="member.fullname || member.username"
        :size="28"
        :lighten="200"
        :src="member.imgUrl"
        class="member-avatar"
      ></avatar>
    </div>
  </section>
</template>

<script>
import { focus } from "vue-focus";
import Avatar from "vue-avatar";
import { Container, Draggable } from "vue-smooth-dnd";
import { utilService } from "../services/util.service.js";

export default {
  directives: { focus },
  props: {
    card: {
      type: Object
    },
    list: {
      type: Object
    },
    labelsState: {
      type: Boolean
    }
  },
  data() {
    return {
      islabelHover: false,
      pos: null,
      cardToEdit: {
        title: ""
      },
      doIconsOverflow: false
    };
  },
  methods: {
    showDetails() {
      this.$router.push(this.$route.path + "/c/" + this.card.id);
    },
    formatDate(dueDate) {
      var date = dueDate.getDate();
      var month = `${dueDate}`.substring(4, 7);
      const strDate = `${month} ${date}`;
      return strDate;
    },
    async checkCard() {
      this.card.isComplete = !this.card.isComplete;
      const activityText = this.card.isComplete
        ? `marked the due date complete on `
        : `marked the due date not complete on`;
      console.log("activityText", activityText);
      const activity = {
        id: "act" + utilService.makeId(),
        txt: activityText,
        createdAt: Date.now(),
        byMember: {
          imgUrl: this.user.imgUrl ? this.user.imgUrl : "",
          fullname: this.user.fullname,
          _id: this.user._id
        },
        listTitle: this.list.title,
        card: {
          id: this.card.id,
          title: this.card.title
        }
      };
      try {
        await this.$store.dispatch({
          type: "updateCard",
          boardId: this.boardId,
          list: JSON.parse(JSON.stringify(this.list)),
          card: JSON.parse(JSON.stringify(this.card)),
          activity
        });
      } catch (err) {
        console.log("cant update card", err);
      }
    },
    onLabelClick() {
      this.$store.commit({
        type: "toggleLabel",
        labelsState: this.labelsState
      });
    }
  },
  computed: {
    todos() {
      var todos = 0;
      if (this.card.checklists && this.card.checklists.length) {
        this.card.checklists.forEach(checklist => {
          if (checklist.todos && checklist.todos.length) {
            checklist.todos.forEach(todo => {
              todos++;
            });
          }
        });
      }
      return todos;
    },
    user() {
      console.log(this.$store.getters.user);
      return this.$store.getters.user;
    },
    dateClass() {
      if (!this.card.dueDate) return;
      if (this.card.isComplete) return "done";
      if (+new Date(this.card.dueDate) - Date.now() > 86400000) return;
      return +new Date(this.card.dueDate) - Date.now() <= 0
        ? "over-due"
        : "soon";
    },
    doneTodos() {
      var doneTodos = 0;
      if (this.card.checklists && this.card.checklists.length) {
        this.card.checklists.forEach(checklist => {
          if (checklist.todos && checklist.todos.length) {
            checklist.todos.forEach(todo => {
              if (todo.isDone) doneTodos++;
            });
          }
        });
      }
      return doneTodos;
    },
    getLabels() {
      const allLabels = this.$store.getters.labels;
      const labelIds = this.card.labelIds;
      return labelIds.map(
        lId => allLabels.find(label => label.id === lId) || false
      );
    },
    setLabelClass() {
      let classes = `preview-label${this.labelsState ? "" : "-close"}`;
      return classes;
    },

    dateToShow() {
      const dueDate = new Date(this.card.dueDate);
      if (new Date().getYear() === new Date(this.card.dueDate).getYear()) {
        return this.formatDate(dueDate);
      }

      return this.formatDate(dueDate) + ", " + dueDate.getFullYear();
    },
    ChecklistNum() {
      var doneTodos = 0;
      this.card.checklists.forEach(checklist => {
        checklist.todos.forEach(todo => {
          if (todo.isDone) doneTodos++;
          else undoneTodos++;
        });
      });
      return `${undoneTodos}/${doneTodos}`;
    },
    getCover() {
      if (!this.card.style) return;
      const backgroundColor = this.card.style.bgColor;
      if (!this.card.style.img) {
        return {
          backgroundColor,
          height: "32px",
          minHeight: "32px"
        };
      }
      return {
        height: "163.58px",
        backgroundColor,
        backgroundImage: `url("${this.card.style.img}")`
      };
    },
    boardId() {
      return this.$store.getters.boardId;
    }
  },

  components: { Avatar, Container, Draggable }
};

// TEMPLATE
// <button v-show="isQuick" @click.stop="isQuick = false">close</button>
//  <section class="edit-title" v-if="isQuick">
//       <textarea
//         v-focus="isQuick"
//         @focus="$event.target.select()"
//         ref="text"
//         :style="{ height: height }"
//         @input="checkHeight"
//         v-model="cardToEdit.title"
//       ></textarea>
//       </section>

// METHODS
// checkHeight() {
//   if (!this.isQuick || !this.$refs.text) console.log('N');
//   // console.log("text", this.$refs.text.scrollHeight);
//   this.height = this.$refs.text.scrollHeight + 'px';
// },
// openQuick(ev) {
//   // console.log(ev);
//   this.pos = {
//     x: ev.clientX,
//     y: ev.clientY,
//   };
//   this.cardToEdit = JSON.parse(JSON.stringify(this.card));
//   this.isQuick = true;
// },
// getShouldAcceptDrop(index, src, payload) {
//   // console.log("index", index);
//   // console.log("src", src);
//   // console.log("payload", payload);
// },
// getChildPayload(detachList) {
//   // console.log((index) => detachList.members[index]);
//   // return (index) => detachList.cards[index];
// },
// onMemberDrop(targetList, dropResult) {
//   const { addedIndex, removedIndex, payload } = dropResult;
//   console.log(dropResult, targetList);
// },
</script>




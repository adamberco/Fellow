<template>
  <div v-if="list && cardToEdit" class="card-details-container" @click.stop.prevent="closeModal">
    <div class="card-details" @click.stop>
      <button @click.stop="closeModal" class="close">
        <span class="icon-md icon-close"></span>
      </button>

      <!-- card cover -->
      <div v-if="cardToEdit.style" class="cover-wrapper" :style="coverStyle">
        <section class="cover-menu-header">
          <button
            @click.stop="showCoverMenu = !showCoverMenu"
            class="cover-menu-btn"
            :class="{
              'light-btn': cardToEdit.style.isDark,
              'dark-btn': !cardToEdit.style.isDark,
            }"
          >
            <span :style="{ color: textColor }" class="icon-sm icon-cover"></span>
            Cover
          </button>
          <cover
            class="top-cover"
            v-if="showCoverMenu"
            @toggleCover="toggleCover"
            :card="cardToEdit"
            @closeCover="showCoverMenu = false"
          ></cover>
            <!-- @removeCover="toggleCover" -->
        </section>
      </div>

      <!-- card header -->
      <header>
        <div class="header">
          <span class="icon-card icon-lg"></span>
          <div class="card-header-container">
            <textarea
              rows
              contenteditable="true"
              @blur="updateCard"
              v-model="cardToEdit.title"
              @keydown.enter.prevent="updateCard"
            />
            <h5>
              in list
              <span>{{ list.title }}</span>
            </h5>
            <span v-show="card.isWatch" class="icon-sm icon-watch"></span>
          </div>
        </div>
      </header>

      <!-- card body -->
      <div class="card-body">
        <!-- card  main-body -->
        <div class="main-details">
          <div class="icon-header">
            <div class="detail-labels">
              <!-- card  members icons -->
              <div class="card-members card-labels" v-show="cardToEdit.members.length > 0">
                <h4>Members</h4>
                <span class="label-wrapper" @click="showMembers = !showMembers">
                  <avatar
                    v-for="member in cardToEdit.members"
                    :key="member.id"
                    :username="member.fullname"
                    :size="32"
                    :lighten="200"
                    :src="member.imgUrl"
                    class="member-avatar"
                  ></avatar>
                  <button v-show="cardToEdit.members.length > 0" class="action-btn round">
                    <span class="icon-sm icon-plus"></span>
                  </button>
                </span>
              </div>

              <!-- card  labels icons -->
              <div class="card-labels" v-show="getLabels.length > 0">
                <h4>Labels</h4>
                <span class="label-wrapper" @click="showLabels = !showLabels">
                  <button
                    v-for="label in getLabels"
                    :key="label.id"
                    :class="label.colorClass"
                    class="label-tag white-text"
                  >{{ label.txt }}</button>
                  <button v-show="getLabels.length > 0" class="action-btn">
                    <span class="icon-sm icon-plus"></span>
                  </button>
                </span>
              </div>

              <!-- card  date icons -->
              <div class="due-date" v-show="cardToEdit.dueDate">
                <h3>Due date</h3>
                <div class="due-date-body">
                  <input
                    id="cb"
                    type="checkbox"
                    v-model="cardToEdit.isComplete"
                    @change="updateDueDate"
                  />
                  <label for="cb"></label>
                  <div class="relative-date">
                    <date
                      @updateDate="updateDate"
                      :cardDate="cardToEdit.dueDate"
                      :cardToEdit="cardToEdit"
                      class="date"
                      :datePlaceholder="dateToShow"
                    ></date>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- card description -->
          <div class="description">
            <span class="card-details-icon icon-lg"></span>
            <div>
              <div class="content">
                <h3>Description</h3>
                <button
                  v-show="cardToEdit.description && !isEditDesc"
                  @click.stop="setFocus"
                  class="action-btn"
                >Edit</button>
              </div>
            </div>
            <form @submit.prevent="updateDesc">
              <div
                contenteditable="true"
                ref="desc"
                class="desc action-btn"
                @focus="setEditDesc"
                placeholder="Add a more detailed description..."
              ></div>
              <div class="buttons" v-show="isEditDesc">
                <button class="submit-btn" @click.stop.prevent="updateDesc">Save</button>
                <span @click.stop="undoDesc" class="icon-lg icon-close"></span>
              </div>
            </form>
          </div>

          <!-- card attachments -->
          <div class="attachments" v-show="cardToEdit.attachments && cardToEdit.attachments.length">
            <section class="attach-header">
              <span class="icon-attach icon-lg"></span>
              <h3>Attachments</h3>
            </section>

            <div v-for="attachment in cardToEdit.attachments" :key="attachment.id">
              <attachment
                :attachment="attachment"
                @toggleCover="toggleCover"
                @deleteAttach="deleteAttach"
                @openEdit="openEdit"
                :cardToEdit="cardToEdit"
              ></attachment>
            </div>
            <section class="card-popup" v-show="openEditAttach">
              <section class="popup-header">
                <div>
                  <span @click.stop="openEditAttach = false" class="close-popup icon-md icon-close"></span>
                </div>
                <h4>Edit</h4>
              </section>
              <form @submit.stop.prevent="updateAttach">
                <label>Link name</label>
                <input @focus="$event.target.select()" type="text" v-model="attachToEdit.name" />
                <button class="submit">Update</button>
              </form>
            </section>
          </div>

          <!-- card checklists -->
          <div class="check-list" v-for="checklist in cardToEdit.checklists" :key="checklist.id">
            <span class="card-details-icon icon-lg"></span>

            <checklist :checklist="checklist" @updateCL="updateCL" />
          </div>

          <!-- card activities -->
          <div class="activity-log">
            <span class="icon-lg icon-activity"></span>
            <section class="activity-header">
              <h3>Activity</h3>
              <button
                class="action-btn"
                @click="showActivities = !showActivities"
              >{{ showActivities ? "Hide details" : "Show details" }}</button>
            </section>
            <div class="comment-box" @click="isComment = true">
              <button class="submit-btn">save</button>
              <div class="log" v-show="showActivities">
                <div
                  class="activity-item"
                  v-for="(activity,idx) in activitiesToShow"
                  :key="activity.id"
                >
                  <activity-item :activity="activity" :idx="idx" :inCard="true" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- card  side-menu-->
        <div class="side-menu">
          <!-- members + join btn -->
          <button
            class="action-btn"
            title="Join to this card"
            @click="joinCard"
            v-show="!checkJoined"
          >
            <span class="icon-sm icon-member"></span>Join
          </button>
          <h3>Add to card</h3>
          <!-- side menu renders cmp in click -->
          <section class="btn-group">
            <section class="relative-btn">
              <button class="action-btn" title="Members" @click.stop="showMembers = !showMembers">
                <span class="icon-sm icon-member"></span>Members
              </button>

              <section class="relative-btn">
                <card-members
                  v-if="showMembers"
                  @close="showMembers = !showMembers"
                  :cardMembers="cardToEdit.members"
                  @update="updateMembers"
                />
              </section>
            </section>

            <!-- labels btn -->
            <section class="relative-btn">
              <button @click.stop="toggleLabels" class="action-btn">
                <p>
                  <span class="icon-sm icon-label"></span>Labels
                </p>
              </button>
            </section>
            <card-labels
              v-if="showLabels"
              @close="toggleLabels"
              :cardLabels="cardToEdit.labelIds"
              @update="updateLabels"
            />

            <!-- checklist btn -->
            <section class="relative-btn">
              <button @click.stop="openCheckList = !openCheckList">
                <span class="action-btn">
                  <span class="icon-sm icon-checklist"></span>
                  <span>Checklist</span>
                </span>
              </button>
              <section
                class="card-popup checklist-popup"
                v-if="openCheckList"
                v-click-outside="closeChecklist"
              >
                <section class="popup-header">
                  <div @click.stop="closeChecklist">
                    <span class="close-popup icon-md icon-close"></span>
                  </div>
                  <h4>Add checklist</h4>
                </section>
                <form @submit.prevent="addCheckList">
                  <label>Title</label>
                  <input
                    @focus="$event.target.select()"
                    type="text"
                    value="Checklist"
                    v-model="newChecklist.title"
                  />
                  <label>Copy items from...</label>
                  <select name id class="not-yet">
                    <option value>(none)</option>
                  </select>
                  <button class="submit">Add</button>
                </form>
              </section>
            </section>

            <!-- dates btn -->
            <date
              @updateDate="updateDate"
              :cardDate="cardToEdit.dueDate"
              class="date"
              :datePlaceholder="'Dates'"
            ></date>

            <!-- attachment btn -->
            <section class="relative-btn">
              <button @click.stop="openAddAttach = !openAddAttach">
                <span class="action-btn">
                  <span class="icon-sm icon-attach"></span>Attachments
                </span>
              </button>
              <!-- v-click-outside="openAddAttach = false" -->
              <add-attachment
                @addNewAttach="addNewAttach"
                @close="openAddAttach = false"
                v-if="openAddAttach"
              ></add-attachment>
            </section>

            <!-- cover btn -->
            <section v-show="!card.style" class="relative-btn cover-menu-header">
              <button
                @click.stop="showCoverMenu = !showCoverMenu"
                class="cover-menu-btn action-btn"
              >
                <span class="icon-sm icon-cover"></span>Cover
              </button>
              <cover
                v-if="showCoverMenu"
                @toggleCover="toggleCover"
                :card="cardToEdit"
                @closeCover="showCoverMenu = false"
              ></cover>
            </section>
          </section>

          <!-- actions btn -->
          <section class="actions">
            <h3>Actions</h3>
            <button class="cover action-btn not-yet" title="Not yet developed">
              <span class="icon-sm icon-move"></span>Move
            </button>
            <button class="cover action-btn not-yet" title="Not yet developed">
              <span class="icon-sm icon-copy"></span>Copy
            </button>
            <button class="cover action-btn not-yet" title="Not yet developed">
              <span class="icon-sm icon-template"></span>Make template
            </button>
            <button class="cover action-btn not-yet" title="Not yet developed">
              <span class="icon-sm icon-watch"></span>Watch
            </button>
            <hr />
            <button class="cover action-btn" @click="removeCard">
              <span class="icon-sm icon-archive"></span>Archive
            </button>
            <button class="cover action-btn not-yet" title="Not yet developed">
              <span class="icon-sm icon-share"></span>Share
            </button>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cardLabels from "../cmps/labels.cmp.vue";
import cardMembers from "../cmps/members.cmp.vue";
import date from "../cmps/date.cmp.vue";
import addAttachment from "../cmps/add-attachment.cmp.vue";
import attachment from "../cmps/attachment.cmp.vue";
import cover from "../cmps/cover.cmp.vue";
import activityItem from "../cmps/activity-item.cmp.vue";
import Avatar from "vue-avatar";
import { utilService } from "../services/util.service.js";
import checklist from "../cmps/checklist.cmp.vue";

export default {
  data() {
    return {
      lastCardDesc: null,
      isEditDesc: false,
      showDate: false,
      showLabels: false,
      showMembers: false,
      openCheckList: false,
      newChecklist: { title: "Checklist" },
      cardToEdit: null,
      isUndoDesc: false,
      isComment: false,
      openAddAttach: false,
      openEditAttach: false,
      showCoverMenu: false,
      showActivities: false,
      attachToEdit: {
        name: ""
      }
    };
  },
  created() {
    this.cardToEdit = this.card;
  },
  mounted() {
    this.$refs.desc.innerText = this.cardToEdit.description
      ? this.cardToEdit.description
      : "";
  },
  computed: {
    card() {
      return this.$store.getters.card;
    },
    list() {
      return this.$store.getters.list;
    },
    boardId() {
      return this.$store.getters.boardId;
    },
    boardActivities() {
      return this.$store.getters.board.activities;
    },
    activitiesToShow() {
      let activities = [];
      if (this.boardActivities && this.boardActivities.length) {
        activities = this.boardActivities.filter(
          act => act.card && act.card.id === this.card.id
        );
      }
      return activities;
    },
    coverStyle() {
      if (!this.cardToEdit.style) return;
      const backgroundColor = this.cardToEdit.style.bgColor;
      if (this.cardToEdit.style.img) {
        return {
          backgroundImage: `url("${this.cardToEdit.style.img}")`,
          backgroundColor
        };
      }
      return {
        backgroundColor,
        height: "116px",
        minHeight: "116px"
      };
    },
    dateToShow() {
      const dateString = this.cardToEdit.dueDate;
      const dueDate = new Date(dateString);
      const time = this.formatAMPM(dueDate);
      if (new Date().getDate() === new Date(dateString).getDate())
        return "today" + time;
      else if (new Date().getDate() + 1 === new Date(dateString).getDate())
        return "tomorrow" + time;
      else if (new Date().getDate() - 1 === new Date(dateString).getDate())
        return "yesterday" + time;
      else if (new Date().getYear() === new Date(dateString).getYear()) {
        return this.formatDate(dueDate) + time;
      }
      return this.formatDate(dueDate) + ", " + dueDate.getFullYear() + time;
    },
    getLabels() {
      const allLabels = this.$store.getters.labels;
      const labelIds = this.card.labelIds;
      const labels = labelIds.map(lId =>
        allLabels.find(label => label.id === lId)
      );
      return labels.filter(label => label); //filter invalid labels
    },
    bgColor() {
      return this.cardToEdit.style.isDark ? "#ffffff3d" : "#00000014";
    },
    textColor() {
      return this.cardToEdit.style.isDark ? "#fff" : "#172b4d";
    },
    checkJoined() {
      const user = this.$store.getters.user;
      return this.cardToEdit.members.find(u => u._id === user._id);
    }
  },
  methods: {
    async toggleCover(style = null) {
      this.cardToEdit.style = style;
      try {
        const activityText = style ? "made cover to " : "removed cover from ";
        await this.updateCard(activityText);
        this.showCoverMenu = style ? true : false;
      } catch (err) {
        console.log("cant toggle cover", err);
      }
    },
    closeChecklist(){
      this.openCheckList = false
    },
    async updateAttach() {
      const idx = this.cardToEdit.attachments.findIndex(
        currAttach => currAttach.id === this.attachToEdit.id
      );
      this.cardToEdit.attachments.splice(idx, 1, this.attachToEdit);
      try {
        const activityText = `updated ${this.attachToEdit.name ||
          this.attachToEdit.file ||
          this.attachToEdit.url} attachment of `;
        console.log("activityText", activityText);
        await this.updateCard(activityText);
        this.openEditAttach = false;
        this.attachToEdit = {
          name: ""
        };
        console.log(this.card);
      } catch (err) {
        console.log("cant update attachment", err);
      }
    },
    openEdit(attach) {
      this.attachToEdit = JSON.parse(JSON.stringify(attach));
      this.openEditAttach = true;
    },
    deleteAttach(attach) {
      const idx = this.cardToEdit.attachments.findIndex(
        attachment => attachment.id === attach.id
      );
      this.cardToEdit.attachments.splice(idx, 1);
      const activityText = `deleted ${attach.name ||
        attach.file ||
        attach.href} attachment from `;
      console.log("activityText", activityText);
      this.updateCard(activityText);
    },
    updateDesc() {
      this.cardToEdit.description = this.$refs.desc.innerText;
      const activityText = "updated description to ";
      console.log("activityText", activityText);
      this.updateCard(activityText);
    },
    formatAMPM(dueDate) {
      var hours = dueDate.getHours();
      var minutes = dueDate.getMinutes();
      var ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = +(minutes + "").padStart(2, "0");
      var strTime = " at " + hours + ":" + minutes + " " + ampm;
      return strTime;
    },
    formatDate(dueDate) {
      var date = dueDate.getDate();
      var month = `${dueDate}`.substring(4, 7);
      const strDate = `${month} ${date}`;
      return strDate;
    },
    closeModal() {
      const { boardId } = this.$route.params;
      this.$router.push("/b/" + boardId);
    },
    async addNewAttach(newAttach) {
      this.openAddAttach = false;
      newAttach.id = "A" + utilService.makeId();
      this.cardToEdit.attachments.push(newAttach);
      try {
        const activityText = `added ${newAttach.name ||
          newAttach.file ||
          newAttach.href} attachment to `;
        console.log("activityText", activityText);
        await this.updateCard(activityText);
      } catch (err) {
        console.log("can't update card", err);
      }
    },
    updateDueDate() {
      const activityText = `updated due date to `;
      this.updateCard(activityText);
    },
    async updateCard(activityText) {
      this.isEditDesc = false;
      const user = this.$store.getters.user;
      const activity = {
        id: "act" + utilService.makeId(),
        txt: activityText,
        createdAt: Date.now(),
        byMember: {
          imgUrl: user.imgUrl ? user.imgUrl : "",
          fullname: user.fullname,
          _id: user._id
        },
        card: {
          id: this.cardToEdit.id,
          title: this.cardToEdit.title
        },
        listTitle: this.list.title
      };
      try {
        await this.$store.dispatch({
          type: "updateCard",
          boardId: this.boardId,
          list: JSON.parse(JSON.stringify(this.list)),
          card: JSON.parse(JSON.stringify(this.cardToEdit)),
          activity
        });
      } catch (err) {
        console.log("cant update card", err);
      }
    },
    async removeCard() {
      try {
        await this.$store.dispatch({
          type: "removeCard",
          boardId: this.boardId,
          list: JSON.parse(JSON.stringify(this.list)),
          cardId: JSON.parse(JSON.stringify(this.cardToEdit.id))
        });
        this.closeModal();
      } catch (err) {
        console.log("cant remove card", err);
      }
    },
    setEditDesc() {
      this.lastCardDesc = this.cardToEdit.description;
      this.isEditDesc = true;
    },
    async undoDesc() {
      this.cardToEdit.description = this.lastCardDesc;
      this.isEditDesc = false;
    },
    setFocus() {
      this.isEditDesc = true;
      this.$refs.desc.focus();
    },
    async updateDate(date) {
      this.cardToEdit.dueDate = date;
      const activityText = `updated due date to `;
      console.log("activityText", activityText);
      await this.updateCard(activityText);
    },

    async addCheckList(ev) {
      if (!ev.target[0].value) return;
      this.newChecklist.id = "CL" + utilService.makeId();
      this.cardToEdit.checklists.push(this.newChecklist);
      this.openCheckList = false;
      try {
        const activityText = `added checklist to `;
        console.log("activityText", activityText);
        await this.updateCard(activityText);
        this.newChecklist = { title: "Checklist" };
      } catch (err) {
        console.log("can't update card", err);
      }
    },
    async updateCL(checklist) {
      const idx = this.cardToEdit.checklists.findIndex(
        cl => cl.id === checklist.id
      );
      if (checklist.title) this.cardToEdit.checklists.splice(idx, 1, checklist);
      else this.cardToEdit.checklists.splice(idx, 1);
      try {
        const activityText = `updated checklist of `;
        console.log("activityText", activityText);
        await this.updateCard(activityText);
      } catch (err) {
        console.log("cant save the todo", err);
      }
    },
    async updateLabels(labelIds) {
      this.cardToEdit.labelIds = labelIds;
      const activityText = `updated labels of `;
      console.log("activityText", activityText);
      await this.updateCard(activityText);
    },
    async updateMembers(members) {
      this.cardToEdit.members = members;
      const activityText = `updated members of `;
      await this.updateCard(activityText);
    },
    toggleLabels() {
      this.showLabels = !this.showLabels;
    },
    joinCard() {
      const user = this.$store.getters.user;
      if (this.checkJoined) return;
      this.cardToEdit.members.push(user);
      const activityText = `joined as member to `;
      console.log("activityText", activityText);
      this.updateCard(activityText);
    }
  },
  components: {
    checklist,
    date,
    cardLabels,
    addAttachment,
    attachment,
    cover,
    cardMembers,
    Avatar,
    activityItem
  }
};
</script>

<style></style>

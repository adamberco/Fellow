<template>
  <li class="list">
    <header>
      <h4 v-if="!editTitle" @click="editTitle = true" class="drag-handle">
        {{ showTitle }}
      </h4>
      <textarea
        v-else
        v-model="updatedList.title"
        v-focus="editTitle"
        @focus="$event.target.select()"
        placeholder="Enter title"
        @blur="updateList()"
        @keydown.enter="updateList()"
      />
      <!-- <button @click="deleteList"> -->
      <button @click="listMenu = !listMenu">
        <span class="icon-sm icon-dots"> </span>
      </button>
      <section class="card-popup list-popup" v-if="listMenu" @click.stop="" >
        <section class="popup-header">
          <div @click.stop="listMenu = false">
            <span class="close-popup icon-md icon-close"></span>
          </div>
          <h4>List action</h4>
        </section>
        <span class="action" @click="deleteList">Delete this list</span>
      </section>
    </header>
    <Container
      :tag="'ul'"
      class="card-list"
      :class="emptyList"
      group-name="cardList"
      drag-class="card-ghost"
      drop-class="card-ghost-drop"
      :drop-placeholder="{ className: 'ghost' }"
      @drop="(e) => onCardDrop(list, e)"
      :get-child-payload="getChildPayload(JSON.parse(JSON.stringify(list)))"
    >
      <Draggable v-for="card in updatedList.cards" :key="card.id" :tag="'li'">
        <card-list @change="updatedList" :card="card" :list="list"></card-list>
      </Draggable>
    </Container>

    <footer class="add-card">
      <!-- @click="addCard" -->
      <button class="add-card" @click="isAddCard = true" v-if="!isAddCard">
        <span class="icon-sm icon-plus"></span>
        <p>Add a card</p>
      </button>
      <div v-else class="add-card-actions">
        <input
          type="text"
          v-focus="isAddCard"
          v-model="newCardTitle"
          @blur="addCard"
          @keydown.enter="addCard"
        />
        <div class="add-card-btns">
          <div class="submit-btns">
            <button class="submit-btn submit-card" @click="addCard">
              Add Card
            </button>
            <button>
              <span
                id="close"
                name="close"
                @click.stop.prevent="closeAddCard"
                class="icon-close icon-lg close-add-btn"
              ></span>
            </button>
          </div>
          <button class="dots">
            <span class="icon-dots icon-lg"></span>
          </button>
        </div>
      </div>
    </footer>
  </li>
</template>

<script>
import cardList from "./card-list.cmp.vue";
import { focus } from "vue-focus";
import { Container, Draggable } from "vue-smooth-dnd";

// props- list
export default {
  directives: { focus },
  props: {
    list: {
      type: Object,
    },
  },
  data() {
    return {
      dragCard: false,
      updatedList: null,
      editTitle: false,
      isAddCard: false,
      newCardTitle: "",
      listMenu: false,
    };
  },
  created() {
    this.updatedList = JSON.parse(JSON.stringify(this.list));
  },
  methods: {
    handleBlur(e) {
      // console.log(e);
      if (!this.isAddCard) return;
      else this.addCard();
      // function(e) {
      // const name = e.target;
      // console.log(name);
      // }
    },
    async addCard(e) {
      // console.log("e", e);
      // if (!this.isAddCard) return
      // console.log("adding card");
      // const title = prompt('card title');
      const title = this.newCardTitle;
      if (!title) {
        this.isAddCard = false;
        return;
      }
      try {
        this.newCardTitle = "";
        await this.$store.dispatch({
          type: "addCard",
          board: this.$store.getters.board,
          list: this.list,
          title,
        });
        // this.isAddCard = false;
      } catch (err) {
        console.log("cant add card", err);
      }
    },
    closeAddCard(event) {
      this.newCardTitle = "";
      this.isAddCard = false;
      event.target.blur();
      // console.log("end of close");
    },
    updateList() {
      this.editTitle = false;
      this.$emit("update", JSON.parse(JSON.stringify(this.updatedList)));
    },
    ondragEnd() {
      this.dragCard = false;
      this.updateList();
    },
    deleteList() {
      this.$emit("deleteList", JSON.parse(JSON.stringify(this.updatedList)));
    },
    onCardDrop(targetList, dropResult) {
      const { addedIndex, removedIndex, payload } = dropResult;
      if (
        targetList === null ||
        (removedIndex === null && addedIndex === null)
      ) {
        return;
      }
      const newBoard = this.$store.getters.board;
      const list = newBoard.lists.find((list) => list.id === targetList.id);
      let itemToAdd = payload;

      if (removedIndex !== null) {
        itemToAdd = list.cards.splice(removedIndex, 1)[0];
      }

      if (addedIndex !== null) {
        list.cards.splice(addedIndex, 0, itemToAdd);
      }
      this.$emit("updateBoard", JSON.parse(JSON.stringify(newBoard)));
    },
    getChildPayload(detachList) {
      return (index) => detachList.cards[index];
    },
  },
  computed: {
    getList() {
      return JSON.parse(JSON.stringify(this.list));
    },
    showTitle() {
      return this.list.title ? this.list.title : "Enter title";
    },
    emptyList() {
      return this.updatedList.cards.length
        ? "smooth-dnd-container "
        : " smooth-dnd-container empty-list";
    },
  },
  watch: {
    list: {
      handler() {
        this.updatedList = JSON.parse(JSON.stringify(this.list));
      },
    },
  },
  components: {
    Container,
    Draggable,
    cardList,
  },
};
</script>

<style></style>

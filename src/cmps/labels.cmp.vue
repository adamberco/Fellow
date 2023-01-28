<template>
  <section class="card-popup label-popup" v-click-outside="onClose">
    <section v-show="!isEditLabel && !isNewLabel">
      <header class="popup-header">
        <h4>Labels</h4>
        <div @click="onClose">
          <span class="close-popup icon-md icon-close"></span>
        </div>
      </header>
      <input type="text" placeholder="Search labels..." />
      <h5>Labels</h5>

      <section
        class="label-container"
        v-for="(label, idx) in allLabels"
        :key="label.id"
        @change="toggleCheck(label.id, idx)"
      >
        <label class="label-picker">
          <div :class="setColor(label.colorClass)">
            <span class="label-name">{{ label.txt }}</span>
            <input type="checkbox" :checked="checkLabel(label.id)" />
            <span v-show="checkLabel(label.id)" class="label-check icon-sm icon-check"></span>
          </div>
        </label>
        <span class="edit-btn icon-sm icon-edit" @click.stop="editLabel(label)"></span>
      </section>
      <button class="action-btn" @click="isNewLabel = true">Create a new label</button>
    </section>

    <section v-show="isEditLabel || isNewLabel" class="edit-label">
      <header class="popup-header">
        <h4>{{ title }}</h4>
        <div @click="onClose">
          <span class="close-popup icon-md icon-close"></span>
          <span @click.stop="goBack" class="back-popup icon-sm icon-back"></span>
        </div>
      </header>
      <h5>Name</h5>
      <form @submit.stop.prevent="formAction()">
        <input type="text" v-model="labelOnEdit.txt" />
      </form>
      <h5>Select a color</h5>

      <div class="color-selectors">
        <section v-for="color in colorSet" :key="color" :class="color">
          <label class="label-picker">
            <input type="radio" :value="color" v-model="labelOnEdit.colorClass" />
            <!-- {{ color }} -->
            <span v-show="labelOnEdit.colorClass === color" class="label-check icon-sm icon-check"></span>
          </label>
        </section>
      </div>
      <div class="label-popup-btn">
        <button class="submit-accept label-popup-submit" v-if="isEditLabel" @click="updateLabel">Save</button>
        <button class="submit-delete label-popup-submit" v-if="isEditLabel" @click="deleteLabel">Delete</button>
      </div>
      <button class="action-btn" v-if="isNewLabel" @click="createLabel">Create</button>
    </section>
  </section>
</template>

<script>
export default {
  props: {
    cardLabels: {
      type: Array,
    },
  },
  data() {
    return {
      cardLabelsIds: JSON.parse(JSON.stringify(this.cardLabels)),
      allLabels: this.$store.getters.labels,
      isEditLabel: false,
      isNewLabel: false,
      labelOnEdit: { txt: '', colorClass: 'label-green' },
      colorSelect: 'label-green',
      colorSet: [
        'label-green',
        'label-yellow',
        'label-orange',
        'label-red',
        'label-purple',
        'label-blue',
        'label-lightblue',
        'label-lightgreen',
        'label-pink',
        'label-darkblue',
      ],
    };
  },
  methods: {
    updateLabel() {
      const board = this.$store.getters.board;
      const idx = this.allLabels.findIndex((label) => label.id === this.labelOnEdit.id);
      this.allLabels.splice(idx, 1, JSON.parse(JSON.stringify(this.labelOnEdit)));
      board.labels = JSON.parse(JSON.stringify(this.allLabels));
      this.$store.dispatch({ type: 'updateBoard', board });
      this.labelOnEdit = this.emptyLabel();
      this.isEditLabel = false;
    },
    async createLabel() {
      const board = this.$store.getters.board;
      try {
        this.isNewLabel = false;
        await this.$store.dispatch({ type: 'createLabel', board, label: JSON.parse(JSON.stringify(this.labelOnEdit)) });
        this.allLabels = this.$store.getters.labels;
        this.isNewLabel = false;
        this.labelOnEdit = this.emptyLabel();
      } catch (err) {
        console.log('failed to create Label');
      }
    },
    async deleteLabel() {
      try {
        const board = this.$store.getters.board;
        const idx = this.allLabels.findIndex((label) => label.id === this.labelOnEdit.id);
        this.allLabels.splice(idx, 1);
        board.labels = JSON.parse(JSON.stringify(this.allLabels));

        //remove all labels ids from cards
        board.lists.forEach((list) => {
          list.cards.forEach((card) => {
            card.labelIds = card.labelIds.filter((labelId) => labelId !== this.labelOnEdit.id);
          });
        });
        await this.$store.dispatch({ type: 'updateBoard', board: JSON.parse(JSON.stringify(board)) });

        this.isEditLabel = false;
        this.labelOnEdit = this.emptyLabel();
      } catch (err) {
        console.log('cant delete label');
      }
    },
    checkLabel(labelId) {
      return 0 <= this.cardLabelsIds.findIndex((lId) => lId === labelId);
    },
    toggleCheck(labelId, posIdx) {
      const idx = this.cardLabelsIds.findIndex((lId) => lId === labelId);
      0 <= idx ? this.cardLabelsIds.splice(idx, 1) : this.cardLabelsIds.splice(posIdx, 0, labelId);
      this.$emit('update', JSON.parse(JSON.stringify(this.cardLabelsIds)));
    },
    setColor(colorClass) {
      return `${colorClass} ${colorClass}-lg`;
    },
    editLabel(label) {
      this.isEditLabel = true;
      this.labelOnEdit = label;
    },
    emptyLabel() {
      return { txt: '', colorClass: 'label-green' };
    },
    formAction() {
      return this.isNewLabel ? this.createLabel() : this.updateLabel();
    },
    goBack() {
      this.isEditLabel = false;
      this.isNewLabel = false;
      this.labelOnEdit = this.emptyLabel();
    },
    onClose() {
      this.goBack();
      this.$emit('close');
    },
  },
  computed: {
    title() {
      return this.isNewLabel ? 'Create Label' : 'Change label';
    },
  },
};
</script>

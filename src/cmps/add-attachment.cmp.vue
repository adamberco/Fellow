<template>
  <section class="card-popup attachment-popup" v-click-outside="close">
    <section class="popup-header">
      <div @click.stop="close">
        <span class="close-popup icon-md icon-close"></span>
      </div>
      <h4>Attach from...</h4>
    </section>

    <form @submit.prevent="addAttach">
      <label class="img-upload-container">
        Computer
        <div>
          <label class="clickable add-img" v-if="!isLoading">
            <input type="file" id="uploadImg" @change="onUploadImg" hidden />
          </label>
          <div v-else class="loader">
            <img :src="require('../assets/img/loader.svg')" alt />
          </div>
        </div>
      </label>
      <label v-if="!isLoading">Attach a link</label>
      <input v-if="!isLoading" type="text" v-model="newAttach.href" />
      <label v-show="newAttach.href">Link name (optional)</label>
      <input v-show="newAttach.href" type="text" v-model="newAttach.name" />
      <button class="submit">Add</button>
    </form>
  </section>
</template>

<script>
import imgUpload from '@/cmps/img-upload';
import { uploadImg } from '@/services/imgUpload.service.js';

export default {
  data() {
    return {
      newAttach: {
        name: '',
        href: '',
        file: null,
        createdAt: '',
        type: '',
      },
      isLoading: false,
    };
  },
  methods: {
    async onUploadImg(ev) {
      this.isLoading = true;
      try {
        let res = await uploadImg(ev);
        this.newAttach.href = res.url;
        this.newAttach.type = 'img';
        this.isLoading = false;
      } catch (err) {
        console.log('cant upload img'.err);
      }
    },
    close() {
      console.log('here');
      this.$emit('close');
    },
    addAttach() {
      if (this.newAttach.href && !this.newAttach.type) {
        this.newAttach.type = 'link';
      }
      if (!this.newAttach.type) return;
      this.newAttach.createdAt = Date.now();
      this.$emit('addNewAttach', this.newAttach);
      this.resetAttach();
    },
    handleFileUpload() {
      const file = this.$refs.file.files[0];
      this.newAttach.type = file.type;
      this.newAttach.file = file;
      this.newAttach.name = file.name;
      this.$emit('addNewAttach', this.newAttach);
      this.resetAttach();
    },
    resetAttach() {
      this.newAttach = {
        name: '',
        href: '',
        file: null,
        createdAt: '',
        type: '',
        file: null,
      };
    },
  },
  components: {
    imgUpload,
  },
};
</script>


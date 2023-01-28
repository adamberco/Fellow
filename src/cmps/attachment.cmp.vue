<template>
  <section @click="openLink" class="attachment-list">
    <a class="attach-photo" :style="bgImg">
      <span class="icon" :class="{'attach-icon': attachment.type !== 'img'}"></span>
    </a>
    <p class="attachment-details">
      <span>
        <span class="name" v-if="attachment.href">
          {{
          attachment.name || attachment.href
          }}
        </span>
      </span>
      <a @click="openLink" class="attach-open">
        <span class="icon-sm icon-external"></span>
      </a>
      <span class="info-wrapper">
        <span class="info">
          <span>
            Added
            <span class="time-past">{{ timeSince }}</span>
          </span>
        </span>
        <a class="comment options">
          <span>Comment</span>
        </a>
        <a class="delete options" @click.stop="deleteAttach">
          <span>Delete</span>
        </a>
        <a class="edit options" @click.stop="openEdit">
          <span>Edit</span>
        </a>
        <a class="cover options" v-if="attachment.type === 'img'">
          <span class="icon-wrapper">
            <span class="icon-cover icon-sm"></span>
          </span>
          <span
            v-show="
              !cardToEdit.style || cardToEdit.style.img !== attachment.href
            "
            @click.stop="makeCover"
          >Make cover</span>
          <span
            v-show="
              cardToEdit.style && cardToEdit.style.img === attachment.href
            "
            @click.stop="removeCover"
            class="remove-cover"
          >Remove cover</span>
        </a>
      </span>
    </p>
  </section>
</template>

<script>
import FastAverageColor from "fast-average-color";
import { utilService } from "../services/util.service.js";

export default {
  props: {
    attachment: {
      type: Object
    },
    cardToEdit: {
      type: Object
    }
  },
  methods: {
    openEdit() {
      this.$emit("openEdit", this.attachment);
    },
    openLink() {
      if (!this.attachment.href) return;
      var url = this.attachment.href;
      if (!url.includes("https://") && this.attachment.type !== "img")
        url = "https://" + url;
      window.open(url, "_blank");
    },
    deleteAttach() {
      this.$emit("deleteAttach", this.attachment);
    },
    async makeCover() {
      const fac = new FastAverageColor();
      const color = await fac.getColorAsync(this.attachment.href);
      const style = {
        img: this.attachment.href,
        bgColor: color.rgba,
        isDark: color.isDark
      };
      this.$emit("toggleCover", style);
    },
    removeCover() {
      this.$emit("toggleCover");
    }
  },
  computed: {
    attachToEdit() {
      return this.attachment;
    },
    bgImg() {
      if (this.attachment.type === "img") {
        return { backgroundImage: `url("${this.attachment.href}")` };
      }
    },
    timeSince() {
      return utilService.timeSince(this.attachment.createdAt);
    }
  }
};
</script>


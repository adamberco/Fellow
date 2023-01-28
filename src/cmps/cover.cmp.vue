<template>
  <section class="card-popup cover-popup" v-click-outside="closeCover"  click.stop="">
    <section class="popup-header">
      <div @click.stop="closeCover">
        <span class="close-popup icon-md icon-close"></span>
      </div>
      <h4>{{ showUnsplash ? "Photo search" : "Cover" }}</h4>
    </section>
    <section class="cover" v-show="!showUnsplash">
      <button class="action-btn" @click.stop="removeCover">Remove cover</button>
      <label>Colors</label>
      <div class="colors-container">
        <button
          v-for="colorCode in colors"
          :key="colorCode"
          @click="makeCover(colorCode)"
          class="color"
          :style="{ backgroundColor: colorCode }"
          :class="{ 'selected-btn': isSelected(colorCode) }"
        ></button>
      </div>
      <label class="img-attachs">Attachments</label>
      <div class="attachments-container">
        <button
          v-for="img in imgAttachs"
          :key="img.href"
          :class="{ 'selected-btn': isSelected(img.href) }"
          :style="backgroundImg(img.href)"
          @click="makeCover(img.href)"
        ></button>
      </div>
      <label class>Unsplash</label>
      <div class="unsplash-container">
        <button
          v-for="img in previewImgs"
          :key="img.regular"
          :class="{ 'selected-btn': isSelected(img.small) }"
          :style="backgroundImg(img.small)"
          @click="makeCover(img.small)"
        ></button>
      </div>
      <div class="search-imgs action-btn" @click.stop="openUnsplash">
        Search for photos
      </div>
    </section>
    <section class="photo-search" v-show="showUnsplash">
      <span @click="showUnsplash = false" class="img-back icon-sm icon-back"></span>
      <input
        type="text"
        placeholder="Search Unsplash for photos"
        v-model="searchStr"
        @input="search()"
      />
      <div v-show="!showResults" class="suggestions-container">
        <label>Suggested searches</label>
        <div class="suggestions">
          <button
            class="action-btn"
            @click="search(suggestion)"
            v-for="suggestion in suggestions"
            :key="suggestion"
          >{{ suggestion }}</button>
        </div>
      </div>
      <section>
        <div class="search-preview-container" v-show="!showResults">
          <label>Top photos</label>
          <div class="search-preview">
            <button
              v-for="img in imgs"
              :key="img.regular"
              :class="{ 'selected-btn': isSelected(img.small) }"
              :style="backgroundImg(img.small)"
              @click.stop="makeCover(img.small, 'putInPreview')"
            ></button>
          </div>
        </div>
        <div class="results" v-show="showResults">
          <label>Results</label>
          <p v-show="noResults">Sorry, your search didn't return any results. Please try again!</p>
          <div
            v-show="!isLoading && !noResults"
            class="search-results"
            v-infinite-scroll="loadMore"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="100"
            infinite-scroll-immediate-check="true"
          >
            <div
              v-for="img in searchResults"
              :key="img.small"
              :class="{ 'selected-btn': isSelected(img.small) }"
              :style="backgroundImg(img.small)"
              @click="makeCover(img.small, 'putInPreview')"
            ></div>
          </div>
        </div>
        <footer v-show="showResults && !noResults">
          <div v-if="isLoading" class="loader">
            <img :src="require('../assets/img/loader.svg')" alt />
            <span>Loading...</span>
          </div>
          <div class="text">
            <span>Photos by</span>
            <a
              href="https://unsplash.com/?utm_source=trello&utm_medium=referral&utm_campaign=api-credit"
              target="_blank"
            >Upsplash</a>
          </div>
        </footer>
      </section>
    </section>
  </section>
</template>

<script>
import FastAverageColor from "fast-average-color";

export default {
  props: {
    card: {
      type: Object
    }
  },
  data() {
    return {
      showResults: false,
      showUnsplash: false,
      showSuggestions: true,
      isLoading: false,
      noResults: false,
      busy: false,
      imgs: [
        {
          small:
            "https://images.unsplash.com/photo-1477346611705-65d1883cee1e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODA4Mzl8MHwxfHNlYXJjaHwxfHx3YWxscGFwZXJzfGVufDB8fHx8MTYzODc5Mjc1OA&ixlib=rb-1.2.1&q=80&w=400"
        },
        {
          small:
            "https://images.unsplash.com/photo-1533470192478-9897d90d5461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODA4Mzl8MHwxfHNlYXJjaHwyfHx3YWxscGFwZXJzfGVufDB8fHx8MTYzODc5Mjc1OA&ixlib=rb-1.2.1&q=80&w=400"
        },
        {
          small:
            "https://images.unsplash.com/photo-1451337516015-6b6e9a44a8a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODA4Mzl8MHwxfHNlYXJjaHwzfHx3YWxscGFwZXJzfGVufDB8fHx8MTYzODc5Mjc1OA&ixlib=rb-1.2.1&q=80&w=400"
        },
        {
          small:
            "https://images.unsplash.com/photo-1502759683299-cdcd6974244f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODA4Mzl8MHwxfHNlYXJjaHw0fHx3YWxscGFwZXJzfGVufDB8fHx8MTYzODc5Mjc1OA&ixlib=rb-1.2.1&q=80&w=400"
        },
        {
          small:
            "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODA4Mzl8MHwxfHNlYXJjaHw1fHx3YWxscGFwZXJzfGVufDB8fHx8MTYzODc5Mjc1OA&ixlib=rb-1.2.1&q=80&w=400"
        },
        {
          small:
            "https://images.unsplash.com/photo-1502657877623-f66bf489d236?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODA4Mzl8MHwxfHNlYXJjaHw2fHx3YWxscGFwZXJzfGVufDB8fHx8MTYzODc5Mjc1OA&ixlib=rb-1.2.1&q=80&w=400"
        },
        {
          small:
            "https://images.unsplash.com/photo-1426604966848-d7adac402bff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODA4Mzl8MHwxfHNlYXJjaHw3fHx3YWxscGFwZXJzfGVufDB8fHx8MTYzODc5OTgzMg&ixlib=rb-1.2.1&q=80&w=400"
        },
        {
          small:
            "https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODA4Mzl8MHwxfHNlYXJjaHw4fHx3YWxscGFwZXJzfGVufDB8fHx8MTYzODc5OTgzMg&ixlib=rb-1.2.1&q=80&w=400"
        },
        {
          small:
            "https://images.unsplash.com/photo-1548983965-416c1920352e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODA4Mzl8MHwxfHNlYXJjaHw5fHx3YWxscGFwZXJzfGVufDB8fHx8MTYzODc5OTgzMg&ixlib=rb-1.2.1&q=80&w=400"
        },
        {
          small:
            "https://images.unsplash.com/photo-1480497490787-505ec076689f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODA4Mzl8MHwxfHNlYXJjaHwxMHx8d2FsbHBhcGVyc3xlbnwwfHx8fDE2Mzg3OTk4MzI&ixlib=rb-1.2.1&q=80&w=400"
        },
        {
          small:
            "https://images.unsplash.com/photo-1507608869274-d3177c8bb4c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODA4Mzl8MHwxfHNlYXJjaHwxMXx8d2FsbHBhcGVyc3xlbnwwfHx8fDE2Mzg3OTk4MzI&ixlib=rb-1.2.1&q=80&w=400"
        },
        {
          small:
            "https://images.unsplash.com/photo-1479030160180-b1860951d696?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyODA4Mzl8MHwxfHNlYXJjaHwxMnx8d2FsbHBhcGVyc3xlbnwwfHx8fDE2Mzg3OTk4MzI&ixlib=rb-1.2.1&q=80&w=400"
        }
      ],
      searchResults: [],
      previewImgs: [],
      searchStr: "",
      busy: false,
      page: 1,
      colors: [
        "#7bc86c",
        "#f5dd29",
        "#ffaf3f",
        "#ef7564",
        "#cd8de5",
        "#5ba4cf",
        "#29cce5",
        "#6deca9",
        "#ff8ed4",
        "#172b4d"
      ],
      suggestions: [
        "Productivity",
        "Perspective",
        "Organization",
        "Colorful",
        "Nature",
        "Business",
        "Minimal",
        "Space",
        "Animals"
      ]
    };
  },
  created() {
    this.showUnsplash = false;
    this.previewImgs = this.imgs.slice(0, 6);
    if (this.card.style) {
      this.putInPrev(
        this.card.style.img ? this.card.style.img : this.card.style.bgColor
      );
    }
  },
  methods: {
    isSelected(val) {
      if (!this.card.style) return;
      if (val.charAt(0) === "#") {
        return !this.card.style.img && this.card.style.bgColor === val
          ? true
          : false;
      }
      return this.card.style.img === val ? true : false;
    },
    async loadMore() {
      this.busy = true;

      try {
        await this.$store.dispatch({
          type: "requestPhotos",
          searchKey: this.searchStr,
          imgNum: 30,
          page: ++this.page
        });
        this.searchResults.push(...this.$store.getters.getBgPhotos);
        this.busy = false;
      } catch (err) {
        console.log("cant load next page", err);
      }
    },
    async makeCover(val, putInPreview = false) {
      let style = {
        img: null,
        bgColor: null,
        isDark: false
      };
      const fac = new FastAverageColor();
      if (val.charAt(0) === "#") {
        style.isDark = val === "#172b4d" ? true : false;
        style.bgColor = val;
      } else {
        const color = await fac.getColorAsync(val);
        style.bgColor = color.rgba;
        style.isDark = color.isDark;
        style.img = val;
      }

      this.$emit("toggleCover", style);
      if (putInPreview) this.putInPrev(val);
    },
    backgroundImg(url) {
      return { backgroundImage: `url("${url}")` };
    },
    removeCover() {
      this.$emit("toggleCover");
    },
    closeCover() {
      console.log("close");
      this.showSuggestions = true;
      this.showResults = false;
      this.isLoading = false;
      this.showUnsplash = false;
      this.$emit("closeCover");
    },
    async search(val = null) {
      this.noResults = false;
      this.showSuggestions = false;
      this.showResults = true;
      this.searchResults = [];
      this.isLoading = true;
      if (val) {
        this.searchStr = val;
      }
      try {
        await this.$store.dispatch({
          type: "requestPhotos",
          searchKey: this.searchStr,
          imgNum: 30
        });
        this.searchResults.push(...this.$store.getters.getBgPhotos);
        if (!this.searchResults.length) this.noResults = true;
        this.isLoading = false;
      } catch (err) {
        console.log("cant get search unsplash imgs", err);
      }
    },
    async openUnsplash() {
      console.log('open');
      this.showUnsplash = true;
      this.showResults = false;
    },
    putInPrev(val) {
      if (!this.card.style || !this.card.style.img) return;
      var inPreview = this.previewImgs.some(img => img.small === val);
      if (inPreview) return;
      inPreview = this.imgAttachs.some(attachment => attachment.href === val);
      if (inPreview) return;
      this.previewImgs.unshift({ small: val });
      this.previewImgs.pop();
    }
  },
  computed: {
    unsplashImgs() {
      var imgs = this.$store.getters.getBgPhotos;
      return imgs;
    },
    imgAttachs() {
      if (!this.card.attachments) return;
      return this.card.attachments.filter(
        attachment => attachment.type === "img"
      );
    }
  }
};
</script>

<style></style>

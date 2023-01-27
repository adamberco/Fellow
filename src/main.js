import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import './styles/style.scss';
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';
import VuePersianDatetimePicker from 'vue-persian-datetime-picker';
import GoogleSignInButton from 'vue-google-signin-button-directive';
import { LoaderPlugin } from 'vue-google-login';
Vue.component('date-picker', VuePersianDatetimePicker);
var infiniteScroll = require('vue-infinite-scroll');
Vue.use(Element, { locale });
Vue.use(infiniteScroll);
Vue.use(LoaderPlugin, {
  client_id: '961995621272-60aj5sk5o9vlm2a68pqoqbtd32uo5ka3.apps.googleusercontent.com'
});

// import { library } from '@fortawesome/fontawesome-svg-core'
// import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// library.add(faUserSecret)
// Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false;

// Vue.config.configureWebpack = false;
new Vue({
  GoogleSignInButton,
  router,
  store,
  // GoogleAuth,
  // gauthOption,
  render: (h) => h(App),
}).$mount('#app');

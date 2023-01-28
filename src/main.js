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
    client_id:
        '961995621272-60aj5sk5o9vlm2a68pqoqbtd32uo5ka3.apps.googleusercontent.com',
});

Vue.directive('click-outside', {
    bind: function (el, binding, vnode) {
        el.event = function (event) {
            // here i check that click was outside the el and his childrens
            if (!(el == event.target || el.contains(event.target))) {
                // and if it did, call method provided in attribute value
                vnode.context[binding.expression](event);
            }
        };
        document.body.addEventListener('click', el.event);
        document.querySelector('.card-details-container')?.addEventListener('click', el.event);
        document.querySelector('.card-details')?.addEventListener('click', el.event);
    },
    unbind: function (el) {
        document.body.removeEventListener('click', el.event);
        document.querySelector('.card-details-container')?.removeEventListener('click', el.event);
        document.querySelector('.card-details')?.removeEventListener('click', el.event);
    },
});

Vue.config.productionTip = false;

new Vue({
    GoogleSignInButton,
    router,
    store,
    render: (h) => h(App),
}).$mount('#app');

// import { library } from '@fortawesome/fontawesome-svg-core'
// import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// library.add(faUserSecret)
// Vue.component('font-awesome-icon', FontAwesomeIcon)
// Vue.config.configureWebpack = false;
// GoogleAuth,
// gauthOption,

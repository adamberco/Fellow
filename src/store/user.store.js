import { userService } from '../services/user.service.js';

export const userStore = {
  state: {
    user: null,
    users: null,
  },
  getters: {
    user(state) {
      return JSON.parse(JSON.stringify(state.user));
    },
    // activitiesToShow(state) {
    //     return state.user.activities.slice(state.pageIndex * state.actPageSize, state.actPageSize * (state.pageIndex + 1))
    // }
    users(state) {
      return JSON.parse(JSON.stringify(state.users));
    },
  },
  mutations: {
    setUser(state, { user }) {
      state.user = user;
    },
    setUsers(state, { users }) {
      state.users = users;
    },
    // editUser(state, { user }) {
    //     state.user = user
    // },
    // addActivity(state, { activity }) {
    //     state.user.activities.unshift({ txt: activity, at: Date.now() })
    // },
    // setPage(state, { val }) {

    //     state.pageIndex += +val
    //     if (state.pageIndex >= Math.ceil(state.user.activities.length / state.actPageSize)) state.pageIndex = 0
    //     // if (state.pageIndex <= Math.ceil(state.user.activities.length / state.actPageSize)) state.pageIndex = Math.ceil(state.user.activities.length / state.actPageSize)
    // }
  },
  actions: {
    async loadUsers({ commit }) {
      try {
        const users = await userService.query();
        commit({ type: 'setUsers', users });
      } catch (err) {
        console.log('err');
      }
    },
    setUser({ commit }) {
      const user = userService.getLoggedInUser();
      commit({ type: 'setUser', user });
      console.log('user from loggeninUser', user);
    },
    async login({ dispatch }, { username, password }) {
      try {
        await userService.login(username, password);
        dispatch({ type: 'setUser' });
      } catch (err) {
        console.log('cant login user', err);
        throw err
      }
    },
    async googleLogin({ dispatch }, { username, fullname, imgUrl }) {
      try {
        await userService.googleLogin(username, fullname, imgUrl);
        dispatch({ type: 'setUser' });
      } catch (err) {
        console.log('cant login user', err);
        throw err
      }
    },
    async logout({ dispatch }) {
      try {
        await userService.logout();
        dispatch({ type: 'setUser' ,  user:null});
      } catch (err) {
        console.log('cant logout user', err);
        throw err
      }
    },
    async signup({ dispatch }, {  username, password , fullname}) {
      try {
          console.log('username:', username,' password:',  password,'fullname:', fullname);
        await userService.signup(username, password, fullname);
        dispatch({ type: 'setUser' });
      } catch (err) {
        console.log('cant sign up user', err);
        throw err
      }
    },
    // editUser({ commit, state }, { user }) {
    //     userService.save(user)
    //         .then(user => {
    //             commit({ type: 'editUser', user })
    //             userService.save(state.user).then()
    //         })
    // },
    // addActivity({ commit, state }, { activity }) {
    //     commit({ type: 'addActivity', activity })
    //     userService.save(state.user).then()
    // },
    // setPage({ commit }, { val }) {
    //     commit({ type: 'setPage', val })

    // }
  },
};

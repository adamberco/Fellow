import { boardService } from '../services/board.service.js';

export const boardStore = {
  state: {
    currBoard: null,
    boards: null,
    currCard: null,
    currList: null,
  },

  getters: {
    board(state) {
      return JSON.parse(JSON.stringify(state.currBoard));
    },
    boards(state) {
      return JSON.parse(JSON.stringify(state.boards));
    },
    boardId(state) {
      return state.currBoard._id;
    },
    card(state) {
      return JSON.parse(JSON.stringify(state.currCard));
    },
    list(state) {
      return JSON.parse(JSON.stringify(state.currList));
    },
    labels(state) {
      return JSON.parse(JSON.stringify(state.currBoard.labels));
    },
  },

  mutations: {
    setBoard(state, { board }) {
      state.currBoard = board;
    },
    setBoards(state, { boards }) {
      state.boards = boards;
    },
    setCard(state, { card }) {
      state.currCard = card;
    },
    setList(state, { list }) {
      state.currList = list;
    },
  },

  actions: {
    async loadBoards({ commit }) {
      try {
        const boards = await boardService.query();
        commit({ type: 'setBoards', boards });
      } catch (err) {
        console.log('cant load boards:', err);
      }
    },
    async loadBoard({ commit }, { boardId }) {
      if (!boardId) {
        commit({ type: 'setBoard', board: null });
        return
      }
      try {
        const board = await boardService.getById(boardId);
        commit({ type: 'setBoard', board });
      } catch (err) {
        console.log('cant load boards:', err);
      }
    },
    async deleteBoard({ commit }, { boardId }) {
      try {
        await boardService.remove(boardId);
        const boards = await boardService.query();
        commit({ type: 'setBoards', boards });
        commit({ type: 'setBoard', board: null });
      } catch (err) {
        console.log('cant delete Board', err);
      }
    },
    async setListAndCard({ commit }, { boardId, cardId }) {
      try {
        if (cardId) {
          const data = await boardService.getListAndCardById(boardId, cardId);
          const card = data.card;
          const list = data.list;
          commit({ type: 'setCard', card });
          commit({ type: 'setList', list });
        } else {
          commit({ type: 'setCard', card: null });
          commit({ type: 'setList', list: null });
        }
      } catch (err) {
        console.log('cant load card:', err);
      }
    },
    async loadAndWatchBoard({ commit }, { boardId }) {
      try {
        const board = await boardService.getById(boardId);
        commit({ type: 'setBoard', board });
        return board;
      } catch (err) {
        console.log('cant load board:' + id, err);
      }
    },
    async createBoard({ commit }, { title }) {
      try {
        const board = boardService.getEmptyBoard(title);
        const savedBoard = boardService.save(board);
        commit({ type: 'setBoard', board: savedBoard });
        return savedBoard;
      } catch (err) {
        console.log("can't create board", err);
      }
    },
    async addList({ commit }, { board, title }) {
      const list = boardService.getEmptyList(title);
      try {
        const updatedBoard = await boardService.saveList(list, board);
        commit({ type: 'setBoard', board: updatedBoard });
        return updatedBoard;
      } catch (err) {
        console.log('cant addList', err);
      }
    },
    async updateList({ commit }, { board, list }) {
      try {
        const updatedBoard = await boardService.saveList(list, board);
        commit({ type: 'setBoard', board: updatedBoard });
        return updatedBoard;
      } catch (err) {
        console.log('cant update list', err);
      }
    },
    async deleteList({ commit }, { board, list }) {
      const listIdx = board.lists.findIndex((currList) => currList.id === list.id);
      board.lists.splice(listIdx, 1);
      try {
        const updatedBoard = await boardService.save(board);
        commit({ type: 'setBoard', board: updatedBoard });
        return updatedBoard;
      } catch (err) {
        console.log('cant delete list', err);
      }
    },

    async addCard({ commit }, { board, list, title }) {
      const card = boardService.getEmptyCard(title);
      list.cards.push(card);
      try {
        const updatedBoard = await boardService.saveList(list, board);
        commit({ type: 'setBoard', board: updatedBoard });
        return updatedBoard;
      } catch (err) {
        console.log('cant add card', err);
      }
    },
    async updateCard({ commit }, { boardId, list, card }) {
      try {
        const data = await boardService.updateCard(card, list, boardId);
        commit({ type: 'setBoard', board: data.savedBoard });
        commit({ type: 'setList', list: data.savedList });
        commit({ type: 'setCard', card: data.savedCard });
      } catch (err) {
        console.log('cant add card', err);
      }
    },
    async removeCard({ commit }, { boardId, list, cardId }) {
      try {
        const data = await boardService.removeCard(cardId, list, boardId);
        commit({ type: 'setBoard', board: data.savedBoard });
        commit({ type: 'setList', list: data.savedList });
        commit({ type: 'setCard', card: data.savedCard });
      } catch (err) {
        console.log('cant remove card', err);
      }
    },
  },
};

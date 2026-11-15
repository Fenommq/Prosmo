'use strict';

/* =========================================================
   Хранилище: аккаунты, доски и тайтлы.
   Данные лежат в IndexedDB (резерв — localStorage).
   ========================================================= */

const Store = (() => {
  const IDB_NAME = 'watchlist-studio';
  const IDB_STORE = 'kv';
  const IDB_KEY = 'state';
  const LS_KEY = 'watchlist-studio.state';
  const SESSION_KEY = 'watchlist-studio.session';
  const PBKDF2_ITERATIONS = 120000;

  const TYPES = ['movie', 'series', 'anime', 'cartoon', 'doc', 'other'];

  let data = emptyData();
  let idb = null;
  let mode = 'idb';
  let sessionUserId = null;
  let saveChain = Promise.resolve();

  /* ---------- служебное ---------- */

  function emptyData() {
    return { version: 1, users: [], boards: [], items: [] };
  }

  function uid() {
    if (window.crypto && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return (
      'id-' +
      Date.now().toString(36) +
      '-' +
      Math.random().toString(36).slice(2, 10)
    );
  }

  function randHex(bytes) {
    const arr = new Uint8Array(bytes);
    crypto.getRandomValues(arr);
    return Array.from(arr, (b) => b.toString(16).padStart(2, '0')).join('');
  }

  function toBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) {
      binary += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    }
    return btoa(binary);
  }

  function fromHex(hex) {
    const out = new Uint8Array(hex.length / 2);
    for (let i = 0; i < out.length; i++) {
      out[i] = parseInt(hex.substr(i * 2, 2), 16);
    }
    return out;
  }

  function safeEqual(a, b) {
    if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) {
      return false;
    }
    let diff = 0;
    for (let i = 0; i < a.length; i++) {
      diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }
    return diff === 0;
  }

  async function deriveHash(password, saltHex) {
    if (!window.crypto || !crypto.subtle) {
      throw new Error(
        'Браузер не поддерживает безопасное хранение паролей. Откройте сайт в Chrome, Edge или Firefox.'
      );
    }
    const enc = new TextEncoder();
    const baseKey = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveBits']
    );
    const bits = await crypto.subtle.deriveBits(
      {
        name: 'PBKDF2',
        salt: fromHex(saltHex),
        iterations: PBKDF2_ITERATIONS,
        hash: 'SHA-256',
      },
      baseKey,
      256
    );
    return toBase64(bits);
  }

  function normalize(raw) {
    const out = emptyData();
    if (!raw || typeof raw !== 'object') return out;
    out.version = 1;
    out.users = Array.isArray(raw.users) ? raw.users.filter((u) => u && u.id) : [];
    out.boards = Array.isArray(raw.boards) ? raw.boards.filter((b) => b && b.id) : [];
    out.items = Array.isArray(raw.items) ? raw.items.filter((i) => i && i.id) : [];
    out.boards = out.boards.map((b) => ({
      desc: '',
      isPublic: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...b,
    }));
    out.items = out.items.map((i) => ({
      type: 'other',
      desc: '',
      year: '',
      image: '',
      watched: false,
      createdAt: Date.now(),
      ...i,
    }));
    return out;
  }

  /* ---------- IndexedDB / localStorage ---------- */

  function openIdb() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(new Error('IndexedDB не поддерживается'));
        return;
      }
      let req;
      try {
        req = indexedDB.open(IDB_NAME, 1);
      } catch (err) {
        reject(err);
        return;
      }
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('Не удалось открыть IndexedDB'));
      req.onblocked = () => reject(new Error('IndexedDB заблокирован'));
    });
  }

  function idbGet(key) {
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }

  function idbSet(key, value) {
    return new Promise((resolve, reject) => {
      const tx = idb.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(value, key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error || new Error('Запись отменена'));
    });
  }

  function withTimeout(promise, ms, message) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(message)), ms);
      promise.then(
        (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        (err) => {
          clearTimeout(timer);
          reject(err);
        }
      );
    });
  }

  async function initStorage() {
    try {
      if (!('indexedDB' in window)) throw new Error('IndexedDB недоступен');
      idb = await withTimeout(
        openIdb(),
        2500,
        'IndexedDB не отвечает'
      );
      // проверяем, что запись действительно работает (некоторые браузеры
      // запрещают хранилище для локальных файлов)
      await withTimeout(
        idbSet('__probe', Date.now()),
        2500,
        'IndexedDB не отвечает'
      );
      mode = 'idb';
    } catch (err) {
      console.warn('IndexedDB недоступен, используется localStorage:', err);
      mode = 'local';
      idb = null;
    }
  }

  async function readData() {
    if (mode === 'idb') {
      try {
        return await idbGet(IDB_KEY);
      } catch (err) {
        console.warn('Не удалось прочитать IndexedDB:', err);
        return null;
      }
    }
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (err) {
      console.warn('Не удалось прочитать localStorage:', err);
      return null;
    }
  }

  async function writeData(value) {
    if (mode === 'idb') {
      try {
        await idbSet(IDB_KEY, value);
        return;
      } catch (err) {
        console.warn('Запись в IndexedDB не удалась:', err);
        mode = 'local';
      }
    }
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(value));
    } catch (err) {
      throw new Error(
        'Не хватает памяти браузера для сохранения. Удалите несколько постеров или досок.'
      );
    }
  }

  function save() {
    const snapshot = data;
    saveChain = saveChain
      .catch(() => {})
      .then(() => writeData(snapshot))
      .catch((err) => {
        console.error('Ошибка сохранения:', err);
        throw err;
      });
    return saveChain;
  }

  /* ---------- инициализация ---------- */

  async function init() {
    await initStorage();
    data = normalize(await readData());

    let sid = null;
    try {
      sid = localStorage.getItem(SESSION_KEY);
    } catch (err) {
      sid = null;
    }
    if (sid && data.users.some((u) => u.id === sid)) {
      sessionUserId = sid;
    } else {
      sessionUserId = null;
      try {
        localStorage.removeItem(SESSION_KEY);
      } catch (err) {
        /* ignore */
      }
    }
  }

  /* ---------- аккаунты ---------- */

  function publicUser(user) {
    if (!user) return null;
    return { id: user.id, name: user.name, createdAt: user.createdAt };
  }

  function currentUser() {
    return publicUser(data.users.find((u) => u.id === sessionUserId));
  }

  function userById(id) {
    return publicUser(data.users.find((u) => u.id === id));
  }

  function requireUser() {
    const user = data.users.find((u) => u.id === sessionUserId);
    if (!user) throw new Error('Сначала войдите в аккаунт');
    return user;
  }

  function setSession(userId) {
    sessionUserId = userId;
    try {
      if (userId) localStorage.setItem(SESSION_KEY, userId);
      else localStorage.removeItem(SESSION_KEY);
    } catch (err) {
      /* ignore */
    }
  }

  function validateName(username) {
    const name = String(username || '').trim().replace(/\s+/g, ' ');
    if (name.length < 2) throw new Error('Имя должно содержать минимум 2 символа');
    if (name.length > 24) throw new Error('Имя не длиннее 24 символов');
    if (!/^[\p{L}\p{N}_ .-]+$/u.test(name)) {
      throw new Error('В имени можно использовать буквы, цифры, пробел, дефис, точку и _');
    }
    return name;
  }

  async function register(username, password) {
    const name = validateName(username);
    const pass = String(password || '');
    if (pass.length < 6) throw new Error('Пароль должен быть не короче 6 символов');
    if (pass.length > 100) throw new Error('Слишком длинный пароль');
    if (data.users.some((u) => u.nameLower === name.toLowerCase())) {
      throw new Error('Пользователь с таким именем уже существует');
    }
    const salt = randHex(16);
    const hash = await deriveHash(pass, salt);
    const user = {
      id: uid(),
      name,
      nameLower: name.toLowerCase(),
      salt,
      hash,
      createdAt: Date.now(),
    };
    data.users.push(user);
    setSession(user.id);
    await save();
    return publicUser(user);
  }

  async function login(username, password) {
    const name = String(username || '').trim().toLowerCase();
    const user = data.users.find((u) => u.nameLower === name);
    if (!user) throw new Error('Неверное имя или пароль');
    const hash = await deriveHash(String(password || ''), user.salt);
    if (!safeEqual(hash, user.hash)) throw new Error('Неверное имя или пароль');
    setSession(user.id);
    return publicUser(user);
  }

  async function logout() {
    setSession(null);
  }

  /* ---------- доски ---------- */

  function cleanText(value, max, field) {
    const text = String(value == null ? '' : value).trim();
    if (text.length > max) {
      throw new Error(`Поле «${field}» длиннее ${max} символов`);
    }
    return text;
  }

  function boardById(id) {
    return data.boards.find((b) => b.id === id) || null;
  }

  function getBoard(id) {
    return boardById(id);
  }

  async function createBoard(input) {
    const owner = requireUser();
    const title = cleanText(input.title, 80, 'Название');
    if (!title) throw new Error('Введите название доски');
    const desc = cleanText(input.desc, 600, 'Описание');
    const now = Date.now();
    const board = {
      id: uid(),
      ownerId: owner.id,
      title,
      desc,
      isPublic: Boolean(input.isPublic),
      createdAt: now,
      updatedAt: now,
    };
    data.boards.push(board);
    await save();
    return board;
  }

  async function updateBoard(id, patch) {
    const owner = requireUser();
    const board = boardById(id);
    if (!board) throw new Error('Доска не найдена');
    if (board.ownerId !== owner.id) throw new Error('Это не ваша доска');
    if ('title' in patch) {
      const title = cleanText(patch.title, 80, 'Название');
      if (!title) throw new Error('Введите название доски');
      board.title = title;
    }
    if ('desc' in patch) board.desc = cleanText(patch.desc, 600, 'Описание');
    if ('isPublic' in patch) board.isPublic = Boolean(patch.isPublic);
    board.updatedAt = Date.now();
    await save();
    return board;
  }

  async function deleteBoard(id) {
    const owner = requireUser();
    const board = boardById(id);
    if (!board) return;
    if (board.ownerId !== owner.id) throw new Error('Это не ваша доска');
    data.boards = data.boards.filter((b) => b.id !== id);
    data.items = data.items.filter((i) => i.boardId !== id);
    await save();
  }

  function boardsForUser(userId) {
    return data.boards
      .filter((b) => b.ownerId === userId)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  function publicBoards() {
    return data.boards
      .filter((b) => b.isPublic)
      .sort((a, b) => b.updatedAt - a.updatedAt);
  }

  function countsForBoard(boardId) {
    const items = data.items.filter((i) => i.boardId === boardId);
    const watched = items.filter((i) => i.watched).length;
    const covers = items
      .filter((i) => i.image)
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 3)
      .map((i) => i.image);
    return { total: items.length, watched, covers };
  }

  function summaryForUser(userId) {
    const boards = data.boards.filter((b) => b.ownerId === userId);
    const ids = new Set(boards.map((b) => b.id));
    const items = data.items.filter((i) => ids.has(i.boardId));
    return {
      boards: boards.length,
      items: items.length,
      watched: items.filter((i) => i.watched).length,
    };
  }

  function canEditBoard(boardId) {
    const board = boardById(boardId);
    return Boolean(board && sessionUserId && board.ownerId === sessionUserId);
  }

  /* ---------- тайтлы ---------- */

  function normalizeType(type) {
    return TYPES.includes(type) ? type : 'other';
  }

  function normalizeImage(value) {
    const src = String(value || '').trim();
    if (!src) return '';
    if (/^data:image\/(?:png|jpe?g|webp|gif);base64,/i.test(src)) return src;
    if (/^https?:\/\/\S+$/i.test(src)) return src;
    return '';
  }

  function normalizeYear(value) {
    const raw = String(value == null ? '' : value).trim();
    if (!raw) return '';
    const year = Number(raw);
    if (!Number.isFinite(year)) return '';
    const y = Math.round(year);
    if (y < 1888 || y > 2100) throw new Error('Год должен быть между 1888 и 2100');
    return String(y);
  }

  function itemById(id) {
    return data.items.find((i) => i.id === id) || null;
  }

  function itemsForBoard(boardId) {
    return data.items
      .filter((i) => i.boardId === boardId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  async function addItem(boardId, input) {
    const owner = requireUser();
    const board = boardById(boardId);
    if (!board) throw new Error('Доска не найдена');
    if (board.ownerId !== owner.id) throw new Error('Добавлять тайтлы может только владелец доски');
    const title = cleanText(input.title, 120, 'Название');
    if (!title) throw new Error('Введите название');
    const item = {
      id: uid(),
      boardId,
      title,
      type: normalizeType(input.type),
      year: normalizeYear(input.year),
      desc: cleanText(input.desc, 2000, 'Описание'),
      image: normalizeImage(input.image),
      watched: false,
      createdAt: Date.now(),
      watchedAt: null,
    };
    data.items.push(item);
    board.updatedAt = Date.now();
    await save();
    return item;
  }

  async function updateItem(id, patch) {
    const owner = requireUser();
    const item = itemById(id);
    if (!item) throw new Error('Тайтл не найден');
    const board = boardById(item.boardId);
    if (!board || board.ownerId !== owner.id) throw new Error('Это не ваш тайтл');

    if ('title' in patch) {
      const title = cleanText(patch.title, 120, 'Название');
      if (!title) throw new Error('Введите название');
      item.title = title;
    }
    if ('type' in patch) item.type = normalizeType(patch.type);
    if ('year' in patch) item.year = normalizeYear(patch.year);
    if ('desc' in patch) item.desc = cleanText(patch.desc, 2000, 'Описание');
    if ('image' in patch) item.image = normalizeImage(patch.image);
    if ('watched' in patch) setWatched(item, Boolean(patch.watched));

    board.updatedAt = Date.now();
    await save();
    return item;
  }

  function setWatched(item, watched) {
    item.watched = watched;
    item.watchedAt = watched ? Date.now() : null;
  }

  async function toggleWatched(id) {
    const owner = requireUser();
    const item = itemById(id);
    if (!item) throw new Error('Тайтл не найден');
    const board = boardById(item.boardId);
    if (!board || board.ownerId !== owner.id) throw new Error('Это не ваш тайтл');
    setWatched(item, !item.watched);
    board.updatedAt = Date.now();
    await save();
    return item;
  }

  async function deleteItem(id) {
    const owner = requireUser();
    const item = itemById(id);
    if (!item) return;
    const board = boardById(item.boardId);
    if (!board || board.ownerId !== owner.id) throw new Error('Это не ваш тайтл');
    data.items = data.items.filter((i) => i.id !== id);
    board.updatedAt = Date.now();
    await save();
  }

  /* ---------- экспорт / импорт ---------- */

  function exportBoard(boardId) {
    const board = boardById(boardId);
    if (!board) throw new Error('Доска не найдена');
    return {
      app: 'chto-posmotret',
      version: 1,
      exportedAt: new Date().toISOString(),
      board: {
        title: board.title,
        desc: board.desc,
        isPublic: board.isPublic,
      },
      items: itemsForBoard(boardId)
        .slice()
        .sort((a, b) => a.createdAt - b.createdAt)
        .map((i) => ({
          title: i.title,
          type: i.type,
          year: i.year,
          desc: i.desc,
          image: i.image,
          watched: i.watched,
        })),
    };
  }

  async function importBoard(payload) {
    const owner = requireUser();
    if (!payload || typeof payload !== 'object') {
      throw new Error('Файл повреждён или это не доска');
    }
    const src = payload.board || payload;
    const title = cleanText(src.title, 80, 'Название');
    if (!title) throw new Error('В файле нет названия доски');
    const desc = cleanText(src.desc || '', 600, 'Описание');
    const rawItems = Array.isArray(payload.items) ? payload.items : [];
    if (rawItems.length > 500) throw new Error('Слишком много тайтлов в файле');

    const now = Date.now();
    const board = {
      id: uid(),
      ownerId: owner.id,
      title,
      desc,
      isPublic: false,
      createdAt: now,
      updatedAt: now,
    };
    data.boards.push(board);

    rawItems.forEach((raw, index) => {
      if (!raw || typeof raw !== 'object') return;
      const itemTitle = String(raw.title || '').trim().slice(0, 120);
      if (!itemTitle) return;
      const item = {
        id: uid(),
        boardId: board.id,
        title: itemTitle,
        type: normalizeType(raw.type),
        year: (() => {
          try {
            return normalizeYear(raw.year);
          } catch (err) {
            return '';
          }
        })(),
        desc: String(raw.desc || '').slice(0, 2000),
        image: normalizeImage(raw.image),
        watched: Boolean(raw.watched),
        createdAt: now + index,
        watchedAt: raw.watched ? now : null,
      };
      data.items.push(item);
    });

    await save();
    return board;
  }

  async function resetAll() {
    data = emptyData();
    setSession(null);
    await save();
  }

  return {
    init,
    storageMode: () => mode,
    currentUser,
    userById,
    register,
    login,
    logout,
    getBoard,
    createBoard,
    updateBoard,
    deleteBoard,
    boardsForUser,
    publicBoards,
    countsForBoard,
    summaryForUser,
    canEditBoard,
    itemsForBoard,
    itemById,
    addItem,
    updateItem,
    toggleWatched,
    deleteItem,
    exportBoard,
    importBoard,
    resetAll,
  };
})();

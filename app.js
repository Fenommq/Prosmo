'use strict';

/* =========================================================
   «Что посмотреть» — интерфейс приложения
   ========================================================= */

/* ---------- типы тайтлов ---------- */

const TYPES = {
  movie: { label: 'Фильм', emoji: '🎬', tone: 'movie' },
  series: { label: 'Сериал', emoji: '📺', tone: 'series' },
  anime: { label: 'Аниме', emoji: '🌸', tone: 'anime' },
  cartoon: { label: 'Мультфильм', emoji: '🧸', tone: 'cartoon' },
  doc: { label: 'Документальный', emoji: '🎞️', tone: 'doc' },
  other: { label: 'Другое', emoji: '🎲', tone: 'other' },
};

const FILTERS = [
  { key: 'all', label: 'Все' },
  { key: 'unwatched', label: 'Не просмотрено' },
  { key: 'watched', label: 'Просмотрено' },
];

const SORTS = [
  { key: 'unwatched', label: 'Сначала непросмотренные' },
  { key: 'newest', label: 'Сначала новые' },
  { key: 'oldest', label: 'Сначала старые' },
  { key: 'az', label: 'По названию' },
];

const THEMES = [
  {
    key: 'noir',
    name: 'Нуар',
    hint: 'Шоколад, латунь, сепия',
    meta: '#120e0b',
    swatches: ['#120e0b', '#c9a45c', '#efe3cf'],
  },
  {
    key: 'graphite',
    name: 'Графит',
    hint: 'Уголь и серебро',
    meta: '#0f1012',
    swatches: ['#0f1012', '#c3bcae', '#e9e7e1'],
  },
  {
    key: 'ivory',
    name: 'Слоновая кость',
    hint: 'Пергамент и бронза',
    meta: '#eee4d3',
    swatches: ['#eee4d3', '#8c6826', '#2b2119'],
  },
  {
    key: 'burgundy',
    name: 'Бургунди',
    hint: 'Оксид и розовое золото',
    meta: '#150a0d',
    swatches: ['#150a0d', '#d8a67f', '#f5e7dc'],
  },
  {
    key: 'forest',
    name: 'Лес',
    hint: 'Олива и латунь',
    meta: '#0f120c',
    swatches: ['#0f120c', '#c6a75e', '#ece9d8'],
  },
  {
    key: 'indigo',
    name: 'Индиго',
    hint: 'Ночная синь и медь',
    meta: '#0b0e15',
    swatches: ['#0b0e15', '#c99a6b', '#e6e7ef'],
  },
];

/* ---------- иконки ---------- */

const ICONS = {
  clapper:
    '<path d="M20.2 6 3 11l-.9-2.4a2 2 0 0 1 1.26-2.53l13.3-4.4a2 2 0 0 1 2.53 1.26L20.2 6Z"/><path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 3.9"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8Z"/>',
  plus: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  close: '<path d="M18 6 6 18"/><path d="M6 6l12 12"/>',
  lock:
    '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  globe:
    '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.6 3.9 5.7 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.7-3.9-9s1.3-6.4 3.9-9Z"/>',
  trash:
    '<path d="M3 6h18"/><path d="M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2"/><path d="m19 6-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>',
  pencil:
    '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  link:
    '<path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.2 1.2"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.2-1.2"/>',
  download:
    '<path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/>',
  upload: '<path d="M12 21V9"/><path d="m7 14 5-5 5 5"/><path d="M5 3h14"/>',
  arrowLeft: '<path d="M19 12H5"/><path d="m12 19-7-7 7-7"/>',
  image:
    '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>',
  eye:
    '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  eyeOff:
    '<path d="M10.6 5.2A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2"/><path d="M6.7 6.7A17 17 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 4.3-1"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="m2 2 20 20"/>',
  film:
    '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16"/><path d="M17 4v16"/><path d="M3 9h4"/><path d="M3 15h4"/><path d="M17 9h4"/><path d="M17 15h4"/>',
  checkCircle:
    '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.3 2.3 4.7-4.6"/>',
  alert: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><path d="M12 16h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
  logout:
    '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/>',
  palette:
    '<circle cx="13.5" cy="6.5" r="1.5"/><circle cx="17.5" cy="10.5" r="1.5"/><circle cx="8.5" cy="7.5" r="1.5"/><circle cx="6.5" cy="12.5" r="1.5"/><path d="M12 2a10 10 0 1 0 0 20c1.1 0 1.8-.9 1.8-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2H16a6 6 0 0 0 6-6c0-4.4-4.5-8-10-8Z"/>',
};

function icon(name, size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${
    ICONS[name] || ''
  }</svg>`;
}

/* ---------- состояние ---------- */

let currentUser = null;
let authMode = 'login';
let activeBoardId = null;
let activeDetailId = null;
let pendingConfirm = null;
let boardView = { q: '', filter: 'all', sort: 'unwatched' };
let lastBoardId = null;

/* ---------- утилиты ---------- */

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => {
    return (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] ||
      ch
    );
  });
}

function plural(n, one, few, many) {
  const mod10 = Math.abs(n) % 10;
  const mod100 = Math.abs(n) % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
}

function tone(text) {
  const str = String(text || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 997;
  }
  return hash % 6;
}

function initials(name) {
  const parts = String(name || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function relTime(ts) {
  if (!ts) return '';
  const diff = ts - Date.now();
  const abs = Math.abs(diff);
  if (abs < 45 * 1000) return 'только что';
  try {
    const rtf = new Intl.RelativeTimeFormat('ru', { numeric: 'auto' });
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;
    if (abs < hour) return rtf.format(Math.round(diff / minute), 'minute');
    if (abs < day) return rtf.format(Math.round(diff / hour), 'hour');
    if (abs < month) return rtf.format(Math.round(diff / day), 'day');
    if (abs < year) return rtf.format(Math.round(diff / month), 'month');
    return rtf.format(Math.round(diff / year), 'year');
  } catch (err) {
    const date = new Date(ts);
    return date.toLocaleDateString('ru-RU');
  }
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

function avatarHtml(name, extraClass = '') {
  return `<span class="avatar ${extraClass}">${esc(initials(name))}</span>`;
}

function navigate(hash) {
  if (location.hash === hash) route();
  else location.hash = hash;
}

/* ---------- уведомления ---------- */

function toast(message, kind = 'success') {
  const wrap = document.getElementById('toasts');
  if (!wrap) return;
  const el = document.createElement('div');
  el.className = `toast ${kind}`;
  const iconName = kind === 'error' ? 'alert' : kind === 'info' ? 'info' : 'checkCircle';
  el.innerHTML = `${icon(iconName)}<span>${esc(message)}</span>`;
  wrap.appendChild(el);
  window.setTimeout(() => {
    el.classList.add('out');
    window.setTimeout(() => el.remove(), 240);
  }, 3400);
}

/* ---------- модальные окна ---------- */

function openModal(html, { wide = false } = {}) {
  const root = document.getElementById('modals');
  root.innerHTML = `<div class="modal-backdrop" data-action="backdrop"><div class="modal${
    wide ? ' wide' : ''
  }" role="dialog" aria-modal="true">${html}</div></div>`;
  document.body.classList.add('modal-open');

  const modal = root.querySelector('.modal');
  window.requestAnimationFrame(() => {
    const first =
      modal.querySelector('[name="title"]') ||
      modal.querySelector(
        'input:not([type="hidden"]):not([type="file"]), textarea, select, button'
      );
    if (first) first.focus();
  });
  return modal;
}

function closeModal() {
  const root = document.getElementById('modals');
  if (!root) return;
  root.innerHTML = '';
  document.body.classList.remove('modal-open');
  activeDetailId = null;
  pendingConfirm = null;
}

function confirmDialog({ title, html, confirmLabel = 'Удалить', danger = true, onConfirm }) {
  pendingConfirm = onConfirm;
  openModal(`
    <div class="modal-head">
      <h2>${esc(title)}</h2>
      <button type="button" class="modal-close" data-action="close-modal" aria-label="Закрыть">${icon(
        'close'
      )}</button>
    </div>
    <p class="muted" style="font-size:.92rem;line-height:1.6">${html}</p>
    <div class="modal-foot">
      <button type="button" class="btn btn-ghost" data-action="close-modal">Отмена</button>
      <button type="button" class="btn ${
        danger ? 'btn-danger' : 'btn-primary'
      }" data-action="confirm-yes">${esc(confirmLabel)}</button>
    </div>
  `);
  const modal = document.querySelector('#modals .modal');
  const btn = modal && modal.querySelector('[data-action="confirm-yes"]');
  if (btn) btn.focus();
}

/* ---------- темы оформления ---------- */

function themeByKey(key) {
  return THEMES.find((theme) => theme.key === key) || THEMES[0];
}

function applyTheme(key, { silent = true } = {}) {
  const theme = themeByKey(key);
  document.documentElement.dataset.theme = theme.key;
  try {
    localStorage.setItem('watchlist-theme', theme.key);
  } catch (err) {
    /* локальное хранилище может быть недоступно */
  }
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', theme.meta);
  if (!silent) toast(`Тема «${theme.name}»`, 'info');
}

function syncThemeCards() {
  const active = document.documentElement.dataset.theme || 'noir';
  $$('.theme-card').forEach((card) => {
    const on = card.dataset.theme === active;
    card.classList.toggle('active', on);
    card.setAttribute('aria-pressed', String(on));
    const tick = card.querySelector('.theme-tick');
    if (tick) tick.innerHTML = on ? icon('check', 14) : '';
  });
}

function openThemesModal() {
  const active = document.documentElement.dataset.theme || 'noir';
  openModal(`
    <div class="modal-head">
      <div>
        <p class="eyebrow">Оформление</p>
        <h2>Тема сайта</h2>
      </div>
      <button type="button" class="modal-close" data-action="close-modal" aria-label="Закрыть">${icon(
        'close'
      )}</button>
    </div>
    <div class="theme-grid">
      ${THEMES.map(
        (theme) => `<button type="button" class="theme-card ${
          theme.key === active ? 'active' : ''
        }" data-action="set-theme" data-theme="${theme.key}" aria-pressed="${
          theme.key === active
        }">
          <span class="theme-swatches">${theme.swatches
            .map((color) => `<span style="background:${color}"></span>`)
            .join('')}</span>
          <span class="theme-copy">
            <strong>${theme.name}</strong>
            <small>${theme.hint}</small>
          </span>
          <span class="theme-tick">${theme.key === active ? icon('check', 14) : ''}</span>
        </button>`
      ).join('')}
    </div>
    <p class="theme-note">Тема сохранится в этом браузере и не изменит ваши доски.</p>
    <div class="modal-foot">
      <button type="button" class="btn btn-primary" data-action="close-modal">Готово</button>
    </div>
  `);
}

/* ---------- шапка ---------- */

function renderHeader() {
  const header = document.getElementById('topbar');
  if (!header) return;
  const user = currentUser;
  const hash = location.hash || '#/';
  const exploreActive = hash.startsWith('#/explore');
  const loginActive = hash.startsWith('#/login');
  const mineActive = !exploreActive && !loginActive;

  header.innerHTML = `
    <div class="topbar-inner">
      <a class="brand" href="#/" aria-label="На главную">
        <span class="brand-mark">${icon('clapper')}</span>
        <span class="brand-text">Что посмотреть</span>
      </a>
      <nav class="main-nav" aria-label="Навигация">
        <a class="nav-link ${mineActive ? 'active' : ''}" href="#/">Мои доски</a>
        <a class="nav-link ${exploreActive ? 'active' : ''}" href="#/explore">Обзор</a>
      </nav>
      <div class="topbar-user">
        <button type="button" class="theme-btn" data-action="open-themes" title="Тема оформления" aria-label="Тема оформления">${icon(
          'palette',
          17
        )}</button>
        ${
          user
            ? `<a class="user-chip" href="#/" title="Мои доски">${avatarHtml(
                user.name
              )}<span class="user-name">${esc(user.name)}</span></a>
               <button type="button" class="btn btn-ghost btn-sm" data-action="logout">Выйти</button>`
            : `<a class="btn btn-primary btn-sm" href="#/login">Войти</a>`
        }
      </div>
    </div>`;
}

/* ---------- экран входа ---------- */

function viewAuth() {
  const isRegister = authMode === 'register';
  return `
  <div class="auth-shell">
    <section class="auth-hero">
      <div class="auth-hero-inner">
        <p class="eyebrow">Твоя личная кинотека</p>
        <h1>Собирай списки.<br>Смотри. <span class="grad-text">Отмечай.</span></h1>
        <p class="lead">Фильмы, сериалы, аниме и мультфильмы в аккуратных досках. Добавляйте постеры и описания, отмечайте просмотренное галочкой и делитесь подборками.</p>
        <ul class="hero-list">
          <li><span class="tick">${icon('check')}</span><span>Личные и публичные доски для любых планов на вечер</span></li>
          <li><span class="tick">${icon('check')}</span><span>Постер, название и описание — всё, чтобы выбрать</span></li>
          <li><span class="tick">${icon('check')}</span><span>Галочка «просмотрено» и наглядный прогресс</span></li>
        </ul>
        <div class="hero-posters" aria-hidden="true">
          <div class="mini-poster"><span>01</span>Кино<br>на вечер</div>
          <div class="mini-poster"><span>02</span>Сериал<br>на выходные</div>
          <div class="mini-poster"><span>03</span>Аниме<br>марафон</div>
          <div class="mini-check">${icon('check')} просмотрено</div>
        </div>
      </div>
    </section>

    <section class="auth-panel">
      <div class="auth-card">
        <div class="tabs" role="tablist">
          <button type="button" class="tab ${!isRegister ? 'active' : ''}" data-action="auth-tab" data-mode="login" role="tab" aria-selected="${!isRegister}">Вход</button>
          <button type="button" class="tab ${isRegister ? 'active' : ''}" data-action="auth-tab" data-mode="register" role="tab" aria-selected="${isRegister}">Регистрация</button>
        </div>
        <form class="auth-form" data-form="auth" data-mode="${authMode}" novalidate>
          <h2>${isRegister ? 'Создать аккаунт' : 'С возвращением 👋'}</h2>
          <p class="muted">${
            isRegister
              ? 'Данные хранятся только в этом браузере — ничего не уходит в сеть.'
              : 'Войдите, чтобы открыть свои доски.'
          }</p>
          <label class="field">
            <span>Имя пользователя</span>
            <input name="username" autocomplete="username" maxlength="24" aria-label="Имя пользователя" placeholder="Например, cinema_lover" required />
          </label>
          <label class="field">
            <span>Пароль</span>
            <span class="password-wrap">
              <input type="password" name="password" autocomplete="${
                isRegister ? 'new-password' : 'current-password'
              }" aria-label="Пароль" placeholder="Минимум 6 символов" required />
              <button type="button" class="eye-btn" data-action="toggle-password" aria-label="Показать пароль">${icon(
                'eye'
              )}</button>
            </span>
          </label>
          ${
            isRegister
              ? `<label class="field">
                   <span>Повторите пароль</span>
                   <input type="password" name="password2" autocomplete="new-password" aria-label="Повторите пароль" placeholder="Ещё раз" required />
                 </label>`
              : ''
          }
          <p class="form-error" data-error role="alert" hidden></p>
          <button type="submit" class="btn btn-primary btn-block">${
            isRegister ? 'Зарегистрироваться' : 'Войти'
          }</button>
          <p class="auth-hint">${
            isRegister
              ? `Уже есть аккаунт? <button type="button" class="link" data-action="auth-tab" data-mode="login">Войти</button>`
              : `Нет аккаунта? <button type="button" class="link" data-action="auth-tab" data-mode="register">Создайте его</button>`
          }</p>
          <div class="auth-explore"><a class="muted-link" href="#/explore">Сначала посмотреть публичные доски →</a></div>
        </form>
      </div>
    </section>
  </div>`;
}

/* ---------- вспомогательные фрагменты ---------- */

function privacyBadge(board) {
  return `<span class="privacy-badge">${
    board.isPublic ? icon('globe', 11) + 'Публичная' : icon('lock', 11) + 'Закрытая'
  }</span>`;
}

function boardCard(board, { showOwner = false } = {}) {
  const counts = Store.countsForBoard(board.id);
  const owner = Store.userById(board.ownerId);
  const pct = counts.total ? Math.round((counts.watched / counts.total) * 100) : 0;
  const covers = counts.covers;
  const cover = covers.length
    ? `<div class="board-cover" style="grid-template-columns:repeat(${covers.length},1fr)">
         ${covers
           .map(
             (src) =>
               `<span class="cover-cell"><img src="${esc(
                 src
               )}" alt="" loading="lazy" onerror="this.remove()" /></span>`
           )
           .join('')}
         ${privacyBadge(board)}
       </div>`
    : `<div class="board-cover empty tone-${tone(board.title)}">
         ${icon('film', 46)}
         ${privacyBadge(board)}
       </div>`;

  return `<a class="board-card" href="#/board/${board.id}">
    ${cover}
    <div class="board-body">
      <h3>${esc(board.title)}</h3>
      <p class="muted">${counts.total} ${plural(
    counts.total,
    'тайтл',
    'тайтла',
    'тайтлов'
  )} · ${counts.watched} просмотрено${
    showOwner && owner ? ` · ${esc(owner.name)}` : ''
  }</p>
      <div class="progress"><span style="width:${pct}%"></span></div>
    </div>
  </a>`;
}

function pageError(title, text, actionsHtml) {
  return `<div class="container page">
    <div class="empty-state" style="margin-top:40px">
      <div class="empty-icon">${icon('lock', 27)}</div>
      <h3>${esc(title)}</h3>
      <p>${esc(text)}</p>
      ${actionsHtml || ''}
    </div>
  </div>`;
}

/* ---------- главная ---------- */

function viewDashboard() {
  const user = currentUser;
  if (!user) return '';
  const boards = Store.boardsForUser(user.id);
  const summary = Store.summaryForUser(user.id);

  return `<div class="container page">
    <section class="page-head">
      <div>
        <p class="eyebrow">Личный кабинет</p>
        <h1>Мои доски</h1>
        <p class="muted">Привет, ${esc(
          user.name
        )}! Собирайте списки и отмечайте просмотренное.</p>
      </div>
      <div class="page-actions">
        <button type="button" class="btn btn-ghost" data-action="import-board">${icon(
          'upload'
        )} Импорт</button>
        <button type="button" class="btn btn-primary" data-action="new-board">${icon(
          'plus'
        )} Новая доска</button>
      </div>
    </section>

    <section class="stats-row">
      <div class="stat-card"><span class="stat-value">${
        summary.boards
      }</span><span class="stat-label">${plural(
    summary.boards,
    'доска',
    'доски',
    'досок'
  )}</span></div>
      <div class="stat-card"><span class="stat-value">${
        summary.items
      }</span><span class="stat-label">${plural(
    summary.items,
    'тайтл в списках',
    'тайтла в списках',
    'тайтлов в списках'
  )}</span></div>
      <div class="stat-card"><span class="stat-value">${
        summary.watched
      }</span><span class="stat-label">просмотрено</span></div>
    </section>

    <div class="section-head">
      <h2>Все доски</h2>
      <span class="muted small">${boards.length} ${plural(
    boards.length,
    'доска',
    'доски',
    'досок'
  )}</span>
    </div>

    ${
      boards.length
        ? `<div class="boards-grid">${boards
            .map((board) => boardCard(board))
            .join('')}</div>`
        : `<div class="empty-state">
             <div class="empty-icon">${icon('clapper', 27)}</div>
             <h3>Здесь появятся ваши доски</h3>
             <p>Создайте первую доску — например, «Посмотреть на выходных» — и добавляйте в неё фильмы, сериалы и аниме с постерами и описаниями.</p>
             <button type="button" class="btn btn-primary" data-action="new-board">${icon(
               'plus'
             )} Создать доску</button>
           </div>`
    }
  </div>`;
}

/* ---------- обзор ---------- */

function viewExplore() {
  const boards = Store.publicBoards();
  return `<div class="container page">
    <section class="page-head">
      <div>
        <p class="eyebrow">Обзор</p>
        <h1>Публичные доски</h1>
        <p class="muted">Подборки, которые пользователи открыли для общего доступа.</p>
      </div>
      ${
        currentUser
          ? `<button type="button" class="btn btn-primary" data-action="new-board">${icon(
              'plus'
            )} Новая доска</button>`
          : `<a class="btn btn-primary" href="#/login">Войти, чтобы создать свою</a>`
      }
    </section>

    ${
      boards.length
        ? `<div class="boards-grid">${boards
            .map((board) => boardCard(board, { showOwner: true }))
            .join('')}</div>`
        : `<div class="empty-state">
             <div class="empty-icon">${icon('globe', 27)}</div>
             <h3>Публичных досок пока нет</h3>
             <p>Откройте свою доску в настройках — переключатель «Публичная доска» — и она появится здесь.</p>
             ${
               currentUser
                 ? `<button type="button" class="btn btn-primary" data-action="new-board">${icon(
                     'plus'
                   )} Создать доску</button>`
                 : `<a class="btn btn-primary" href="#/login">Войти</a>`
             }
           </div>`
    }
  </div>`;
}

/* ---------- доска ---------- */

function viewBoard(board) {
  const canEdit = Boolean(currentUser && board.ownerId === currentUser.id);
  const owner = Store.userById(board.ownerId);
  const counts = Store.countsForBoard(board.id);
  const pct = counts.total ? Math.round((counts.watched / counts.total) * 100) : 0;

  const chips = FILTERS.map((f) => {
    const value =
      f.key === 'all'
        ? counts.total
        : f.key === 'watched'
        ? counts.watched
        : counts.total - counts.watched;
    return `<button type="button" class="seg ${
      boardView.filter === f.key ? 'active' : ''
    }" data-action="set-filter" data-value="${f.key}" id="seg-${
      f.key
    }">${f.label} <span>${value}</span></button>`;
  }).join('');

  return `<div class="container page" data-board-id="${board.id}">
    <a class="back-link" href="${canEdit ? '#/' : '#/explore'}">${icon(
    'arrowLeft',
    15
  )} ${canEdit ? 'Все доски' : 'Обзор'}</a>

    <section class="board-hero">
      <div class="board-hero-row">
        <div style="min-width:0;flex:1">
          <div class="badges">
            <span class="badge">${
              board.isPublic
                ? icon('globe', 12) + 'Публичная доска'
                : icon('lock', 12) + 'Закрытая доска'
            }</span>
            ${
              owner
                ? `<span class="badge owner">${avatarHtml(
                    owner.name
                  )}${esc(owner.name)}</span>`
                : ''
            }
          </div>
          <h1>${esc(board.title)}</h1>
          ${
            board.desc
              ? `<p class="lead">${esc(board.desc)}</p>`
              : `<p class="lead" style="color:var(--muted-2)">Без описания</p>`
          }
          <div class="board-stats">
            <span class="stat-inline"><strong id="statWatched">${
              counts.watched
            }</strong> из <strong id="statTotal">${
    counts.total
  }</strong> просмотрено</span>
            <div class="progress big"><span id="progressFill" style="width:${pct}%"></span></div>
            <span class="stat-pct" id="statPct">${pct}%</span>
          </div>
        </div>
        <div class="board-actions">
          ${
            canEdit
              ? `<button type="button" class="btn btn-primary" data-action="new-item">${icon(
                  'plus'
                )} Добавить тайтл</button>
                 <button type="button" class="btn btn-ghost btn-icon" data-action="edit-board" title="Редактировать доску" aria-label="Редактировать доску">${icon(
                   'pencil'
                 )}</button>
                 <button type="button" class="btn btn-ghost btn-icon" data-action="export-board" title="Скачать доску в JSON" aria-label="Скачать доску">${icon(
                   'download'
                 )}</button>
                 <button type="button" class="btn btn-ghost btn-icon" data-action="delete-board" title="Удалить доску" aria-label="Удалить доску">${icon(
                   'trash'
                 )}</button>`
              : ''
          }
          <button type="button" class="btn btn-ghost btn-icon" data-action="share-board" title="Скопировать ссылку" aria-label="Скопировать ссылку">${icon(
            'link'
          )}</button>
        </div>
      </div>
    </section>

    <div class="toolbar">
      <label class="search-wrap">${icon('search')}<input id="boardSearch" type="search" placeholder="Поиск по названию или описанию" value="${esc(
        boardView.q
      )}" autocomplete="off" /></label>
      <div class="segmented" role="group" aria-label="Фильтр">${chips}</div>
      <select class="select" id="boardSort" aria-label="Сортировка">
        ${SORTS.map(
          (s) =>
            `<option value="${s.key}" ${
              boardView.sort === s.key ? 'selected' : ''
            }>${s.label}</option>`
        ).join('')}
      </select>
    </div>

    <div class="items-grid" id="itemsGrid" data-board="${board.id}"></div>
  </div>`;
}

/* ---------- карточка тайтла ---------- */

function itemCard(item, canEdit) {
  const type = TYPES[item.type] || TYPES.other;
  const watched = Boolean(item.watched);

  return `<article class="item-card ${watched ? 'is-watched' : ''}" data-action="open-item" data-id="${
    item.id
  }" tabindex="0" role="button" aria-label="${esc(item.title)}">
    <div class="item-poster${item.image ? ' has-image' : ''}">
      <div class="poster-fallback tone-${tone(item.title)}">${
    item.image ? esc(initials(item.title)) : icon('film')
  }</div>
      ${
        item.image
          ? `<img src="${esc(item.image)}" alt="Постер: ${esc(
              item.title
            )}" loading="lazy" onerror="this.style.display='none'" />`
          : ''
      }
      ${
        canEdit
          ? `<button type="button" class="check-btn ${
              watched ? 'on' : ''
            }" data-action="toggle-watched" data-id="${item.id}" title="${
              watched ? 'Снять отметку' : 'Отметить просмотренным'
            }" aria-label="${
              watched ? 'Снять отметку' : 'Отметить просмотренным'
            }" aria-pressed="${watched}">${icon('check')}</button>`
          : watched
          ? `<span class="check-badge" title="Просмотрено">${icon('check')}</span>`
          : ''
      }
      ${
        watched
          ? `<span class="watched-pill">${icon('check', 11)} Просмотрено</span>`
          : ''
      }
      ${
        canEdit
          ? `<div class="item-tools">
               <button type="button" class="tool" data-action="edit-item" data-id="${
                 item.id
               }" title="Редактировать" aria-label="Редактировать">${icon(
              'pencil',
              15
            )}</button>
               <button type="button" class="tool danger" data-action="delete-item" data-id="${
                 item.id
               }" title="Удалить" aria-label="Удалить">${icon('trash', 15)}</button>
             </div>`
          : ''
      }
    </div>
    <div class="item-info">
      <h3 class="item-title">${esc(item.title)}</h3>
      <p class="item-meta">
        <span class="type-chip tone-${type.tone}">${type.label}</span>
        ${item.year ? `<span>${esc(item.year)}</span>` : ''}
      </p>
      ${item.desc ? `<p class="item-desc">${esc(item.desc)}</p>` : ''}
    </div>
  </article>`;
}

function emptyItems(board, canEdit) {
  const total = Store.itemsForBoard(board.id).length;
  if (!total) {
    return `<div class="empty-state">
      <div class="empty-icon">${icon('film', 27)}</div>
      <h3>В доске пока пусто</h3>
      <p>${
        canEdit
          ? 'Добавьте первый фильм, сериал или аниме — с постером, названием и описанием.'
          : 'Владелец ещё ничего не добавил в эту доску.'
      }</p>
      ${
        canEdit
          ? `<button type="button" class="btn btn-primary" data-action="new-item">${icon(
              'plus'
            )} Добавить тайтл</button>`
          : ''
      }
    </div>`;
  }
  return `<div class="empty-state">
    <div class="empty-icon">${icon('search', 27)}</div>
    <h3>Ничего не найдено</h3>
    <p>Попробуйте изменить запрос или сбросить фильтры.</p>
    <button type="button" class="btn btn-ghost" data-action="reset-filters">Сбросить фильтры</button>
  </div>`;
}

/* ---------- отрисовка сетки тайтлов ---------- */

function renderItemsGrid() {
  const grid = document.getElementById('itemsGrid');
  if (!grid) return;
  const boardId = grid.dataset.board;
  const board = Store.getBoard(boardId);
  if (!board) return;

  const canEdit = Boolean(currentUser && board.ownerId === currentUser.id);
  let items = Store.itemsForBoard(boardId);

  const query = boardView.q.trim().toLowerCase();
  if (query) {
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(query) ||
        (item.desc || '').toLowerCase().includes(query)
    );
  }
  if (boardView.filter === 'watched') items = items.filter((i) => i.watched);
  if (boardView.filter === 'unwatched') items = items.filter((i) => !i.watched);

  switch (boardView.sort) {
    case 'newest':
      items.sort((a, b) => b.createdAt - a.createdAt);
      break;
    case 'oldest':
      items.sort((a, b) => a.createdAt - b.createdAt);
      break;
    case 'az':
      items.sort((a, b) => a.title.localeCompare(b.title, 'ru'));
      break;
    default:
      items.sort((a, b) => {
        if (a.watched !== b.watched) return a.watched ? 1 : -1;
        return b.createdAt - a.createdAt;
      });
  }

  grid.classList.toggle('count-1', items.length === 1);
  grid.innerHTML = items.length
    ? items.map((item) => itemCard(item, canEdit)).join('')
    : emptyItems(board, canEdit);
}

function updateBoardStats(boardId) {
  const board = Store.getBoard(boardId);
  if (!board) return;
  const counts = Store.countsForBoard(boardId);
  const pct = counts.total ? Math.round((counts.watched / counts.total) * 100) : 0;

  setText('statWatched', counts.watched);
  setText('statTotal', counts.total);
  setText('statPct', pct + '%');
  const fill = document.getElementById('progressFill');
  if (fill) fill.style.width = pct + '%';

  const values = {
    all: counts.total,
    unwatched: counts.total - counts.watched,
    watched: counts.watched,
  };
  Object.keys(values).forEach((key) => {
    const chip = document.getElementById(`seg-${key}`);
    const span = chip && chip.querySelector('span');
    if (span) span.textContent = values[key];
  });
}

/* ---------- модальное окно доски ---------- */

function openBoardModal(board = null) {
  const isEdit = Boolean(board);
  openModal(`
    <div class="modal-head">
      <h2>${isEdit ? 'Редактировать доску' : 'Новая доска'}</h2>
      <button type="button" class="modal-close" data-action="close-modal" aria-label="Закрыть">${icon(
        'close'
      )}</button>
    </div>
    <form data-form="board" data-id="${board ? board.id : ''}">
      <label class="field">
        <span>Название</span>
        <input name="title" maxlength="80" required placeholder="Например, «Посмотреть на выходных»" value="${esc(
          board ? board.title : ''
        )}" />
      </label>
      <label class="field">
        <span>Описание <em>необязательно</em></span>
        <textarea name="desc" rows="3" maxlength="600" placeholder="Пара слов о подборке">${esc(
          board ? board.desc : ''
        )}</textarea>
      </label>
      <label class="switch-row">
        <span class="switch">
          <input type="checkbox" name="isPublic" ${board && board.isPublic ? 'checked' : ''} />
          <span class="slider"></span>
        </span>
        <span>
          <strong>Публичная доска</strong>
          <small>Открытую доску увидят другие пользователи в разделе «Обзор». Закрытую видите только вы.</small>
        </span>
      </label>
      <p class="form-error" data-error role="alert" hidden></p>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" data-action="close-modal">Отмена</button>
        <button type="submit" class="btn btn-primary">${
          isEdit ? 'Сохранить' : 'Создать доску'
        }</button>
      </div>
    </form>
  `);
}

/* ---------- модальное окно тайтла ---------- */

function typeOptions(selected) {
  return Object.entries(TYPES)
    .map(
      ([key, type]) =>
        `<option value="${key}" ${
          key === selected ? 'selected' : ''
        }>${type.label}</option>`
    )
    .join('');
}

function openItemModal(boardId, item = null) {
  const isEdit = Boolean(item);
  const image = item ? item.image : '';

  openModal(`
    <div class="modal-head">
      <h2>${isEdit ? 'Редактировать тайтл' : 'Добавить тайтл'}</h2>
      <button type="button" class="modal-close" data-action="close-modal" aria-label="Закрыть">${icon(
        'close'
      )}</button>
    </div>
    <form data-form="item" data-board="${boardId}" data-id="${item ? item.id : ''}">
      <div class="item-form-grid">
        <div class="poster-picker">
          <div class="poster-preview" id="posterPreview"></div>
          <label class="btn btn-ghost btn-sm file-btn">${icon(
            'image',
            15
          )} Загрузить<input type="file" id="posterFile" accept="image/*" /></label>
          <input class="poster-url" id="posterUrl" type="url" placeholder="или ссылка на фото" value="${
            image && /^https?:\/\//i.test(image) ? esc(image) : ''
          }" />
          <button type="button" class="btn btn-ghost btn-sm hidden" id="posterRemove">Убрать фото</button>
          <p class="tiny muted" style="text-align:center">JPG, PNG, WEBP · до 15 МБ</p>
        </div>
        <div class="item-fields">
          <label class="field">
            <span>Название</span>
            <input name="title" maxlength="120" required placeholder="Например, «Дюна»" value="${esc(
              item ? item.title : ''
            )}" />
          </label>
          <div class="field-row">
            <label class="field">
              <span>Тип</span>
              <select name="type">${typeOptions(item ? item.type : 'movie')}</select>
            </label>
            <label class="field">
              <span>Год</span>
              <input name="year" inputmode="numeric" maxlength="4" placeholder="2024" value="${esc(
                item ? item.year : ''
              )}" />
            </label>
          </div>
          <label class="field">
            <span>Описание <em>необязательно</em></span>
            <textarea name="desc" rows="4" maxlength="2000" placeholder="О чём это и почему стоит посмотреть">${esc(
              item ? item.desc : ''
            )}</textarea>
          </label>
          <input type="hidden" name="image" id="imageValue" value="${esc(image)}" />
        </div>
      </div>
      <p class="form-error" data-error role="alert" hidden></p>
      <div class="modal-foot">
        <button type="button" class="btn btn-ghost" data-action="close-modal">Отмена</button>
        <button type="submit" class="btn btn-primary">${
          isEdit ? 'Сохранить' : 'Добавить в доску'
        }</button>
      </div>
    </form>
  `);

  mountPosterPicker(image);
}

function mountPosterPicker(initialValue) {
  const preview = document.getElementById('posterPreview');
  const hidden = document.getElementById('imageValue');
  const file = document.getElementById('posterFile');
  const urlInput = document.getElementById('posterUrl');
  const removeBtn = document.getElementById('posterRemove');
  if (!preview || !hidden || !file) return;

  let value = initialValue || '';

  const render = () => {
    hidden.value = value;
    if (value) {
      preview.innerHTML = `<img src="${esc(
        value
      )}" alt="Предпросмотр постера" onerror="this.style.opacity='0'" />`;
    } else {
      preview.innerHTML = `<div class="ph">${icon('image', 26)}<span>Перетащите постер<br />или выберите файл</span></div>`;
    }
    if (removeBtn) removeBtn.classList.toggle('hidden', !value);
  };

  const apply = (next, syncUrl) => {
    value = next || '';
    if (urlInput) {
      if (/^https?:\/\//i.test(value)) urlInput.value = value;
      else if (syncUrl) urlInput.value = '';
    }
    render();
  };

  file.addEventListener('change', async () => {
    const selected = file.files && file.files[0];
    if (!selected) return;
    if (!/^image\//.test(selected.type)) {
      toast('Нужен файл изображения: JPG, PNG или WEBP', 'error');
      file.value = '';
      return;
    }
    if (selected.size > 15 * 1024 * 1024) {
      toast('Файл больше 15 МБ — выберите изображение поменьше', 'error');
      file.value = '';
      return;
    }
    try {
      const dataUrl = await shrinkImage(selected);
      apply(dataUrl, true);
    } catch (err) {
      toast('Не удалось обработать изображение', 'error');
    } finally {
      file.value = '';
    }
  });

  if (urlInput) {
    urlInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        urlInput.blur();
        urlInput.dispatchEvent(new Event('change'));
      }
    });
    urlInput.addEventListener('change', () => {
      const src = urlInput.value.trim();
      if (!src) {
        apply('', false);
        return;
      }
      if (!/^https?:\/\/\S+$/i.test(src)) {
        toast('Ссылка должна начинаться с http:// или https://', 'error');
        return;
      }
      apply(src, false);
    });
  }

  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      apply('', true);
      if (file) file.value = '';
    });
  }

  preview.addEventListener('dragover', (event) => {
    event.preventDefault();
    preview.classList.add('dragover');
  });
  preview.addEventListener('dragleave', () => preview.classList.remove('dragover'));
  preview.addEventListener('drop', async (event) => {
    event.preventDefault();
    preview.classList.remove('dragover');
    const dropped = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
    if (!dropped || !/^image\//.test(dropped.type)) return;
    if (dropped.size > 15 * 1024 * 1024) {
      toast('Файл больше 15 МБ — выберите изображение поменьше', 'error');
      return;
    }
    try {
      apply(await shrinkImage(dropped), true);
    } catch (err) {
      toast('Не удалось обработать изображение', 'error');
    }
  });

  render();
}

function shrinkImage(file, maxSide = 900, quality = 0.86) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('read'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('decode'));
      img.onload = () => {
        try {
          const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
          const width = Math.max(1, Math.round(img.naturalWidth * scale));
          const height = Math.max(1, Math.round(img.naturalHeight * scale));
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = '#101019';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (err) {
          reject(err);
        }
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

/* ---------- детали тайтла ---------- */

function openItemDetail(itemId) {
  const item = Store.itemById(itemId);
  if (!item) return;
  const board = Store.getBoard(item.boardId);
  if (!board) return;
  const canEdit = Boolean(currentUser && board.ownerId === currentUser.id);
  const type = TYPES[item.type] || TYPES.other;

  openModal(
    `
    <button type="button" class="modal-close" style="position:absolute;top:18px;right:18px;z-index:3" data-action="close-modal" aria-label="Закрыть">${icon(
      'close'
    )}</button>
    <div class="detail">
      <div class="detail-poster${item.image ? ' has-image' : ''}">
        <div class="poster-fallback tone-${tone(item.title)}">${
      item.image ? esc(initials(item.title)) : icon('film')
    }</div>
        ${
          item.image
            ? `<img src="${esc(item.image)}" alt="Постер: ${esc(
                item.title
              )}" onerror="this.style.display='none'" />`
            : ''
        }
      </div>
      <div class="detail-body">
        <div class="detail-top">
          <span class="type-chip tone-${type.tone}">${type.label}</span>
          ${item.year ? `<span>${esc(item.year)}</span>` : ''}
          ${
            item.watched
              ? `<span class="type-chip is-watched-chip">${icon(
                  'check',
                  11
                )} Просмотрено</span>`
              : ''
          }
        </div>
        <h2>${esc(item.title)}</h2>
        <p class="detail-desc ${item.desc ? '' : 'empty'}">${
      item.desc ? esc(item.desc) : 'Описание не добавлено.'
    }</p>
        ${
          canEdit
            ? `<div class="detail-actions">
                 <button type="button" class="btn ${
                   item.watched ? 'btn-ghost' : 'btn-primary'
                 }" data-action="toggle-watched" data-id="${item.id}" data-modal="1">${icon(
                'check',
                15
              )} ${item.watched ? 'Снять отметку' : 'Отметить просмотренным'}</button>
                 <button type="button" class="btn btn-ghost" data-action="edit-item" data-id="${item.id}">${icon(
                'pencil',
                15
              )} Изменить</button>
                 <button type="button" class="btn btn-ghost" data-action="delete-item" data-id="${item.id}">${icon(
                'trash',
                15
              )} Удалить</button>
               </div>`
            : ''
        }
        <div class="detail-meta">
          <span>Добавлено ${relTime(item.createdAt)}</span>
          ${item.watchedAt ? `<span>· Просмотрено ${relTime(item.watchedAt)}</span>` : ''}
        </div>
      </div>
    </div>
  `,
    { wide: true }
  );

  activeDetailId = item.id;
}

/* ---------- действия с досками и тайтлами ---------- */

async function handleBoardForm(form) {
  const errorEl = form.querySelector('[data-error]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const id = form.dataset.id;
  const data = new FormData(form);
  const payload = {
    title: String(data.get('title') || ''),
    desc: String(data.get('desc') || ''),
    isPublic: data.get('isPublic') === 'on',
  };

  if (errorEl) errorEl.hidden = true;
  if (submitBtn) submitBtn.disabled = true;

  try {
    if (id) {
      await Store.updateBoard(id, payload);
      closeModal();
      toast('Доска обновлена');
      route();
    } else {
      const board = await Store.createBoard(payload);
      closeModal();
      toast('Доска создана');
      navigate('#/board/' + board.id);
    }
  } catch (err) {
    showFormError(errorEl, err);
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

async function handleItemForm(form) {
  const errorEl = form.querySelector('[data-error]');
  const submitBtn = form.querySelector('button[type="submit"]');
  const id = form.dataset.id;
  const boardId = form.dataset.board;
  const data = new FormData(form);
  const payload = {
    title: String(data.get('title') || ''),
    type: String(data.get('type') || 'other'),
    year: String(data.get('year') || ''),
    desc: String(data.get('desc') || ''),
    image: String(data.get('image') || ''),
  };

  if (errorEl) errorEl.hidden = true;
  if (submitBtn) submitBtn.disabled = true;

  try {
    if (id) {
      await Store.updateItem(id, payload);
      closeModal();
      toast('Тайтл обновлён');
      if (boardId === activeBoardId) route();
      else navigate('#/board/' + boardId);
    } else {
      await Store.addItem(boardId, payload);
      closeModal();
      toast('Добавлено в доску');
      route();
    }
  } catch (err) {
    showFormError(errorEl, err);
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

function showFormError(element, err) {
  const message = err && err.message ? err.message : 'Что-то пошло не так';
  if (element) {
    element.hidden = false;
    element.textContent = message;
  } else {
    toast(message, 'error');
  }
}

function confirmDeleteBoard(board) {
  const counts = Store.countsForBoard(board.id);
  confirmDialog({
    title: 'Удалить доску?',
    html: `Доска «${esc(board.title)}» и ${counts.total} ${plural(
      counts.total,
      'тайтл',
      'тайтла',
      'тайтлов'
    )} внутри будут удалены безвозвратно.`,
    confirmLabel: 'Удалить доску',
    onConfirm: async () => {
      await Store.deleteBoard(board.id);
      lastBoardId = null;
      toast('Доска удалена');
      navigate('#/');
    },
  });
}

function confirmDeleteItem(item) {
  confirmDialog({
    title: 'Удалить тайтл?',
    html: `«${esc(item.title)}» исчезнет из доски. Это действие нельзя отменить.`,
    confirmLabel: 'Удалить',
    onConfirm: async () => {
      await Store.deleteItem(item.id);
      toast('Тайтл удалён');
      route();
    },
  });
}

async function toggleWatched(itemId, fromModal) {
  try {
    const item = await Store.toggleWatched(itemId);
    updateBoardStats(item.boardId);
    renderItemsGrid();
    if (fromModal) openItemDetail(itemId);
    if (!fromModal) {
      const next = document.querySelector(`.check-btn[data-id="${itemId}"]`);
      if (next) next.focus({ preventScroll: true });
    }
    toast(item.watched ? 'Отмечено как просмотренное' : 'Отметка снята');
  } catch (err) {
    toast(err.message || 'Не получилось обновить отметку', 'error');
  }
}

function downloadBoard(board) {
  try {
    const payload = Store.exportBoard(board.id);
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const safeTitle = board.title.replace(/[\\/:*?"<>|]+/g, '_').slice(0, 60) || 'board';
    link.download = `${safeTitle}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 2000);
    toast('Файл доски скачан');
  } catch (err) {
    toast(err.message || 'Не удалось скачать доску', 'error');
  }
}

function pickImportFile() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json,application/json';
  input.style.display = 'none';
  document.body.appendChild(input);
  input.addEventListener('change', async () => {
    const file = input.files && input.files[0];
    if (!file) {
      input.remove();
      return;
    }
    try {
      const text = await file.text();
      const payload = JSON.parse(text);
      const board = await Store.importBoard(payload);
      toast('Доска импортирована');
      navigate('#/board/' + board.id);
    } catch (err) {
      toast(
        err && err.message
          ? err.message
          : 'Не получилось прочитать файл. Нужен JSON, скачанный из этого сайта.',
        'error'
      );
    } finally {
      input.remove();
    }
  });
  input.click();
}

async function shareBoard(board) {
  const link = `${location.href.split('#')[0]}#/board/${board.id}`;
  let copied = false;
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(link);
      copied = true;
    }
  } catch (err) {
    copied = false;
  }
  if (!copied) {
    try {
      const area = document.createElement('textarea');
      area.value = link;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
      copied = true;
    } catch (err) {
      copied = false;
    }
  }
  if (copied) {
    toast(
      board.isPublic
        ? 'Ссылка скопирована'
        : 'Ссылка скопирована. Закрытую доску увидите только вы.'
    );
  } else {
    window.prompt('Скопируйте ссылку на доску:', link);
  }
}

/* ---------- маршрутизация ---------- */

async function route() {
  currentUser = Store.currentUser();
  renderHeader();

  const app = document.getElementById('app');
  if (!app) return;
  app.classList.remove('app--auth');
  activeBoardId = null;
  document.title = 'Что посмотреть — заметки о фильмах, сериалах и аниме';

  const parts = (location.hash || '')
    .replace(/^#/, '')
    .split('/')
    .filter(Boolean);

  window.scrollTo(0, 0);

  if (parts.length === 0) {
    if (!currentUser) {
      location.replace('#/login');
      return;
    }
    app.innerHTML = viewDashboard();
    return;
  }

  if (parts[0] === 'login') {
    if (currentUser) {
      location.replace('#/');
      return;
    }
    document.title = 'Вход — Что посмотреть';
    app.classList.add('app--auth');
    app.innerHTML = viewAuth();
    return;
  }

  if (parts[0] === 'explore') {
    document.title = 'Обзор — Что посмотреть';
    app.innerHTML = viewExplore();
    return;
  }

  if (parts[0] === 'board' && parts[1]) {
    const board = Store.getBoard(parts[1]);
    if (!board) {
      app.innerHTML = pageError(
        'Доска не найдена',
        'Возможно, её удалили или ссылка неверна.',
        '<a class="btn btn-primary" href="#/">На главную</a>'
      );
      return;
    }
    const canView = board.isPublic || (currentUser && currentUser.id === board.ownerId);
    if (!canView) {
      app.innerHTML = pageError(
        'Это закрытая доска',
        'Доступ к ней есть только у владельца. Попросите его открыть доску в настройках.',
        `<a class="btn btn-ghost" href="#/explore">К публичным доскам</a>
         ${currentUser ? '' : '<a class="btn btn-primary" href="#/login">Войти</a>'}`
      );
      return;
    }

    if (lastBoardId !== board.id) {
      lastBoardId = board.id;
      boardView = { q: '', filter: 'all', sort: 'unwatched' };
    }

    activeBoardId = board.id;
    document.title = `${board.title} — Что посмотреть`;
    app.innerHTML = viewBoard(board);
    renderItemsGrid();
    return;
  }

  app.innerHTML = pageError(
    'Страница не найдена',
    'Кажется, такой страницы нет. Вернитесь к своим доскам.',
    '<a class="btn btn-primary" href="#/">На главную</a>'
  );
}

/* ---------- обработчики ---------- */

function bindGlobalEvents() {
  document.addEventListener('click', async (event) => {
    const el = event.target.closest('[data-action]');
    if (!el) return;
    const action = el.dataset.action;

    if (action === 'backdrop') {
      if (event.target === el) closeModal();
      return;
    }

    switch (action) {
      case 'auth-tab': {
        authMode = el.dataset.mode === 'register' ? 'register' : 'login';
        route();
        break;
      }

      case 'toggle-password': {
        const wrap = el.closest('.password-wrap');
        const input = wrap && wrap.querySelector('input');
        if (input) {
          const show = input.type === 'password';
          input.type = show ? 'text' : 'password';
          el.innerHTML = icon(show ? 'eyeOff' : 'eye');
          el.setAttribute('aria-label', show ? 'Скрыть пароль' : 'Показать пароль');
        }
        break;
      }

      case 'logout': {
        await Store.logout();
        currentUser = null;
        authMode = 'login';
        closeModal();
        toast('Вы вышли из аккаунта', 'info');
        navigate('#/login');
        break;
      }

      case 'new-board':
        openBoardModal();
        break;

      case 'edit-board': {
        const board = Store.getBoard(activeBoardId);
        if (board) openBoardModal(board);
        break;
      }

      case 'delete-board': {
        const board = Store.getBoard(activeBoardId);
        if (board) confirmDeleteBoard(board);
        break;
      }

      case 'export-board': {
        const board = Store.getBoard(activeBoardId);
        if (board) downloadBoard(board);
        break;
      }

      case 'share-board': {
        const board = Store.getBoard(activeBoardId);
        if (board) await shareBoard(board);
        break;
      }

      case 'new-item': {
        if (!activeBoardId) break;
        const board = Store.getBoard(activeBoardId);
        if (!board) break;
        if (!currentUser || currentUser.id !== board.ownerId) {
          toast('Добавлять тайтлы может только владелец доски', 'error');
          break;
        }
        openItemModal(activeBoardId);
        break;
      }

      case 'edit-item': {
        const item = Store.itemById(el.dataset.id);
        if (!item) break;
        closeModal();
        openItemModal(item.boardId, item);
        break;
      }

      case 'delete-item': {
        const item = Store.itemById(el.dataset.id);
        if (item) confirmDeleteItem(item);
        break;
      }

      case 'open-item':
        openItemDetail(el.dataset.id);
        break;

      case 'toggle-watched': {
        const fromModal = el.dataset.modal === '1' || Boolean(activeDetailId);
        await toggleWatched(el.dataset.id, fromModal);
        break;
      }

      case 'close-modal':
        closeModal();
        break;

      case 'confirm-yes': {
        const callback = pendingConfirm;
        closeModal();
        if (callback) {
          try {
            await callback();
          } catch (err) {
            toast(err.message || 'Ошибка', 'error');
          }
        }
        break;
      }

      case 'import-board':
        pickImportFile();
        break;

      case 'open-themes':
        openThemesModal();
        break;

      case 'set-theme':
        applyTheme(el.dataset.theme);
        syncThemeCards();
        break;

      case 'set-filter':
        boardView.filter = el.dataset.value || 'all';
        $$('.seg').forEach((seg) => {
          seg.classList.toggle('active', seg.dataset.value === boardView.filter);
        });
        renderItemsGrid();
        break;

      case 'reset-filters':
        boardView = { q: '', filter: 'all', sort: 'unwatched' };
        route();
        break;

      case 'open-board':
        navigate('#/board/' + el.dataset.id);
        break;

      default:
        break;
    }
  });

  document.addEventListener('submit', (event) => {
    const form = event.target.closest('form[data-form]');
    if (!form) return;
    event.preventDefault();
    const kind = form.dataset.form;
    if (kind === 'auth') handleAuth(form);
    else if (kind === 'board') handleBoardForm(form);
    else if (kind === 'item') handleItemForm(form);
  });

  document.addEventListener('input', (event) => {
    if (event.target.id === 'boardSearch') {
      boardView.q = event.target.value;
      renderItemsGrid();
    }
  });

  document.addEventListener('change', (event) => {
    if (event.target.id === 'boardSort') {
      boardView.sort = event.target.value;
      renderItemsGrid();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const modals = document.getElementById('modals');
      if (modals && modals.innerHTML.trim()) closeModal();
      return;
    }
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('.item-card[data-action="open-item"]')) {
      event.preventDefault();
      openItemDetail(event.target.dataset.id);
    }
  });

  window.addEventListener('hashchange', route);
}

async function handleAuth(form) {
  const mode = form.dataset.mode;
  const data = new FormData(form);
  const username = String(data.get('username') || '');
  const password = String(data.get('password') || '');
  const password2 = String(data.get('password2') || '');
  const errorEl = form.querySelector('[data-error]');
  const submitBtn = form.querySelector('button[type="submit"]');

  if (errorEl) errorEl.hidden = true;
  if (submitBtn) submitBtn.disabled = true;

  try {
    if (mode === 'register') {
      if (password !== password2) throw new Error('Пароли не совпадают');
      const user = await Store.register(username, password);
      currentUser = Store.currentUser();
      closeModal();
      toast(`Аккаунт создан. Добро пожаловать, ${user.name}!`);
    } else {
      await Store.login(username, password);
      currentUser = Store.currentUser();
      closeModal();
      toast('С возвращением!');
    }
    navigate('#/');
  } catch (err) {
    const message = err && err.message ? err.message : 'Что-то пошло не так';
    if (errorEl) {
      errorEl.hidden = false;
      errorEl.textContent = message;
    } else {
      toast(message, 'error');
    }
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
}

/* ---------- запуск ---------- */

async function boot() {
  let savedTheme = 'noir';
  try {
    savedTheme = localStorage.getItem('watchlist-theme') || 'noir';
  } catch (err) {
    /* ignore */
  }
  applyTheme(savedTheme, { silent: true });

  renderHeader();
  try {
    await Store.init();
  } catch (err) {
    console.error(err);
    document.getElementById('app').innerHTML = pageError(
      'Не удалось загрузить данные',
      'Похоже, браузер блокирует локальное хранилище. Попробуйте открыть сайт в Chrome, Edge или Firefox.',
      ''
    );
    return;
  }

  currentUser = Store.currentUser();
  bindGlobalEvents();

  if (!location.hash) {
    history.replaceState(null, '', '#/');
  }

  if (Store.storageMode() === 'local') {
    toast('Данные хранятся в localStorage — не добавляйте слишком много фото', 'info');
  }

  await route();
}

document.addEventListener('DOMContentLoaded', boot);

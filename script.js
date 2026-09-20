const state = { hp: 100, maxHp: 100, exp: 0, enemyHp: 60, active: true };
const message = document.getElementById('battleMessage');
const hpValue = document.getElementById('hpValue');
const hpFill = document.getElementById('hpFill');
const expValue = document.getElementById('expValue');
const enemyHp = document.getElementById('enemyHp');
const enemyArea = document.getElementById('enemyArea');
const buttons = [...document.querySelectorAll('.action-button')];
const restartButton = document.getElementById('restartButton');

function updateStatus() {
  hpValue.textContent = `${state.hp} / ${state.maxHp}`;
  hpFill.style.width = `${(state.hp / state.maxHp) * 100}%`;
  expValue.textContent = state.exp;
  enemyHp.textContent = `HP ${state.enemyHp}`;
}

function setButtons(enabled) { buttons.forEach((button) => { button.disabled = !enabled; }); }

function enemyTurn() {
  if (!state.active) return;
  const damage = Math.floor(Math.random() * 7) + 6;
  state.hp = Math.max(0, state.hp - damage);
  updateStatus();
  document.querySelector('.hero-area').classList.add('hit');
  setTimeout(() => document.querySelector('.hero-area').classList.remove('hit'), 350);
  if (state.hp === 0) {
    state.active = false;
    message.textContent = 'アカツキは たおれてしまった…… ゲームオーバー';
    setButtons(false);
    restartButton.classList.remove('hidden');
  } else {
    message.textContent = `スライムの反撃！ アカツキは ${damage} のダメージを受けた。`;
    setButtons(true);
  }
}

function perform(action) {
  if (!state.active) return;
  setButtons(false);
  if (action === 'attack') {
    const damage = Math.floor(Math.random() * 8) + 12;
    state.enemyHp = Math.max(0, state.enemyHp - damage);
    updateStatus();
    message.textContent = `アカツキの攻撃！ スライムに ${damage} のダメージ！`;
    enemyArea.classList.add('hit');
    setTimeout(() => enemyArea.classList.remove('hit'), 350);
    if (state.enemyHp === 0) {
      state.active = false;
      state.exp = 10;
      updateStatus();
      enemyArea.classList.add('defeated');
      message.textContent = 'スライムを たおした！ EXPを 10 かくとく！';
      restartButton.textContent = 'もう一度戦う';
      restartButton.classList.remove('hidden');
      return;
    }
  } else if (action === 'heal') {
    const healed = Math.min(20, state.maxHp - state.hp);
    state.hp += healed;
    updateStatus();
    message.textContent = `アカツキは回復した！ HPが ${healed} 回復した。`;
  } else {
    state.active = false;
    message.textContent = 'アカツキは うまく逃げ出した！ また冒険しよう。';
    setButtons(false);
    restartButton.classList.remove('hidden');
    return;
  }
  setTimeout(enemyTurn, 800);
}

document.getElementById('attackButton').addEventListener('click', () => perform('attack'));
document.getElementById('healButton').addEventListener('click', () => perform('heal'));
document.getElementById('runButton').addEventListener('click', () => perform('run'));
restartButton.addEventListener('click', () => window.location.reload());
updateStatus();

var blocks = document.querySelectorAll('.block');
var bars = document.querySelectorAll('.bar');
var upbars = document.querySelectorAll('.upbar');
var downbars = document.querySelectorAll('.downbar');
var bird = document.querySelector('.bird');
var startBtn = document.querySelector('.start');
var end = document.querySelector('.end');
var score = document.querySelector('.score .val');
var again = document.querySelector('.again');
var html = document.documentElement; // 获取html
var ground = document.querySelector('.ground');
var counter = 0; // 计数器
var jumpCount = 0;
var blockInterval = []; // 控制障碍物移动的定时器
var groundInterval; // 控制地面移动的定时器

const areaWidth = 600;
const areaHeight = 400;
const blockWidth = 50;
const blockHeight = areaHeight;
const blockNumber = 3;
const blockGap = 200;
const birdSize = 35;
const barGap = 150;

// 开始按钮 ----> 角色下落 ----> 下落过程需要判断是否失败
startBtn.addEventListener('click', startGame);
again.addEventListener('click', startGame);

function startGame(e) {
  // console.log(e.target.classList);
  // 1. 隐藏 开始或again 的按钮
  if (e.target.classList.contains('start')) {
    e.target.classList.add('hidden');
  } else {
    // console.log(e.target.parentNode);
    e.target.parentNode.classList.remove('show');
  }
  // 2. score 置为 0
  score.innerText = 0;
  counter = 0;
  // 3. 添加 鼠标点击事件，角色跳动
  html.addEventListener('click', birdJump); //  html 的点击事件

  // 4. 移动 block 障碍物
  blocks.forEach((block, i) => {
    // 4.1初始化 block 的位置
    block.style.left = areaWidth + i * blockGap + 'px';
    // 4.2初始化 空隙的位置
    let top = -1 * (Math.random() * (blockHeight - barGap) + barGap); // top : -150 ~ 500
    upbars[i].style.top = top + 'px';
    downbars[i].style.top = top + 'px';
    // 4.3移动 block
    moveBlock(block, i);
  });

  // 5. 模拟角色默认的自由落体
  bird.style.top = 250 + 'px'; // 角色初始位置
  let downInterval = setInterval(function () {
    let birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue('top'));
    bird.style.top = birdTop + 2 + 'px';
    // 下落过程检测是否碰撞;
    if (isCrash()) {
      clearInterval(downInterval);
      lose();
    }
    detectPass();
  }, 10);

  // 6. 移动地面
  moveGround();
}

/**
 * @description: 碰撞检测：检测角色是否碰到柱子
 */
function isCrash() {
  let birdLeft = parseInt(window.getComputedStyle(bird).getPropertyValue('left'));
  let birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue('top'));
  let curIndex = counter % blockNumber;
  let blockLeft = parseInt(window.getComputedStyle(blocks[curIndex]).getPropertyValue('left'));
  let upbarTop = parseInt(window.getComputedStyle(upbars[curIndex]).getPropertyValue('top')) * -1;
  if (birdTop > areaHeight - birdSize) {
    // 1. 角色接触地面
    return true;
  }

  if (birdLeft + birdSize >= blockLeft && birdLeft <= blockLeft + blockWidth) {
    if (birdTop <= areaHeight - upbarTop || birdTop + birdSize >= areaHeight - upbarTop + blockGap) {
      // 2. 角色碰撞障碍物: 水平方向上 用 block 判断, 垂直方向上 用 barTop(负值) 判断
      // console.log('upbarTop', upbarTop);
      // console.log('downbarTop', downbarTop);
      return true;
    }
  }

  // 3. 其他情况：无碰撞
  return false;
}

/**
 * @description: 检测角色是否通过block
 */
function detectPass() {
  let curIndex = counter % blockNumber;
  let blockleft = parseInt(window.getComputedStyle(blocks[curIndex]).getPropertyValue('left'));
  let birdLeft = parseInt(window.getComputedStyle(bird).getPropertyValue('left'));
  if (birdLeft > blockleft + blockWidth) {
    counter++;
    score.innerText = counter;
  }
}

/**
 * @description: 失败后的处理
 */
function lose() {
  html.removeEventListener('click', birdJump); // 移除html的点击事件
  blockInterval.forEach(interval => clearInterval(interval)); // 清除所有block移动的定时器
  clearInterval(groundInterval);
  end.classList.add('show');
}

/**
 * @description: 鼠标点击触发的jump操作
 */
function birdJump() {
  let jumpInterval = setInterval(function () {
    let birdTop = parseInt(window.getComputedStyle(bird).getPropertyValue('top'));
    bird.style.top = parseInt(birdTop) - 5 + 'px';
    // 上升过程检测是否碰撞
    if (isCrash()) {
      clearInterval(downInterval);
      lose();
    }
    detectPass();
    jumpCount++; // 用于限制jump的次数
    if (jumpCount > 20) {
      clearInterval(jumpInterval);
      jumpCount = 0;
    }
  }, 10);
}

/**
 * @description: 移动block（单个）
 */
function moveBlock(block, i) {
  blockInterval[i] = setInterval(function () {
    let blockLeft = parseInt(window.getComputedStyle(block).getPropertyValue('left'));
    block.style.left = blockLeft - 1 + 'px';
    if (parseInt(block.style.left) <= -blockWidth) {
      block.style.left = areaWidth + 'px';
      // 改变 空隙的位置
      let top = -1 * (Math.random() * (blockHeight - barGap) + barGap); // top : -150 ~ 500
      upbars[i].style.top = top + 'px';
      downbars[i].style.top = top + 'px';
    }
  }, 10);
}

// 移动地面
function moveGround() {
  // 6.1 初始化地面的位置
  ground.style.left = 0 + 'px';
  // 6.2 移动地面
  groundInterval = setInterval(function () {
    let groundLeft = parseInt(window.getComputedStyle(ground).getPropertyValue('left'));
    ground.style.left = groundLeft - 1 + 'px';
    if (parseInt(ground.style.left) <= -areaWidth) {
      ground.style.left = 0 + 'px';
    }
  }, 10);
}

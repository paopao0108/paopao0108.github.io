// 声明全局变量
const blockSize = 30;
const colNum = 10;
const rowNum = 18;
const step = blockSize;
// 存储模型
const models = [
  // L型
  {
    0: {
      y: 2,
      x: 0
    },
    1: {
      y: 2,
      x: 1
    },
    2: {
      y: 2,
      x: 2
    },
    3: {
      y: 1,
      x: 2
    }
  },
  // 第二个样式(凸)
  {
    0: {
      y: 1,
      x: 1
    },
    1: {
      y: 0,
      x: 0
    },
    2: {
      y: 1,
      x: 0
    },
    3: {
      y: 2,
      x: 0
    }
  },
  //  第三个样式(田)
  {
    0: {
      y: 1,
      x: 1
    },
    1: {
      y: 2,
      x: 1
    },
    2: {
      y: 1,
      x: 2
    },
    3: {
      y: 2,
      x: 2
    }
  },
  // 第四个样式(一)
  {
    0: {
      y: 0,
      x: 0
    },
    1: {
      y: 0,
      x: 1
    },
    2: {
      y: 0,
      x: 2
    },
    3: {
      y: 0,
      x: 3
    }
  },
  // 第五个样式(Z)
  {
    0: {
      y: 1,
      x: 1
    },
    1: {
      y: 1,
      x: 2
    },
    2: {
      y: 2,
      x: 2
    },
    3: {
      y: 2,
      x: 3
    }
  }
];
let currentModel = models[Math.floor(Math.random() * 5)];

let [currentX, currentY] = [0, 0]; // 16宫格的位置
const blockArr = new Array(rowNum);

const start = document.querySelector('.start');

// const colors = ['#00896F', '#00C0A3', '#845EC2', '#BEA6A0', '#267FB9'];
const colors = ['#2B7AF5', '#2B9DF5'];
const bgColors = ['linear-gradient(to right, #FF8489 0%, #fbb0b3 100%)', 'linear-gradient(to right, #D7749B 0%, #e991b4 100%)', 'linear-gradient(to right, #A46C9F 0%, #d195cc 100%)', 'linear-gradient(to right, #706493 0%, #9081bc 100%)', 'linear-gradient(to right, #FF8359 0%, #f7ab91 100%)', 'linear-gradient(to right, #9BB41E 0%, #d0e46a 100%)', 'linear-gradient(to right, #339E3D 0%, #339E3D 100%)'];

const keys = document.querySelectorAll('.key');
console.log(keys);

// 定时器，自动下落
let timer = null;
start.addEventListener('click', function () {
  start.classList.add('hidden');
  init();
  timer = setInterval(() => {
    moveDown();
  }, 1000);
  document.addEventListener('keydown', move);
  keys.forEach(key => {
    key.addEventListener('click', moveBymouse);
  });
  // document.addEventListener('click', moveBymouse);
});

// 初始化
function init() {
  initBlocks();
  createModel();
}

/**
 * @description: 初始化数组，用于存放固定后的方块
 * @param {*}
 * @return {*}
 */
function initBlocks() {
  for (let i = 0; i < rowNum; i++) {
    blockArr[i] = new Array(colNum);
  }
}

// 创建模型
function createModel() {
  const game = document.querySelector('.game');
  const activeModel = document.createElement('div');
  [currentX, currentY] = [0, 0];
  activeModel.style.top = currentY * blockSize + 'px';
  activeModel.style.left = currentX * blockSize + 'px';
  activeModel.classList.add('model');
  activeModel.classList.add('active-model');
  game.appendChild(activeModel);

  currentModel = models[Math.floor(Math.random() * 5)];
  let bgColor = bgColors[Math.floor(Math.random() * (bgColors.length - 1))]; // 随机获取颜色数组的前length-1种颜色，最后一种颜色作为满行消失的颜色效果
  for (const key in currentModel) {
    const block = document.createElement('div');
    // block.style.backgroundColor = color;
    block.style.backgroundImage = bgColor;
    block.classList.add('block');
    activeModel.appendChild(block);

    block.style.top = currentModel[key].y * blockSize + 'px';
    block.style.left = currentModel[key].x * blockSize + 'px';
  }
}

// 键盘控制移动模型
function move(e) {
  const activeModel = document.querySelector('.active-model');
  switch (e.key) {
    case 'ArrowUp':
      // console.log('space'); // 按下空格键
      rotate();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowLeft':
      if (isCrash(currentX - 1, currentY)) {
        // 检测的是下一个位置是否重叠碰撞
        break;
      }
      currentX--;
      if (isOutBound()) currentX++; // 出界后退 ---> 向右移一步
      console.log('currentX', currentX);
      activeModel.style.left = currentX * blockSize + 'px';

      break;
    case 'ArrowRight':
      if (isCrash(currentX + 1, currentY)) {
        // 检测的是下一个位置是否重叠碰撞
        break;
      }
      currentX++;
      if (isOutBound()) currentX--; // 出界 后退---> 向左移一步
      console.log('currentX', currentX);
      activeModel.style.left = currentX * blockSize + 'px';
      break;
  }
}

function moveBymouse(e) {
  const activeModel = document.querySelector('.active-model');
  console.log(e.target.id);
  let key = e.target.id;
  switch (key) {
    case 'rotate':
      // console.log('space'); // 按下空格键
      rotate();
      break;
    case 'ArrowDown':
      moveDown();
      break;
    case 'ArrowLeft':
      if (isCrash(currentX - 1, currentY)) {
        // 检测的是下一个位置是否重叠碰撞
        break;
      }
      currentX--;
      if (isOutBound()) currentX++; // 出界后退 ---> 向右移一步
      console.log('currentX', currentX);
      activeModel.style.left = currentX * blockSize + 'px';

      break;
    case 'ArrowRight':
      if (isCrash(currentX + 1, currentY)) {
        // 检测的是下一个位置是否重叠碰撞
        break;
      }
      currentX++;
      if (isOutBound()) currentX--; // 出界 后退---> 向左移一步
      console.log('currentX', currentX);
      activeModel.style.left = currentX * blockSize + 'px';
      break;
  }
}

// 鼠标控制移动模型

/**
 * @description: 下落操作
 * @param {*}
 * @return {*}
 */
function moveDown() {
  const activeModel = document.querySelector('.active-model');
  const blocks = document.querySelectorAll('.active-model .block');
  if (isCrash(currentX, currentY + 1)) {
    // 检测的是下一个位置是否重叠碰撞
    fixedModel(currentX, currentY, activeModel, blocks);
    handleFullRow(); // 固定模块后，需要检查是否存在满行并进行处理
    if (isGameover()) {
      GameOver();
      return;
    }
    createModel(); // 固定模块后，需要创建新的模块
    // break;
    return;
  }
  currentY++;
  if (isOutBound()) currentY--; // 出界后退 ---> 向上移一步
  console.log('currentY', currentY);
  activeModel.style.top = currentY * blockSize + 'px';
  if (isToBottom()) {
    fixedModel(currentX, currentY, activeModel, blocks); // 下降到底部时，固定当前模型
    handleFullRow(); // 固定模块后，需要检查是否存在满行并进行处理
    createModel(); // 固定模块后，需要创建新的模块
  }
}

// 旋转模型
function rotate() {
  const temp = _.cloneDeep(currentModel); // 使用lodash中的深拷贝方法;
  for (const key in currentModel) {
    currentModel[key].y = temp[key].x; // 旋转后的行 等于 旋转前的 列
    currentModel[key].x = 3 - temp[key].y; // 旋转后的列 等于 3-旋转前的行
  }

  // if (isOutBound() || isCrash(currentX, currentY)) {
  if (isOutBound() || isCrash(currentX, currentY)) {
    currentModel = _.cloneDeep(temp);
  }

  locBlocks(); // 旋转后重新定位方块
}

// 定位模型中的方块(用于旋转后重新定位模型中的方块位置)
function locBlocks() {
  const blocks = document.querySelectorAll('.active-model .block');
  for (const key in currentModel) {
    blocks[key].style.top = currentModel[key].y * blockSize + 'px';
    blocks[key].style.left = currentModel[key].x * blockSize + 'px';
  }
}

/**
 * @description: 判断当前位置是否出界
 * @param {*}
 * @return {*} 返回boolean值
 */
function isOutBound() {
  for (let key in currentModel) {
    if (currentX + currentModel[key].x === colNum) {
      return true; // 模型中方块移到最右侧时
    }
    if (currentX + currentModel[key].x === -1) {
      return true; // 模型中方块移到最左侧时
    }
    if (currentY + currentModel[key].y === rowNum) {
      return true; // 模型中方块移到最底部时
    }
  }
  return false;
}

/**
 * @description: 模型是否到达底部
 * @param {*}
 * @return {*} 返回boolean值
 */
function isToBottom() {
  for (let key in currentModel) {
    if (currentY + currentModel[key].y === rowNum - 1) return true;
  }
  return false;
}

/**
 * @description: 固定模块
 * @param {*} x 16宫格的水平方向上的位置 currentX
 * @param {*} y 16宫格的垂直方向上的位置 currentY
 * @param {*} activeModel 当前活动的16宫格
 * @param {*} curblocks 当前16宫格中的方块
 * @return {*}
 */
function fixedModel(x, y, activeModel, curblocks) {
  for (let key in currentModel) {
    let _x = y + currentModel[key].y;
    let _y = x + currentModel[key].x;
    // console.log('fixed');
    blockArr[_x][_y] = curblocks[key]; // 将当前位置的块存储
  }
  activeModel.classList.remove('active-model'); // 移除当前模块的类名，停止移动
}

/**
 * @description: 模块之间的碰撞检测
 * @param {*} x 16宫格的横坐标left
 * @param {*} y 16宫格的纵坐标top
 * @return {*}
 */
function isCrash(x, y) {
  for (let key in currentModel) {
    // console.log('xxx', y, currentModel[key].y, x + currentModel[key].x);
    let _x = y + currentModel[key].y;
    let _y = x + currentModel[key].x;
    if (_x < 18 && _y < 10 && blockArr[_x][_y]) return true;
  }
  return false;
}

let fullRow = true;
/**
 * @description: 处理占满一行的情况
 * @param {*}
 * @return {*}
 */
function handleFullRow() {
  let fullrowArr = [];
  for (let i = 0; i < rowNum; i++) {
    fullRow = true;
    for (let j = 0; j < colNum; j++) {
      if (!blockArr[i][j]) {
        fullRow = false;
        continue;
      }
    }
    // console.log('fullRow', fullRow);
    if (fullRow) {
      console.log('=======满行============', i);
      fullrowArr.push(i);
    }
  }
  console.log('待删除的行', fullrowArr);
  clearFullRow(fullrowArr);
}

function clearFullRow(rows) {
  for (let k = 0; k < rows.length; k++) {
    let y = rows[k];
    console.log('处理前的block', _.cloneDeep(blockArr));

    // 1. 添加第y行的消除效果
    for (let x = 0; x < colNum; x++) {
      let elem = blockArr[y][x];
      elem.classList.add('hidden');
      // elem.style.backgroundImage = bgColors[bgColors.length - 1];
      /* 创建碎片 */
      let width = window.getComputedStyle(elem).getPropertyValue('width');
      let height = window.getComputedStyle(elem).getPropertyValue('height');
      let bg = window.getComputedStyle(elem).getPropertyValue('background');
      // 每个块都需要创建碎片,碎片范围在当前块内
      for (let i = 0; i < parseInt(width); i += blockSize / 5) {
        for (let j = 0; j < parseInt(height); j += blockSize / 5) {
          fragment(i, j, bg, elem);
        }
      }
    }

    // 设置定时器的原因：不立即删除元素，为了看到元素满行后的变色效果，且需要等元素删除后才能将方块下移
    setTimeout(() => {
      // 2.删除第y行的元素以及数据
      for (let x = 0; x < colNum; x++) {
        let elem = blockArr[y][x];
        elem.remove(); // 删除元素
        blockArr[y][x] = undefined; // 删除数据
      }
      // 3. 将第y行以上的方块下移一行
      for (let i = y - 1; i >= 0; i--) {
        for (let j = 0; j < colNum; j++) {
          if (blockArr[i][j]) {
            // console.log('待下移的块元素', i, j, blockArr[i][j]);
            let elem = blockArr[i][j];
            elem.style.top = elem.offsetTop + step + 'px';
          }
          blockArr[i + 1][j] = blockArr[i][j];
          // console.log('下移后的块元素', i + 1, j, blockArr[i + 1][j]);
        }
      }
    }, 300);
  }
}

/**
 * @description: 当顶端有方块时即blocksArr[0]有数据时，游戏结束
 * @param {*}
 * @return {*}
 */
function isGameover() {
  console.log('游戏结束时的blockArr', blockArr);
  for (let j = 0; j < colNum; j++) {
    // console.log(blockArr[1][j]);
    if (blockArr[1][j]) {
      return true;
    }
  }
  return false;
}

const end = document.querySelector('.end');

function GameOver() {
  end.classList.add('active');
  clearInterval(timer);
  document.removeEventListener('keydown', move);
}

// 样式美化

/**
 * @description: 生成消除碎片的函数
 * @param {*} top 碎片的top定位
 * @param {*} left 碎片的 left 定位
 * @param {*} width 碎片容器的宽度
 * @param {*} height 碎片容器的高度
 * @param {*} bg 碎片容器的背景
 * @param {*} block 碎片容器
 * @return {*}
 */
function fragment(top, left, bg, block) {
  let minblock = document.createElement('div');
  minblock.style.width = blockSize / 5 + 'px';
  minblock.style.height = blockSize / 5 + 'px';
  minblock.style.position = 'absolute';
  minblock.style.top = top + 'px';
  minblock.style.left = left + 'px';

  minblock.style.background = bg;
  // minblock.style.backgroundSize = width + ' ' + height;
  // minblock.style.backgroundPosition = -left + 'px ' + -top + 'px';

  minblock.style.transform = `scale(${Math.random() * 3})`; //随机缩放
  minblock.style.opacity = Math.random(); // 随机透明度
  // minblock.style.overflow = 'hidden';
  block.appendChild(minblock);

  //生成随机运动方向(-5 ~ 5)
  var h = Math.random() * 10 - 5;
  var l = Math.random() * 10 - 5;

  var disappearTimer = setInterval(function () {
    minblock.style.left = minblock.offsetLeft + l + 'px';
    minblock.style.top = minblock.offsetTop + h + 'px';
    minblock.style.opacity = minblock.style.opacity - 0.1; //每移动一次，透明度降低0.05
    if (minblock.style.opacity <= 0) {
      //完全透明后，碎片被清除
      clearInterval(disappearTimer);
      minblock.remove();
    }
  }, 30);
}

var blockWrap = document.querySelector('.wrap');
var resetBtn = document.querySelector('.reset');
var timer = document.querySelector('.timer .value');
var score = document.querySelector('.success .value');
var success = document.querySelector('.success');

var second = 0; // 计时器秒数
var timerInterval;

const blockWidth = 110; // 一个块的长宽
const blockHeight = 110;

let rowsNumber = 3; // 默认几行几列
let colsNumber = 3;

let blocksNumber = rowsNumber * colsNumber; // 总的块数

var blank = {
  left: 2 * blockWidth, // 空白块的位置
  top: 2 * blockHeight,
  innerText: ''
};

var curBlock = {
  left: 0, // 当前块的位置
  top: 0
};

var blockArr = []; // 默认的数字数组

for (let i = 0; i < blocksNumber; i++) {
  blockArr[i] = i + 1;
}
blockArr[blocksNumber - 1] = 'blank';

// 初始化：让数组乱序

// 将blank移动到数组最后
function removeBlank(blockArr) {
  let blankIndex = blockArr.findIndex(val => val === 'blank');
  blockArr.splice(blankIndex, 1); // 先删除数组里面的blank
}
function addBlank(blockArr) {
  blockArr.push('blank'); // 再在末尾添加 blank
}

// 打乱数组
const shuffle = arr => arr.sort(() => 0.5 - Math.random());

// 计算逆序数对 函数
function InversePairs(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    let curNum = arr[i];
    for (let j = i + 1; j < arr.length; j++) {
      if (curNum > arr[j]) {
        count++;
      }
    }
  }
  return count;
}

// const InversePairs = data => {
//   let num = 0;
//   // write code here
//   function mergeSort(arr) {
//     if (arr.length == 1) {
//       return arr;
//     }
//     var mid = Math.floor(arr.length / 2);
//     var left_arr = arr.slice(0, mid),
//       right_arr = arr.slice(mid);
//     return merge(mergeSort(left_arr), mergeSort(right_arr));
//   }
//   /**
//    * 方法2:采用归并排序，假设有顺序数组 A 和 B ，A 在 B 的前面。
//    * 那么如果有A的第i个数字比B的第j个数字大，则有i后面的数字都
//    * 比B的第j个数字大，可以组成A.length-i个逆序对。
//    */
//   function merge(left, right) {
//     var result = [];
//     while (left.length > 0 && right.length > 0) {
//       if (left[0] < right[0]) {
//         result.push(left.shift());
//       } else {
//         num += left.length;
//         result.push(right.shift());
//       }
//     }
//     /* 当左右数组长度不等.将比较完后剩下的数组项链接起来即可 */
//     return result.concat(left).concat(right);
//   }
//   mergeSort(data);
//   // return num % 1000000007;
//   return num;
// };

// 打乱 所有的block 并保证 空方块 在最后
function shuffleBlock() {
  console.log('==========打乱==========');
  removeBlank(blockArr);
  console.log('移除blank', blockArr);
  shuffle(blockArr);
  console.log('打乱blank1', blockArr);

  while (InversePairs(blockArr) % 2 !== 0 || InversePairs(blockArr) === 0) {
    // 当逆序数对为奇数时无解，需重排至逆序数对为偶数; 当逆序数为0时，是正确顺序，需重排
    shuffle(blockArr);
  }
  console.log('打乱blank2', blockArr);

  addBlank(blockArr);
  console.log('打乱后blockArr', blockArr);
}

// 初始化：创建方块，并为每个方块添加对应的数字（乱序）
function createBlock() {
  for (let i = 0; i < blocksNumber; i++) {
    let block = document.createElement('li');
    block.classList.add('block');

    if (blockArr[i] === 'blank') {
      block.classList.add('blank');
      block.innerText = 'blank'; // // 最后一个块 需添加一个类名 且 没有值
    } else {
      block.classList.add('fragment');
      block.innerText = blockArr[i];
    }
    blockWrap.append(block);
  }
}

// 判断是否可以交换位置
function isChangeposition(fragment, i) {
  let fragmentLeft = parseInt(window.getComputedStyle(fragment).getPropertyValue('left'));
  let fragmentTop = parseInt(window.getComputedStyle(fragment).getPropertyValue('top'));
  let blankTop = parseInt(window.getComputedStyle(blank).getPropertyValue('top'));
  let blankLeft = parseInt(window.getComputedStyle(blank).getPropertyValue('left'));

  curBlock.left = fragmentLeft;
  curBlock.top = fragmentTop;

  let arrIndex, blankIndex;
  arrIndex = (fragmentTop / blockHeight) * rowsNumber + fragmentLeft / blockWidth; // 当前块对应的数组索引
  blankIndex = (blankTop / blockHeight) * rowsNumber + blankLeft / blockWidth;

  if (fragmentLeft === blankLeft && Math.abs(fragmentTop - blankTop) === blockHeight) {
    // 处在同一列上 且相邻
    fragment.style.top = blankTop + 'px'; // 交换当前块和空白块的位置
    blank.style.top = curBlock.top + 'px';
    exchange(blockArr, arrIndex, blankIndex); // 交换当前块与空白块在数组中对应位置的元素
  } else if (fragmentTop === blankTop && Math.abs(fragmentLeft - blankLeft) === blockWidth) {
    // 处在同一行上 且相邻
    fragment.style.left = blankLeft + 'px';
    blank.style.left = curBlock.left + 'px';
    exchange(blockArr, arrIndex, blankIndex); // 交换当前块与空白块在数组中对应位置的元素
  }
}

function isCorrectposition() {
  for (let i = 0; i < blocksNumber - 1; i++) {
    if (blockArr[i] !== 'block') {
      // 不是空白块
      if (blockArr[i] !== i + 1) {
        // 出现第一个顺序不一致，直接返回
        return false;
      }
    }
  }
  return true;
}

function exchange(arr, a, b) {
  let tmp = arr[a];
  arr[a] = arr[b];
  arr[b] = tmp;
}

// 重置操作
function reset() {
  clearInterval(timerInterval);
  second = 0;
  timer.innerText = second;
  timerInterval = setInterval(function () {
    second++;
    timer.innerText = second;
  }, 1000);
  shuffleBlock();
}

reset();
createBlock();

// 监听方块点击事件：1 判断是否可交换 2 交换后是否为正确顺序
var blocks = document.querySelectorAll('.block');
var blank = document.querySelector('.blank');
var fragments = document.querySelectorAll('.fragment');

fragments.forEach((fragment, i) => {
  fragment.addEventListener('click', function (e) {
    // 移动方块
    isChangeposition(fragment, i);
    // 判断是否为正确位置
    console.log(blockArr);
    if (isCorrectposition()) {
      clearInterval(timerInterval);
      score.innerText = second;
      success.classList.add('active');
    }
  });
});

resetBtn.addEventListener('click', function () {
  // 强制刷新页面
  location.reload();
});

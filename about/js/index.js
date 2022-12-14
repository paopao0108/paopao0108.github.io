var openMenu = document.querySelector('.open-menu-button');
let closeMenu = document.querySelector('.close-menu-button');
let mainNav = document.querySelector('.main-nav');
let navLinkBtns = document.querySelectorAll('.main-nav .item .link');

// console.log('navLinkBtn', navLinkBtn);

openMenu.addEventListener('click', () => {
  mainNav.classList.add('-active');
});

closeMenu.addEventListener('click', () => {
  mainNav.classList.remove('-active');
});

navLinkBtns.forEach(btn => {
  btn.addEventListener('click', function () {
    // 移除导航栏按钮所有的active类
    navLinkBtns.forEach(item => item.classList.remove('-active'));
    // 为当前按钮添加active类
    this.classList.add('-active');
  });
});

/* Skill */
let skillButtons = document.querySelectorAll('.skill-button');
// let skillContent = document.querySelector('.skill-content');
skillButtons.forEach(button => {
  button.addEventListener('click', function () {
    // 注意回调函数不能写箭头函数，会改变this的指向
    // console.log(this);
    this.classList.toggle('-active');
  });
});

/* Qualification */
let qualificationButtons = document.querySelectorAll('.qualification-button');
let qualificationcontents = document.querySelectorAll('.qualification-content');
qualificationButtons.forEach((button, index) => {
  button.addEventListener('click', function (e) {
    // 组织a链接默认的跳转行为
    e.preventDefault();
    // 移除所有qualificationButtons、 qualificationcontents 的 -active 类
    qualificationButtons.forEach(button => button.classList.remove('-active'));
    qualificationcontents.forEach(content => content.classList.remove('-active'));
    // 为当前的按钮添加active
    this.classList.add('-active');
    // 为当前按钮对应的内容添加 active
    qualificationcontents[index].classList.add('-active');
  });
});

/* Service */

/* Scroll事件 会触发两件事：
  1. 回到顶部按钮的显示隐藏
  2. 头部导航栏的 边框阴影的显示隐藏
*/
let toTopBtn = document.querySelector('.btn-totop');
let header = document.querySelector('.header');
// 监听页面的滚动事件
window.addEventListener('scroll', function () {
  if (this.scrollY >= 550) {
    toTopBtn.classList.add('-visible');
  } else {
    toTopBtn.classList.remove('-visible');
  }
  if (this.scrollY >= 50) {
    header.classList.add('-scroll');
  } else {
    header.classList.remove('-scroll');
  }
});

/* 主体切换：dark-mode light-mode */
let themeBtn = document.querySelector('.theme-button');
let darkMode = document.querySelector('.dark-mode');
let lightMode = document.querySelector('.light-mode');
let body = document.body;
let themeActive = window.localStorage.getItem('theme');
console.log(themeBtn);
themeBtn.addEventListener('click', function () {
  let themeActive = window.localStorage.getItem('theme');
  console.log(themeActive);
  let dark = this.classList.contains('-dark-mode');
  // console.log(dark);
  if (!dark) {
    // 若不是 dark 模式，点击后需要切换为dark模式
    this.classList.add('-dark-mode');
    body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark');
  } else {
    this.classList.remove('-dark-mode');
    body.classList.remove('dark-theme');
    localStorage.setItem('theme', 'light');
  }
});

/* 作品Start */
// 筛选展示作品
let categories = document.querySelectorAll('.demo-category .category');
let originalProjs = document.querySelectorAll('.demo-list .original');
let vueProjs = document.querySelectorAll('.demo-list .vue');
let allProjs = document.querySelectorAll('.demo-list .item');
categories.forEach(item => {
  item.addEventListener('click', function () {
    // 先移除所有的active类
    for (let i = 0; i < categories.length; i++) {
      if (categories[i].classList.contains('-active')) {
        categories[i].classList.remove('-active');
        break;
      }
    }
    // 为当前类添加active类
    item.classList.add('-active');
    // 先隐藏所有
    allProjs.forEach(item => (item.style.display = 'none'));
    // 再显示当前分类所属
    if (item.classList.contains('part1')) {
      originalProjs.forEach(item => (item.style.display = 'block'));
    } else if (item.classList.contains('part2')) {
      vueProjs.forEach(item => (item.style.display = 'block'));
    } else if (item.classList.contains('all')) {
      allProjs.forEach(item => (item.style.display = 'block'));
    }
  });
});
/* 作品End */

/* portfolio-carousel */
const portfolioCarousel = document.querySelector('.portfolio-carousel');
new Glide(portfolioCarousel, {
  type: 'carousel',
  gap: 0, // A size of the space between slides
  startAt: 0, // Start at specific slide number
  perView: 1, // 播放时可以看到的数量，一般情况下都是1 A number of visible slides
  autoplay: 5000, // Change slides after a specified interval,此处时1s后播放下一张
  hoverpause: true, // 悬停：鼠标移上去，会停止动画
  animationDuration: 1000 // Duration of the animation动画的持续时间
  // focusAt: 'center'
}).mount();

const testimonialCarousel = document.querySelector('.testimonial-carousel');
new Glide(testimonialCarousel, {
  type: 'carousel',
  gap: 30, // A size of the space between slides
  startAt: 0, // Start at specific slide number
  perView: 2, // 播放时可以看到的数量，一般情况下都是1 A number of visible slides
  autoplay: 2000, // Change slides after a specified interval,此处时1s后播放下一张
  hoverpause: true, // 悬停：鼠标移上去，会停止动画
  animationDuration: 1000, // Duration of the animation动画的持续时间
  breakpoints: {
    // 在 610px 以下的屏幕中
    610: {
      gap: 20,
      perView: 1
    },
    // 在 610px - 992px 大小之间的屏幕中
    992: {
      gap: 60,
      perView: 1,
      peek: {
        before: 200,
        after: 200
      }
    }
    // breakpoints 外面设置的就是在 992px 以上的屏幕中
  }
}).mount();

/* 解决手机微信video视频无法播放的问题 */
videos = document.querySelectorAll('video');
document.addEventListener(
  'WeixinJSBridgeReady',
  function () {
    videos.forEach(video => {
      video.play();
      // video.pause();
    });
  },
  false
);

const avalHeight = window.innerHeight;
const arrAllY = [];
const arrAllel = [];
const elemNav = document.querySelector('#Nav');
const elemAnimate = document.querySelectorAll('#MainBody > .animate, #MainFoot .animate ');
const elemCountLs = document.querySelector('#CountLs');
const elemModal = document.querySelector('#Modal');
const countDown = setInterval(setTimer, 1000);
const elemFinishNum = document.querySelector('#FinishNum');
const elemTransPercent = document.querySelector('#TransPercent');
const elemFrontedPercent = document.querySelector('#FrontedPercent');
const elemToTop = document.querySelector('#ToTop');
const elemHeaderBarWrap = document.querySelector('.header__barWrap');
let animateIndex = 0;
let levels = 3;
let data = [];
setInit();
setEvent();
async function setInit() {
  await getData();
  render();
  setArrs();
}
async function getData() {
  const api = './data/activity.json'
  let res = await fetch(api);
  data = await res.json();
}
function render() {
  hasQuota();
  elemCountLs.innerHTML = setProgressStr();
  let barWidth = setBarWidth();
  elemCountLs.querySelectorAll('.progress').forEach((item, index) => {
    item.style.width = index === 0
      ? `${calcRange(0)}%`
      : `${calcRange(index) - calcRange(index - 1)}%`
    barWidth[index] === 1
      ? item.classList.add('js-progress')
      : item.querySelector('.progress__bar').style.width = `${barWidth[index] * 100}%`;
  });
}
// 擷取動畫元素及高度 
function setArrs() {
  elemAnimate.forEach((e) => {
    const elAnimateTitle = e.querySelector('.animate__title')
    arrAllY.push(elAnimateTitle.offsetTop);
    arrAllel.push(elAnimateTitle);
    e.querySelectorAll('.animate__item').forEach(el => {
      arrAllY.push(el.offsetTop);
      arrAllel.push(el);
    });
  })
}
// 產生進度條模板  
function setProgressStr(str = '') {
  for (let i = 0; i < levels; i += 1) {
    str +=
      `<li class="progress">
          <p class="progress__head">達 ${data.list[i].level} 人</p>
          <p class="progress__bar"></p>
          ${i === 0 ? '<p class="progress__begin">預備開始</p>' : ''}
          <p class="progress__foot">送 ${data.list[i].productName}</p>
        </li>`;
  }
  return str;
}
// 產生進度條長度
function setBarWidth() {
  let widthArr = [];
  let prevRange = 0;
  for (let i = 0; i < levels; i += 1) {
    i - 1 < 0 ? prevRange = 0 : prevRange = i - 1;
    data.personNum >= calcRange(i)
      ? widthArr.push(1)
      : widthArr.push(i === 0
        ? Math.abs(data.personNum / calcRange(i))
        : (data.personNum - calcRange(prevRange)) / calcRange(i)
      )
  }
  return widthArr;
}
// 計算進度條各段級距
function calcRange(order) {
  return range = data.list[order].level;
}
// 設定活動定時器 
function setTimer() {
  let date = [];
  const elemDate = document.querySelector('.count__date');
  let remaining = ExceedDeadLine()
  if (remaining > 0) {
    date.push(
      Math.floor((remaining / 1000) % 60),
      Math.floor((remaining / 1000 / 60) % 60),
      Math.floor((remaining / (1000 * 60 * 60)) % 24),
      Math.floor(remaining / (1000 * 60 * 60 * 24))
    );
    date.forEach((item, i) => {
      date[i] = (`0${item}`);
    })
    elemDate.querySelector('.day').textContent = sliceStr(date[3]);
    elemDate.querySelector('.hour').textContent = date[2].slice(-2);
    elemDate.querySelector('.min').textContent = date[1].slice(-2);
    elemDate.querySelector('.sec').textContent = date[0].slice(-2);
  } else {
    state = 1;
    clearInterval(countDown);
  }
}
// 判斷資料名額產生模板  
function hasQuota() {
  const elemCountTit = document.querySelector('#CountTit');
  const elemCountFoot = document.querySelector('#CountFoot');
  const elemCountDate = document.querySelector('#CountDate');
  const arrTit = [['優惠倒數:', '贈送完畢'], '優惠活動結束'];
  const arrDate = ['我們提早結束優惠', '請再關注我們的優惠時間'];
  const arrAmount = ['已爆滿', '已額滿']
  let state = 0;
  ExceedDeadLine() > 0 ? state = 0 : state = 1;
  if (state === 0) {
    if (data.personNum >= 100) {
      elemCountTit.textContent = arrTit[state][1];
      elemCountDate.textContent = arrDate[state];
      elemCountFoot.innerHTML = `<p class="count__full">${arrAmount[state]}</p>`;
      clearInterval(countDown);
      return
    }
    elemCountTit.textContent = arrTit[state][0];
    elemCountDate.innerHTML = `
      <span class="day"></span> 天
      <span class="hour"></span> 時
      <span class="min"></span> 分
      <span class="sec"></span> 秒`
    elemCountFoot.innerHTML = `<p class="count__amount">已有 <strong class="count__num" id="CountNum">${data.personNum}</strong> 人報名</p>
      <a href="javascript:;" class="count__link btn btn-white mx-auto">搶先報名 &raquo;</a>`;
  }
  else {
    elemCountTit.textContent = arrTit[state];
    elemCountDate.textContent = arrDate[state];
    if (data.personNum >= 100) {
      elemCountFoot.innerHTML = `<p class="count__full">${arrAmount[state]}</p>`;
      return;
    }
    elemCountFoot.innerHTML = `<p class="count__amount"> 已有 <strong class="count__num" id = "CountNum" > ${data.personNum}</strong> 人報名</p>
      <a href="javascript:;" class="count__link btn btn-white mx-auto">我要報名 &raquo;</a>`;
  }
}
// 字串處理 
function sliceStr(str) {
  return str.slice(-(str.length - 1));
}
// 判斷活動時間距今
function ExceedDeadLine() {
  const endTime = Date.parse(new Date(data.endTime))
  const now = Date.parse(new Date())
  return endTime - now;
}
// 註冊事件監聽
function setEvent() {
  window.addEventListener('scroll', scrollWin);
  window.addEventListener('keyup', closeModal);
  document.addEventListener('click', closeMenu);
  elemHeaderBarWrap.addEventListener('click', toggleMenu);
  document.querySelector('#MediaVideo').addEventListener('click', playVedio);
  elemModal.addEventListener('click', closeModal);
}
/* -----事件監聽function----- */
function scrollWin() {
  scrolltoShow();
  handleAnimation();
}
// 捲動視窗顯示header背景色
function scrolltoShow() {
  const elemHeader = document.querySelector('#Header');
  if (window.scrollY > 0) {
    elemHeader.classList.add('js-header');
    elemToTop.style.display = 'block';
    return;
  }
  if (window.scrollY === 0) {
    elemHeader.classList.remove('js-header');
    elemToTop.style.display = 'none';
    return;
  }
}
//顯示Iframe，動態產生影片路徑 
function playVedio() {
  elemModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  document.querySelector('#ModalMedia').src = 'https://www.youtube.com/embed/syFyL9tONRA?';
}
// 關閉滿版窗格&影片
function closeModal(e) {
  if (e.type === 'keydown' && e.keyCode !== 27) return;
  elemModal.style.display = 'none';
  elemModal.querySelector('.modal__media').src = '';
  document.body.style.overflow = 'auto';
}
// 控制動畫(數字動畫、淡入)
function handleAnimation() {
  controlCount(arrAllel[animateIndex]);
  if (arrAllY[animateIndex] - window.scrollY <= (avalHeight * 1 / 2)) {
    arrAllel[animateIndex].classList.add('js-animate');
    animateIndex += 1;
  }
}
// 數字動畫function
function setCountAnimate(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}
// 執行數字動畫
function controlCount(e) {
  const target = e.querySelector('.effort__num');
  switch (e) {
    case elemFinishNum:
      setCountAnimate(target, 0, target.dataset.num, 3000);
      break;
    case elemTransPercent:
      setCountAnimate(target, 0, target.dataset.num, 3000);
      break;
    case elemFrontedPercent:
      setCountAnimate(target, 0, target.dataset.num, 3000);
      break;
    default:
      return;
  }
}
//切換手機板選單顯示隱藏
function toggleMenu() {
  elemNav.classList.toggle('js-nav');
}
//任意點擊關閉選單 
function closeMenu(e) {
  if (e.target !== elemHeaderBarWrap) {
    elemNav.classList.remove('js-nav');
  }
}



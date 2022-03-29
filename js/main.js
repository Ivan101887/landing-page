const avalHeight = window.innerHeight;
const arrAllY = [];
const arrAllel = [];
const elemAnimate = document.querySelectorAll('.animate');
const elemCountLs = document.querySelector('#CountLs');
const elemModal = document.querySelector('#Modal');
const countDown = setInterval(setTimer, 1000);
const elemHeaderHam = document.querySelector('#HeaderHam');
const elemFinishNum = document.querySelector('#FinishNum');
const elemTransPercent = document.querySelector('#TransPercent');
const elemFrontedPercent = document.querySelector('#FrontedPercent');
const elemToTop = document.querySelector('#ToTop');
const effortNum = [159, 85, 90];
let animateIndex = 0;
let levels = 3;
let data = [];

setInit();
setEvent();
function setEvent() {
  window.addEventListener('scroll', scrollHeader);
  window.addEventListener('scroll', handleAnimation);
  window.addEventListener('scroll', showToTop);
  window.addEventListener('click', closeMenu);
  document.querySelector('#MediaVideo').addEventListener('click', playVedio);
  elemModal.addEventListener('click', closeModal);
  window.addEventListener('keydown', closeModal);
}
async function setInit() {
  setArrs();
  await getData();
  render();
}
async function getData() {
  const api = './data/activity.json'
  let res = await fetch(api);
  data = await res.json();
}
function closeMenu(e) {
  const elemNav = document.querySelector('#Nav');
  if (e.target.nodeName === 'I') {
    elemNav.classList.toggle('js-nav');
    return;
  }
  elemNav.classList.remove('js-nav');
  e.stopPropagation();

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
function showToTop() {
  if (window.scrollY > 0) {
    elemToTop.style.display = 'block';
    return;
  }
  elemToTop.style.display = 'none';
}
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
function sliceStr(str) {
  return str.slice(-(str.length - 1));
}
function scrollHeader() {
  const elemHeader = document.querySelector('#Header');
  if (window.scrollY > 0) {
    elemHeader.classList.add('js-header');
    return;
  }
  if (window.scrollY === 0) {
    elemHeader.classList.remove('js-header');
    return;
  }
}
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
function handleAnimation() {
  controlCount(arrAllel[animateIndex]);
  if (arrAllY[animateIndex] - window.scrollY <= (avalHeight * 1 / 2)) {
    showElem(arrAllel[animateIndex]);
    animateIndex += 1;
  }
}
function controlCount(e) {
  switch (e) {
    case elemFinishNum:
      setCountAnimate(e.querySelector('.effort__num'), 0, effortNum[0], 3000);
      break;
    case elemTransPercent:
      setCountAnimate(e.querySelector('.effort__num'), 0, effortNum[1], 3000);
      break;
    case elemFrontedPercent:
      setCountAnimate(e.querySelector('.effort__num'), 0, effortNum[2], 3000);
      break;
    default:
      return;
  }

}
function showElem(item) {
  if (item.classList.contains('animate__title')) {
    item.classList.add('js-slide__down');
    return;
  }
  item.classList.add('js-slide__up');
}
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

function setProgressStr(str = '') {
  for (let i = 0; i < levels; i += 1) {
    str +=
      `<li class="progress ${i === 2 ? 'progress-lg' : ''}">
          <p class="progress__head mx-auto">達 ${data.list[i].level} 人</p>
          <p class="progress__bar"></p>
          ${i === 0 ? '<p class="progress__begin">預備開始</p>' : ''}
          <p class="progress__foot mx-auto">送 ${data.list[i].productName}</p>
        </li>`;
  }
  return str;
}
function ExceedDeadLine() {
  const endTime = Date.parse(new Date(data.endTime))
  const now = Date.parse(new Date())
  return endTime - now;
}
function setBarWidth() {
  let widthArr = [];
  let prevRange = 0;
  for (let i = 0; i < levels; i += 1) {
    i - 1 < 0 ? prevRange = 0 : prevRange = i - 1;
    data.personNum >= calcRange(i) ? widthArr.push(1) : widthArr.push((data.personNum - calcRange(prevRange)) / calcRange(i));
  }
  return widthArr;
}
function calcRange(order) {
  return range = data.list[order].level;
}
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
function playVedio() {
  elemModal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  document.querySelector('#ModalMedia').src = 'https://www.youtube.com/embed/syFyL9tONRA?';
}
function closeModal(e) {
  if (e.type === 'keydown' && e.keyCode !== 27) return;
  elemModal.style.display = 'none';
  elemModal.querySelector('.modal__media').src = '';
  document.body.style.overflow = 'auto';
}




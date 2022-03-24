const avalHeight = window.innerHeight;
const arrAllY = [];
const arrAllel = [];
const elemAnimate = document.querySelectorAll('.animate');
const elemCountLs = document.querySelector('#CountLs');
const elemModal = document.querySelector('#Modal');
const countDown = setInterval(setTimer, 1000);
const range = 25;
let animateIndex = 0;
let levels = 3;
let data = [];

setInit();
setEvent();
function setEvent() {
  window.addEventListener('scroll', scrollHeader);
  window.addEventListener('scroll', handleAnimation);
  document.querySelector('#MediaVideo').addEventListener('click', playVedio);
  elemModal.addEventListener('click', closeModal);
  window.addEventListener('keyup', closeModal);
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
function render() {
  document.querySelector('#CountNum').textContent = data.personNum;
  elemCountLs.innerHTML = setProgressStr();
  let barWidth = setBarWidth();
  elemCountLs.querySelectorAll('.progress').forEach((item, index) => {
    barWidth[index] === 1
      ? item.classList.add('js-progress')
      : item.querySelector('.progress__bar').style.width = `${barWidth[index] * 100}%`;
  });
}
function setTimer() {
  let date = [];
  const elemDate = document.querySelector('.count__date');
  let remaining = ExceedDeadLine()
  if (remaining >= 0) {
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
    clearInterval(countDown);
  }
}
function sliceStr(str) {
  return str.slice(-(str.length - 1));
}
function scrollHeader() {
  const elemHeader = document.querySelector('#Header');
  if (window.scrollY > 0) {
    elemHeader.style.backgroundColor = ('#ffffffe5');
    return;
  }
  if (window.scrollY === 0) {
    elemHeader.style.backgroundColor = ('transparent');
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
  if (arrAllY[animateIndex] - window.scrollY <= (avalHeight * 1 / 2)) {
    showElem(arrAllel[animateIndex]);
    animateIndex += 1;
  }
}
function showElem(item) {
  if (item.classList.contains('animate__title')) {
    item.classList.add('js-slide__down');
    return;
  }
  item.classList.add('js-slide__up');
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
  for (let i = 0; i < levels; i += 1) {
    if (i === 2) {
      data.personNum >= (range + range * (i + 1)) ? widthArr.push(1) : widthArr.push((data.personNum - range * i) / (range * 2));
    }
    else {
      data.personNum >= range * (i + 1) ? widthArr.push(1) : widthArr.push((data.personNum - range * i) / range);
    }
  }
  return widthArr;
}
function setActState() {
  let remaining = ExceedDeadLine();
  if (remaining > 0) {
    if (data.person === 100) {

      return
    }
    return
  }
}
function playVedio() {
  elemModal.style.display = 'block';
  document.body.style.overflow = 'hidden'
}
function closeModal(e) {
  if(e.type === 'keyup'){
    if (e.keyCode !== 27) return;
  }
  elemModal.style.display = 'none';
  elemModal.querySelector('.modal__media').src = elemModal.querySelector('.modal__media').src
  document.body.style.overflow = 'auto'
}


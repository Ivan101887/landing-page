const avalHeight = window.innerHeight;

setEvent()
function setEvent() {
  window.addEventListener('scroll', scrollHeader);
}

function scrollHeader() {
  const elemHeader = document.querySelector('#Header');
  if (window.scrollY > 0) {
    elemHeader.style.backgroundColor = ('#fffffff5');
    return;
  }
  if (window.scrollY === 0) {
    elemHeader.style.backgroundColor = ('transparent');
    return;
  }
}

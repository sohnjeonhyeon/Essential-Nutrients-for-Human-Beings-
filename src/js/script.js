const container = document.querySelector('.scroll-container');
const items = document.querySelectorAll('.item');
const needle = document.querySelector('.hands');
const priceDiv = document.querySelector('.price');
const caffeineDiv = document.querySelector('.caffeine');
const priceTextDiv = document.querySelector('.price-text');
const amountDiv = document.querySelector('.amount');
const titleDiv = document.querySelector('.title');
const movingText = document.getElementById("movingText");
const shadowText = document.getElementById("shadowText");
const itemTitle = document.getElementById("itemTitle");
const shadowTitle = document.getElementById("shadowTitle");
const starImg = document.querySelector('.star img');
const starImages = {
  1: "https://i.ibb.co/99qHXgGD/star-1.png",
  2: "https://i.ibb.co/7Nk3QGJg/star-2.png",
  3: "https://i.ibb.co/3mXFjBjP/star-3.png",
  4: "https://i.ibb.co/FbbqbDzm/star-4.png",
  5: "https://i.ibb.co/BVwMWT6j/star-5.png",
};


// 카페인 시계
function caffeineToAngle(mg) {
  // maxMg 기준으로 maxAngle 회전
  const maxMg = 300;
  const maxAngle = 178;
  const offset = -88;
  const angle = (mg / maxMg) * maxAngle;
  return Math.min(angle, maxAngle) + offset;
  
}



// 음료제목 애니메이션
let offset = 0;
let animationActive = true;

// 초기 텍스트 설정
let defaultTitle = "음료들을 좌우로 스크롤해보세요";

// 기본 텍스트 업데이트
movingText.textContent = defaultTitle;
shadowText.textContent = defaultTitle;


// 기본 텍스트도 애니메이션 활성화 (글자 길이에 따라)
if (defaultTitle.length > 10) {
  animationActive = true;
  itemTitle.setAttribute("text-anchor", "start");
  shadowTitle.setAttribute("text-anchor", "start");
  movingText.setAttribute("startOffset", "0%");
  shadowText.setAttribute("startOffset", "0%");
  requestAnimationFrame(animateText);
} else {
  animationActive = false;
  itemTitle.setAttribute("text-anchor", "middle");
  shadowTitle.setAttribute("text-anchor", "middle");
  movingText.setAttribute("startOffset", "50%");
  shadowText.setAttribute("startOffset", "50%");

}

// === 텍스트 애니메이션 ===
function updateTitle(text) {
  movingText.textContent = text;
  shadowText.textContent = text;
}

function animateText() {
  if (!animationActive) return; // 짧으면 애니메이션 안 함

  offset += -0.1; 
  if (offset < -100) offset = 0;

  movingText.setAttribute("startOffset", offset + "0%");
  shadowText.setAttribute("startOffset", offset + "0%");
  requestAnimationFrame(animateText);
}



// === 스크롤 이벤트 ===
container.addEventListener('scroll', () => {
  const center = container.scrollLeft + container.offsetWidth / 2;

  let closest = null;
  let closestDistance = Infinity;

  items.forEach(item => {
    const itemCenter = item.offsetLeft + item.offsetWidth / 2;
    const distance = Math.abs(center - itemCenter);

    if (distance < closestDistance) {
      closest = item;
      closestDistance = distance;
    }
  });

  // Active 관리
  items.forEach(item => item.classList.remove('active'));
  closest.classList.add('active');

  const img = closest.querySelector('.drink');
  let title = img ? img.getAttribute("data-title") : closest.textContent;

  if (!title) title = "";

  updateTitle(title);

  // 텍스트 길이에 따라 애니메이션 여부 결정
  if (title.length > 10) {
    animationActive = true;
    animateText();
    itemTitle.setAttribute("text-anchor", "start");
    shadowTitle.setAttribute("text-anchor", "start");
    movingText.setAttribute("startOffset", "0%");
    shadowText.setAttribute("startOffset", "0%");

  } else {
    animationActive = false;
    itemTitle.setAttribute("text-anchor", "middle");
    shadowTitle.setAttribute("text-anchor", "middle");
    movingText.setAttribute("startOffset", "50%");
    shadowText.setAttribute("startOffset", "50%");
  }

  let star = img ? img.getAttribute("data-star") : null;

  // ------- 별점 이미지 변경 -------
  if (img && img.dataset.star) {
    const star = img.dataset.star;
    starImg.src = starImages[star]; 
  } else {
    // 별점 없으면 기본 별 사용
    starImg.src = starImages[5];
  }
});





function getPriceImages(price) {
  let remaining = price;
  let html = "";

  let count5000 = 0;
  let count1000 = 0;
  let count500 = 0;
  let count100 = 0;

  while (remaining >= 5000) {
    html += `<img 
      src="https://i.ibb.co/67NbK3VY/5000.png"
      style="
        position:absolute;
        width:400px;
        left: ${30 + count5000 * 15}px;
        bottom: ${30 + count5000 * -10}px;
      "
    >`;
    remaining -= 5000;
    count5000++;
  }

  while (remaining >= 1000) {
    html += `<img 
      src="https://i.ibb.co/vpBYvm6/1000.png"
      style="
        position:absolute;
        width:300px;
        left: ${300 + count1000 * 12}px;
        top: ${50+ count1000 * -12}px;
      "
    >`;
    remaining -= 1000;
    count1000++;
  }

  while (remaining >= 500) {
    html += `<img 
      src="https://i.ibb.co/TBg9dW6k/500.png"
      style="
        position:absolute;
        width:120px;
        left: ${400 + count500 * 0}px;
        bottom: ${30 + count500 * 10}px;
      "
    >`;
    remaining -= 500;
    count500++;
  }

  while (remaining >= 100) {
    html += `<img 
      src="https://i.ibb.co/MyyQhCWB/100.png"
      style="
        position:absolute;
        width:100px;
        left: ${30 + count100 * 8}px;
        top: ${30 + count100 * 0}px;
      "
    >`;
    remaining -= 100;
    count100++;
  }
  return html;
}



function updateActiveItem() {
  const center = container.scrollLeft + container.offsetWidth / 2;

  let closest = null;
  let closestDistance = Infinity;

  items.forEach(item => {
    const itemCenter = item.offsetLeft + item.offsetWidth / 2;
    const distance = Math.abs(center - itemCenter);
    if (distance < closestDistance) { closestDistance = distance; closest = item; }
  });

  items.forEach(item => {
    item.classList.remove('active');
    const img = item.querySelector('img.drink');
    if (!img) return;
    // 원본 이미지 복원
    img.src = img.dataset.src;
  });

  if (!closest) return;

  closest.classList.add('active');

  // 이미지 교체
  const img = closest.querySelector('img.drink');
  if (img && img.dataset.active) {
    img.src = img.dataset.active;
  }

  // 카페인, 가격, 양 업데이트
  const mg = Number(closest.dataset.caffeine);
  const price = Number(closest.dataset.price || 0);
  const ml = Number(closest.dataset.amount || 0);

  needle.style.transform = `rotate(${caffeineToAngle(mg)}deg)`;
  priceDiv.innerHTML = getPriceImages(price);
  caffeineDiv.textContent = `Caffeine: ${mg}mg`;
  priceTextDiv.textContent = `Price: ${price}원`;
  amountDiv.textContent = `Amount: ${ml}ml`;

  // amount 이미지 위치 업데이트
const amountImg = document.querySelector('.amount-img img');
if (amountImg) {
  const maxOffset = 80; // 이동 가능한 최대 px
  const offset = Math.min((ml / 500) * maxOffset, maxOffset);
  amountImg.style.transform = `translateY(${-offset}px)`; 
}
}

// scroll 이벤트
container.addEventListener('scroll', updateActiveItem);
// 초기 상태
updateActiveItem();
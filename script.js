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
const human = document.querySelector('.human');
const stripe = document.querySelector('.stripe');
let infoLifted = false;


let stripeOffset = 0;
let stripeSpeed = 20;        // 현재 속도 (px/초)
let stripeTargetSpeed = 20;  // 목표 속도
const stripeBaseSpeed = 20;  // 기본 느린 속도
const stripeFastSpeed = 200;  // 스크롤할 때 빠른 속도

let lastTime = performance.now();

// 부드럽게 speed를 targetSpeed 쪽으로 보간
function updateStripeSpeed(dt) {
  const ease = 5; // 값이 클수록 빨리 따라감
  const diff = stripeTargetSpeed - stripeSpeed;
  stripeSpeed += diff * Math.min(1, ease * dt);
}

function animateStripe(now) {
  const dt = (now - lastTime) / 1000;  // 초 단위
  lastTime = now;

  updateStripeSpeed(dt);               // 속도 부드럽게 변경
  stripeOffset -= stripeSpeed * dt;    // 왼쪽으로 이동
  stripe.style.backgroundPositionX = `${stripeOffset}px`;

  requestAnimationFrame(animateStripe);
}

if (stripe) {
  requestAnimationFrame(animateStripe);
}



const starImages = {
  1: "https://i.ibb.co/99qHXgGD/star-1.png",
  2: "https://i.ibb.co/7Nk3QGJg/star-2.png",
  3: "https://i.ibb.co/3mXFjBjP/star-3.png",
  4: "https://i.ibb.co/FbbqbDzm/star-4.png",
  5: "https://i.ibb.co/BVwMWT6j/star-5.png",
};
const humanFrames = [
  'https://i.ibb.co/qM00f2mv/human-01.png', // index 0 → 1단계
  'https://i.ibb.co/rKT09Ypj/human-02.png',
  'https://i.ibb.co/sJjqX69R/human-03.png',
  'https://i.ibb.co/PscCsH2j/human-04.png',
  'https://i.ibb.co/20r4tPfT/human-05.png',
  'https://i.ibb.co/gLbj3Dqd/human-06.png',
  'https://i.ibb.co/VpPSthmD/human-07.png',
  'https://i.ibb.co/Hfzhc1C6/human-08.png',
  'https://i.ibb.co/sdcnd38w/human-09.png',
  'https://i.ibb.co/hxtdphkN/human-10.png',
  'https://i.ibb.co/5hsSVVpF/human-11.png',
  'https://i.ibb.co/60fJN2D7/human-12.png',
  'https://i.ibb.co/5WqnwM7M/human-13.pngg',
  'https://i.ibb.co/NgyLKW5w/human-14.png',
  'https://i.ibb.co/SXJjGJng/human-15.png', // index 15 → 16단계
];
const pattern = [
  1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,
  10,12,13,14,15,
  10,12,13,14,15,
  10,9,8,7,6,5,4,3,2,1,
];





let humanTimer = null;
let patternIndex = 0;

// mg에 따른 속도 조절 (숫자는 예시)
function getHumanInterval(mg) {
  const maxMg = 300;
  const minMs = 5;   // 가장 빠를 때
  const maxMs = 350;  // 가장 느릴 때
  const t = Math.min(mg / maxMg, 1);  // 0~1
  return maxMs - (maxMs - minMs) * t;
}

function setHumanFrame(frameNumber) {
  // frameNumber: 1~16
  const idx = frameNumber - 1;
  const url = humanFrames[idx];
  human.style.backgroundImage = `url(${url})`;
}

// 애니메이션 시작
function playHumanAnimation(mg) {
  stopHumanAnimation();

  // 카페인 0이면 그냥 1번 상태에서 끝
  if (!mg || mg <= 0) {
    setHumanFrame(1);
    return;
  }

  const interval = getHumanInterval(mg);
  const seq = pattern; // 루프 횟수 조절 가능
  patternIndex = 0;

  setHumanFrame(seq[patternIndex]);

  humanTimer = setInterval(() => {
    patternIndex++;
    if (patternIndex >= seq.length) {
      // 전체 패턴이 끝나면 다시 잔잔한 1번으로 고정
      clearInterval(humanTimer);
      humanTimer = null;
      setHumanFrame(1);
      return;
    }
    setHumanFrame(seq[patternIndex]);
  }, interval);
}

// 애니메이션 강제 정지
function stopHumanAnimation() {
  if (humanTimer) {
    clearInterval(humanTimer);
    humanTimer = null;
  }
  setHumanFrame(1);
}


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
let isAnimating = false;  // ← 이미 애니메이션이 돌고 있는지 체크

function animateText() {
  if (!animationActive) {
    isAnimating = false;  // 애니메이션 종료
    return;
  }

  if (!isAnimating) isAnimating = true; // 처음 실행만 true

  offset -= 0.1;
  if (offset < -100) offset = 0;

  movingText.setAttribute("startOffset", offset + "0%");
  shadowText.setAttribute("startOffset", offset + "0%");

  requestAnimationFrame(animateText);
}

// 초기 텍스트 설정
let defaultTitle = "음료들을 좌우로 스크롤해주세요";
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
        width:330px;
        left: ${200 + count1000 * 12}px;
        top: ${110+ count1000 * -12}px;
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
        left: ${70 + count100 * 8}px;
        top: ${80 + count100 * 0}px;
      "
    >`;
    remaining -= 100;
    count100++;
  }
  return html;
}


// 스크롤 스냅
function snapToClosestItem() {
  const center = container.scrollLeft + container.offsetWidth / 2;

  let closest = null;
  let closestDistance = Infinity;

  items.forEach(item => {
    if (item.classList.contains('blank')) return; // 필요하면 blank 제외
    const itemCenter = item.offsetLeft + item.offsetWidth / 2;
    const distance = Math.abs(center - itemCenter);
    if (distance < closestDistance) {
      closestDistance = distance;
      closest = item;
    }
  });

  if (!closest) return;

  const itemCenter = closest.offsetLeft + closest.offsetWidth / 2;
  const targetScrollLeft = itemCenter - container.offsetWidth / 2;

  animateScrollTo(targetScrollLeft);
}


function animateScrollTo(target) {
  const start = container.scrollLeft;
  const distance = target - start;
  const duration = 350; // ms, 300~500 사이 튜닝

  let startTime = null;

  function easeOutCubic(t) {
    // t: 0~1
    return 1 - Math.pow(1 - t, 3);
  }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const t = Math.min(elapsed / duration, 1);   // 0~1
    const eased = easeOutCubic(t);

    container.scrollLeft = start + distance * eased;

    if (t < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

//info card up
const infoLeft  = document.querySelector('.info-left');
const infoRight = document.querySelector('.info-right');
let infoCardsShown = false;


function setNeedleAngle(mg) {
  const angle = caffeineToAngle(mg);
  needle.style.transform =
    `translate(-50%, 0) scale(0.9) rotate(${angle}deg)`;
}

// 리뷰 DOM
const reviewTextEl = document.querySelector('.review-text');

// 음료별 리뷰 (data-title 기준)
const drinkReviews = {
  "핫식스 더킹 파워": "새콤하지 않은 박카스 맛. 카페인은 생각보다 적으나 타우린이 성인 일일권장량만큼 들어 있어 커피보다 에너지가 더 생기는 듯한 느낌",
  "핫식스 더킹 제로": "제로라서 마실 때 내 몸에 대한 죄책감이 그나마 덜하다",
  "몬스터 에너지 울트라": "탄산이 강하고 단맛도 강해서 아주 오랫동안 먹을 수 있다.",
  "유어스 춘식이 커피": "그 '스누피 커피'의 바뀐 버전. 악명이 높아서 일부러 잠을 거의 못 잔 날에만 마시다 보니 오히려 효과를 잘 못 느끼겠다. 단 맛이 인공적인 느낌이다. ",
  "스타벅스 윈터 스카치 바닐라 라떼": "겨울 한정. 그렇게 달지 않은데 맛도 그렇게 강하지 않다. 컨디션 안 좋은데 달달하면서 부담 없이 마시고 싶을 때 좋을 것 같다.",
  "스타벅스 돌체라떼": "맛있는데 나중에 입이 엄청 텁텁해진다.", 
  "스타벅스 아메리카노 HOT TALL": "스벅 아메리카노는 아아보다 뜨아가 더 맛있는 것 같다.",
  "스타벅스 아메리카노 ICE TALL": "옛날엔 산미가 많이 느껴져서 별로였는데 요새는 그럭저럭",
  "스타벅스 블랙 글레이즈드 라떼": "이상하게 나한테는 딸기맛이 약간 느껴진다. 맛없다는 의미는 아니다."
};








// ====== 스크롤 이벤트 ======= //

function updateActiveItem() {
  const center = container.scrollLeft + container.offsetWidth / 2;

  let closest = null;
  let closestDistance = Infinity;

  items.forEach(item => {
    const itemCenter = item.offsetLeft + item.offsetWidth / 2;
    const distance = Math.abs(center - itemCenter);
    if (distance < closestDistance) { closestDistance = distance; closest = item; }
  });

   if (!closest) return;

  items.forEach(item => {
    item.classList.remove('active');
    const img = item.querySelector('.drink');
    if (!img) return;
    // 원본 이미지 복원
    img.src = img.dataset.src;
  });


  closest.classList.add('active');
  const img = closest.querySelector('.drink');
  if (img && img.dataset.active) {
    img.src = img.dataset.active;  // 여기서만 active 이미지로 변경
  }


  let title = img ? img.getAttribute("data-title") : closest.textContent || "";

  if (!title) title = "";

  updateTitle(title);

  // 텍스트 길이에 따라 애니메이션 여부 결정
  if (title.length > 10) {
  animationActive = true;
  if (!isAnimating) animateText();  // 이미 실행 중이면 다시 실행하지 않음
  itemTitle.setAttribute("text-anchor", "start");
  shadowTitle.setAttribute("text-anchor", "start");
  movingText.setAttribute("startOffset", "0%");
  shadowText.setAttribute("startOffset", "0%");
} else {
  animationActive = false;
  offset = 0; // 중앙정렬 시 offset 초기화 (중요!)
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

 

 
 // 카페인, 가격, 양 업데이트
const mg = Number(closest.dataset.caffeine);
playHumanAnimation(mg);

const price = Number(closest.dataset.price || 0);
const ml = Number(closest.dataset.amount || 0);

const sugar = Number(closest.dataset.sugar || 0);

setNeedleAngle(mg);
  priceDiv.innerHTML = getPriceImages(price);
// 왼쪽
document.querySelector('.amount').textContent   = `${ml} ml`;
document.querySelector('.caffeine').textContent = `${mg} mg`;

// 오른쪽
const sugarEl = document.querySelector('.sugar');
if (sugarEl) sugarEl.textContent = sugar ? `${sugar} g` : '';
document.querySelector('.price-text').textContent =
  `${price.toLocaleString()} 원`;

// 리뷰 업데이트
if (reviewTextEl) {
  const review = drinkReviews[title] || "이 음료에 대한 리뷰가 아직 없습니다.";
  reviewTextEl.textContent = review;
}

  // amount 이미지 위치 업데이트
const amountImg = document.querySelector('.amount-img img');
if (amountImg) {
  const maxOffset = 80; // 이동 가능한 최대 px
  const offset = Math.min((ml / 500) * maxOffset, maxOffset);
  amountImg.style.transform = `translateY(${-offset}px)`; 
}
}



// scroll 이벤트
let stripeTimeout = null;
let scrollStopTimer = null;

container.addEventListener('scroll', () => {
  // 첫 스크롤 때 info 카드 올리기
  if (!infoLifted) {
    infoLifted = true;
    if (infoLeft)  infoLeft.classList.add('info-up');
    if (infoRight) infoRight.classList.add('info-up');
  }
  
  updateActiveItem();

  if (!stripe) return;

  // 스크롤 중에는 빠른 목표 속도로
  stripeTargetSpeed = stripeFastSpeed;

  // 마지막 스크롤에서 400ms 지나면 다시 기본 속도로 서서히 복귀
  if (stripeTimeout) clearTimeout(stripeTimeout);
  stripeTimeout = setTimeout(() => {
    stripeTargetSpeed = stripeBaseSpeed;
  }, 200);

  if (scrollStopTimer) clearTimeout(scrollStopTimer);

  // 150ms 동안 추가 스크롤이 없으면 "멈췄다"고 보고 snap
  scrollStopTimer = setTimeout(() => {
    snapToClosestItem();
  }, 150);
});




const track = document.querySelector(".carosel-track");
const realSlides = Array.from(document.querySelectorAll(".carosel-slide"));
const dots = document.querySelectorAll(".dot");
const toggleBtn = document.querySelector(".carosel-toggle");
const INTERVAL = 6000;
const total = realSlides.length;

// 마지막 -> 처음으로 넘어갈 때 자연스럽게 흐르도록 첫 슬라이드의 복제본을 맨 뒤에 붙인다.
const firstClone = realSlides[0].cloneNode(true);
firstClone.classList.remove("active");
track.appendChild(firstClone);

let current = 0; // 실제 슬라이드 인덱스 (0 ~ total-1), 점 표시에 사용
let trackPos = 0; // 트랙 상의 위치 (0 ~ total, total은 복제본 위치)
let timer = null;
let paused = false;

function updateDots(index) {
    dots.forEach((dot) => dot.classList.remove("active"));
    dots[index].classList.add("active");
}

function render(pos) {
    track.style.transform = `translateX(-${pos * 100}%)`;
}

function handleLoopReset() {
    track.style.transition = "none";
    trackPos = 0;
    render(trackPos);
    void track.offsetWidth; // 강제 리플로우로 transition 제거 반영
    track.style.transition = "";
}

function advance() {
    trackPos += 1;
    current = trackPos % total;
    render(trackPos);
    updateDots(current);

    if (trackPos === total) {
        track.addEventListener("transitionend", handleLoopReset, { once: true });
    }
}

function startTimer() {
    clearInterval(timer);
    timer = setInterval(advance, INTERVAL);
}

function goToSlide(index) {
    track.style.transition = "";
    trackPos = index;
    current = index;
    render(trackPos);
    updateDots(current);
    if (!paused) {
        startTimer();
    }
}

dots.forEach((dot, i) => {
    dot.addEventListener("click", () => goToSlide(i));
});

toggleBtn.addEventListener("click", () => {
    paused = !paused;
    if (paused) {
        clearInterval(timer);
        toggleBtn.textContent = "▶";
        toggleBtn.setAttribute("aria-label", "재생");
    } else {
        startTimer();
        toggleBtn.textContent = "❚❚";
        toggleBtn.setAttribute("aria-label", "일시정지");
    }
});

startTimer();

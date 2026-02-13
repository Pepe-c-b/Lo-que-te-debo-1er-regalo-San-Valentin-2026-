const ropeSystem = document.getElementById('ropeSystem');
const rope = document.getElementById('rope');
const message = document.getElementById('message');
const bgHearts = document.getElementById('bgHearts');
const proposal = document.getElementById('proposal');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const proposalGif = document.getElementById('proposalGif');
const proposalText = document.getElementById('proposalText');
const instruction = document.getElementById('instruction');
const extraGif = document.getElementById('extraGif');

let isDragging = false;
const initialHeight = 150;
const maxPull = 200;
const triggerThreshold = 150;
let anchorX = 0, anchorY = 0;

ropeSystem.addEventListener('mousedown', startDrag);
window.addEventListener('mousemove', onDrag);
window.addEventListener('mouseup', endDrag);

ropeSystem.addEventListener('touchstart', (e) => startDrag(e.touches[0]));
window.addEventListener('touchmove', (e) => onDrag(e.touches[0]));
window.addEventListener('touchend', endDrag);

function startDrag(e) {
    isDragging = true;
    const cardRect = document.querySelector('.card').getBoundingClientRect();
    anchorX = cardRect.left + cardRect.width / 2;
    anchorY = cardRect.top;
    rope.classList.remove('rebound');
    ropeSystem.classList.remove('rebound');
}

function onDrag(e) {
    if (!isDragging) return;
    const dx = e.clientX - anchorX;
    const dy = e.clientY - anchorY;
    let angleDeg = Math.atan2(dx, dy) * (180 / Math.PI);
    angleDeg = Math.max(-60, Math.min(60, angleDeg));

    let distance = Math.sqrt(dx * dx + dy * dy);
    let pullDistance = Math.max(0, distance - initialHeight);
    if (pullDistance > maxPull) pullDistance = maxPull + (pullDistance - maxPull) * 0.2;

    rope.style.height = `${initialHeight + pullDistance}px`;
    ropeSystem.style.transform = `translateX(-50%) rotate(${-angleDeg}deg)`;
    
    let scale = Math.max(0.5, 1 - (pullDistance / maxPull) * 0.5);
    bgHearts.style.transform = `scale(${scale})`;
}

function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    const pulledAmount = parseFloat(rope.style.height) - initialHeight;

    if (pulledAmount > triggerThreshold) {
        triggerSurprise();
    } else {
        rope.classList.add('rebound');
        ropeSystem.classList.add('rebound');
        rope.style.height = `${initialHeight}px`;
        ropeSystem.style.transform = `translateX(-50%) rotate(0deg)`;
        bgHearts.style.transform = `scale(1)`;
    }
}

function triggerSurprise() {
    message.classList.add('show');
    bgHearts.style.display = 'none';
    ropeSystem.style.display = 'none';
    instruction.style.display = 'none';
    setTimeout(() => { proposal.classList.add('show'); }, 1000);
    launchConfetti();
}

function launchConfetti() {
    const config = { particleCount: 5, spread: 55, origin: { x: 0.5, y: 0.7 }, colors: ['#ff4d6d', '#ff758f'], shapes: ['heart'], scalar: 2 };
    confetti({ ...config, angle: 60 });
    confetti({ ...config, angle: 120 });
}

noBtn.addEventListener('mouseover', moveNoButton);
function moveNoButton() {
    const card = document.querySelector('.card');
    const newX = Math.random() * (card.offsetWidth - noBtn.offsetWidth - 40) + 20;
    const newY = Math.random() * (card.offsetHeight - noBtn.offsetHeight - 40) + 20;
    noBtn.style.position = 'absolute';
    noBtn.style.left = `${newX}px`;
    noBtn.style.top = `${newY}px`;
}

yesBtn.addEventListener('click', () => {
    proposalText.textContent = "¡Tengo la novia más bonita del mundo! 🤍";
    proposalGif.src = "https://media.tenor.com/gUiu1zyxfzYAAAAi/bear-kiss-bear-kisses.gif";
    yesBtn.style.display = 'none';
    noBtn.style.display = 'none';
    extraGif.src = "https://i.pinimg.com/originals/06/35/b2/0635b27d18e37a6548a2b900bb84e72f.gif";
    extraGif.style.display = 'block';
    setInterval(launchConfetti, 500);
});


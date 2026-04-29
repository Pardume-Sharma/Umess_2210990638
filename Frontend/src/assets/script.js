let body = document.querySelector('body');
let mouse = document.querySelector('.mouse');

body.addEventListener('mousemove', (dets)=>{
    mouse.style.left = dets.x+"px"; 
    mouse.style.top = dets.y+"px";
})



let mode = document.querySelector('.mode');
let ball = document.querySelector('.ball');
mode.addEventListener('click', ()=>{
ball.classList.toggle('right-ball');
body.classList.toggle('dark-mode');
localStorage.setItem('mode', body.classList.contains('dark-mode') ? 'dark' : 'light');
})

document.addEventListener('DOMContentLoaded', () => {
const savedMode = localStorage.getItem('mode');
if(savedMode === 'dark') {
    body.classList.add('dark-mode');
}
});
const audio = new Audio('audio/desert-rose.mp3')
audio.loop = true;

function play() {
    audio.paused ? audio.play() : audio.pause();
}
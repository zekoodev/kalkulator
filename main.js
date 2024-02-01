// Kalkulator
const display = document.querySelector('#display');
const buttons = document.querySelectorAll('.kalkulator div button');

buttons.forEach(function(button) {
    button.addEventListener("click", function() {
        if (this.value === '=') {
            if (display.value != '') {
                try {
                    display.value = eval(display.value.replace('÷', '/').replace('×', '*'));
                } catch (error) {
                    popupMessage("Ups, input kamu salah!");
                }
            }
        } else if (this.value === '÷'  || this.value === '×' || this.value === '-' || this.value === '+') {
            if (display.value.slice(-1) !== '÷' && display.value.slice(-1) !== '×' && display.value.slice(-1) !== '-' && display.value.slice(-1) !== '+') {
                display.value += this.value;
            }
        } else if (this.value === '.') {
            if (display.value.slice(-1) !== '.') {
                display.value += this.value;
            }
        } else if (this.value === 'del') {
            display.value = display.value.slice(0, -1);
        } else if (this.value === 'c') {
            display.value = '';
        } else {
            display.value += this.value;
        }
        display.scrollLeft = display.scrollWidth;
    });
});


// Kombinasi
const result_c = document.querySelector('#result_c');
const submit_c = document.querySelector('.result_c');
var pos_c = 0;

submit_c.addEventListener('click', () => {
    var n = document.querySelector('#n1').value;
    var x = document.querySelector('#x1').value;
    if (n != "" && x != "") {
        submit_c.classList.toggle('active');

        if (pos_c == "0") {
            result_c.textContent = kombinasi(n, x);
            pos_c++;
        } else {
            result_c.textContent = "SUBMIT";
            pos_c--;
        }
    } else {
        popupMessage("Lengkapi input dulu yaa");
    }
});


// Permutasi
const result_p = document.querySelector('#result_p');
const submit_p = document.querySelector('.result_p');
var pos_p = 0;

submit_p.addEventListener('click', () => {
    var n = document.querySelector('#n2').value;
    var x = document.querySelector('#x2').value;
    if (n != "" && x != "") {
        submit_p.classList.toggle('active');

        if (pos_p == "0") {
            result_p.textContent = permutasi(n, x);
            pos_p++;
        } else {
            result_p.textContent = "SUBMIT";
            pos_p--;
        }
    } else {
        popupMessage("Lengkapi input dulu yaa");
    }
});


// Input limit
function limitLength(event, element, maxLength) {
    var result = true;
    var keyCode = event.which || event.keyCode;
    if (element.value.length >= maxLength) {
        result = false;
    }
    return result;
}


// Calculation
function kombinasi(n, x) {
    return faktorial(n) / (faktorial(x) * faktorial(n - x));
}

function permutasi(n, x) {
    return faktorial(n) / faktorial(n - x);
}

function faktorial(val) {
    var i = val - 1;
    while (i > 0) {
        val *= i;
        i--;
    }
    return val;
}


// Pagination
const carousel = document.querySelector('.carousel');
const slides = document.querySelectorAll('.slide');
const cards = document.querySelectorAll('.card');
const pagination = document.querySelector('.pagination-dots');
const dots = document.querySelectorAll('.dot');

pagination.style = `top: ${carousel.offsetHeight - cards[0].offsetTop + 30}px;`;

cards.forEach((card, index) => {
    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.intersectionRatio > 0) {
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, 150);
                dots[index].classList.add('active');
            } else {
                entry.target.classList.remove('active');
                dots[index].classList.remove('active');
            }
        });
    });

    observer.observe(card);
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        slides[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});


// Alert
const alert = document.querySelector('.alert');
const alert_msg = document.querySelector('#alert');
const close_btn = document.querySelector('.close_btn');

function popupMessage(message) {
    alert_msg.textContent = message;
    alert.classList.add('active');
    setTimeout(() => {
        alert.classList.remove('active');
    }, 4000);
}

close_btn.addEventListener('click', function() {
    alert.classList.remove('active');
});


// Get year
var date = new Date();
document.getElementById("copyright").innerHTML = "Copyright ©" + date.getFullYear() + " zekoodev. All Rights Reserved";


// Background video
const video = document.querySelector('.back-video');
const body = document.querySelector('body');
video.style = `height: ${body.offsetHeight}px;`;

var db;

// Membuka atau membuat database
var request = window.indexedDB.open('video-db', 1);
request.onerror = function(event) {
    console.error('Gagal membuka database:', event.target.error);
};
request.onsuccess = function(event) {
    db = event.target.result;
    checkVideo();
};
request.onupgradeneeded = function(event) {
    db = event.target.result;
    var store = db.createObjectStore('video', { keyPath: 'url' });
};

// Memeriksa video pada database
function checkVideo() {
    var request = db.transaction(['video'], 'readonly')
        .objectStore('video')
        .get('killua.mp4');
    request.onerror = function(event) {
        console.error('Gagal membaca video:', event.target.error);
    };
    request.onsuccess = function(event) {
        var video = event.target.result;
        if (video) {
            displayVideo(video.blob);
        } else {
            downloadVideo();
        }
    };
}

// Menyimpan video ke database
function saveVideo(videoBlob) {
    var request = db.transaction(['video'], 'readwrite')
        .objectStore('video')
        .put({ url: 'killua.mp4', blob: videoBlob });
    request.onerror = function(event) {
        console.error('Gagal menyimpan video:', event.target.error);
    };
    request.onsuccess = function(event) {
        console.log('Berhasil menyimpan video.');
    };
}

// Mengunduh video
function downloadVideo() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'killua.mp4', true);
    xhr.responseType = 'blob';
    xhr.onload = function(event) {
        if (xhr.status === 200) {
            var videoBlob = xhr.response;
            saveVideo(videoBlob);
            displayVideo(videoBlob);
        } else {
            console.error('Gagal mengunduh video:', xhr.statusText);
        }
    };
    xhr.send();
}

// Fungsi untuk menampilkan video
function displayVideo(videoBlob) {
    video.src = URL.createObjectURL(videoBlob);
}
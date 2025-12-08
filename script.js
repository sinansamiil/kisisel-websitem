const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

const allNavLinks = document.querySelectorAll('.nav-links li a');

allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1 
});

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));


class TextScrambleEffect {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }

    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }

    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const scrambleElement = document.getElementById('scramble-text');
    if (scrambleElement) {
        const texts = JSON.parse(scrambleElement.getAttribute('data-texts'));
        const scrambler = new TextScrambleEffect(scrambleElement);
        let textIndex = 0;
        const pauseDelay = 2500; 
        const nextText = async () => {
            const currentText = texts[textIndex];
            await scrambler.setText(currentText);
            await new Promise(resolve => setTimeout(resolve, pauseDelay));
            textIndex = (textIndex + 1) % texts.length;
            nextText();
        }
        nextText();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const chars = '01';
        const matrix = chars.split('');
        const font_size = 14;
        const columns = canvas.width / font_size; 
        let drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1; 
        }
        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ff0000ff';
            ctx.font = font_size + 'px monospace';
            for (let i = 0; i < drops.length; i++) {
                const text = matrix[Math.floor(Math.random() * matrix.length)];
                ctx.fillText(text, i * font_size, drops[i] * font_size);
                drops[i]++;
                if (drops[i] * font_size > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
            }
        }
        setInterval(drawMatrix, 40);
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const newColumns = canvas.width / font_size;
            drops = [];
            for (let x = 0; x < newColumns; x++) {
                drops[x] = 1;
            }
        });
    }
});

const slidesWrapper = document.querySelector('.slider-container .slides-wrapper');
const slides = document.querySelectorAll('.slider-container .slide');
const prevBtn = document.querySelector('.slider-container .prev-btn');
const nextBtn = document.querySelector('.slider-container .next-btn');

let currentSlide = 0;
const totalSlides = slides.length; 


function goToSlide(slideIndex) {

    const shiftAmount = slideIndex * 20;
    slidesWrapper.style.transform = 'translateX(-' + shiftAmount + '%)';
    

    currentSlide = slideIndex;
}


nextBtn.addEventListener('click', () => {
    let nextSlide = currentSlide + 1;
    
 
    if (nextSlide >= totalSlides) {
        nextSlide = 0;
    }
    

    goToSlide(nextSlide);
});


prevBtn.addEventListener('click', () => {
    let prevSlide = currentSlide - 1;
    

    if (prevSlide < 0) {
        prevSlide = totalSlides - 1; 
    }
    

    goToSlide(prevSlide);
});


goToSlide(0);


document.addEventListener('DOMContentLoaded', function() {
    const githubUsername = 'sinansamiil'; // Senin kullanıcı adın
    const cardElement = document.getElementById('github-card');

    
    fetch(`https://api.github.com/users/${githubUsername}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Kullanıcı bulunamadı');
            }
            return response.json();
        })
        .then(data => {
           
            cardElement.innerHTML = `
                <img src="${data.avatar_url}" alt="${data.name}" class="github-avatar">
                <div class="github-info">
                    <h3>${data.name || data.login}</h3>
                    <p>${data.bio || 'Yazılım Mühendisliği & YBS Öğrencisi'}</p>
                    
                    <div class="github-stats">
                        <div class="github-stat-item">
                            <span>${data.public_repos}</span>
                            <small>Repo</small>
                        </div>
                        <div class="github-stat-item">
                            <span>${data.followers}</span>
                            <small>Takipçi</small>
                        </div>
                        <div class="github-stat-item">
                            <span>${data.following}</span>
                            <small>Takip</small>
                        </div>
                    </div>
                    
                    <a href="${data.html_url}" target="_blank" class="github-btn">
                        <i class="fab fa-github"></i> GitHub Profiline Git
                    </a>
                </div>
            `;
        })
        .catch(error => {
            console.error('GitHub API Hatası:', error);
            cardElement.innerHTML = `
                <div style="text-align: center; color: #e50914;">
                    <p>Veri yüklenirken bir hata oluştu.</p>
                </div>
            `;
        });
});

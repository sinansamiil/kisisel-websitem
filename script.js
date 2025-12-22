/* =========================================
   1. GÜVENLİ MOBİL MENÜ
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
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
    }
});

/* =========================================
   2. SCROLL ANİMASYONLARI
   ========================================= */
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

const hiddenElements = document.querySelectorAll('.hidden');
hiddenElements.forEach((el) => observer.observe(el));

/* =========================================
   3. TEXT SCRAMBLE EFEKTİ
   ========================================= */
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

/* =========================================
   4. MATRIX BACKGROUND
   ========================================= */
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
        for (let x = 0; x < columns; x++) { drops[x] = 1; }
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
            for (let x = 0; x < newColumns; x++) { drops[x] = 1; }
        });
    }
});

/* =========================================
   5. GITHUB API (TOKENSIZ VE HAFIZALI)
   ========================================= */
document.addEventListener('DOMContentLoaded', function() {
    const username = 'sinansamiil'; 
    const container = document.getElementById('github-content');
    
    // Hafıza Ayarları (Token derdi yok, kota derdi yok)
    const CACHE_KEY = 'github_data_v2';
    const CACHE_TIME = 'github_time_v2';
    const EXPIRE_TIME = 1000 * 60 * 60; // 1 Saat hafızada tut

    if (!container) return;

    // Arayüzü Güncelleme Fonksiyonu
    function renderGitHubCard(data) {
        container.innerHTML = `
            <img src="${data.avatar_url}" alt="${data.login}" class="github-avatar">
            <div class="github-info">
                <h3>${data.login}</h3>
                <p>${data.bio ? data.bio : 'Yazılım Mühendisliği & YBS Öğrencisi'}</p>
                <div class="github-stats">
                    <div class="github-stat-item"><span>${data.public_repos}</span><small>Repo</small></div>
                    <div class="github-stat-item"><span>${data.followers}</span><small>Takipçi</small></div>
                    <div class="github-stat-item"><span>${data.following}</span><small>Takip</small></div>
                </div>
                <a href="${data.html_url}" target="_blank" class="github-btn">
                    <i class="fab fa-github"></i> GitHub Profiline Git
                </a>
            </div>
        `;
        container.style.justifyContent = 'flex-start';
    }

    // 1. Önce Hafızaya Bak
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTime = localStorage.getItem(CACHE_TIME);
    const now = new Date().getTime();

    if (cachedData && cachedTime && (now - cachedTime < EXPIRE_TIME)) {
        console.log("✅ GitHub verisi hafızadan yüklendi (Kota harcanmadı).");
        renderGitHubCard(JSON.parse(cachedData));
        return; // İşlem bitti, GitHub'a gitme
    }

    // 2. Hafızada yoksa veya eskiyse GitHub'a git (TOKEN YOK)
    console.log("🌍 GitHub'dan yeni veri çekiliyor...");
    fetch(`https://api.github.com/users/${username}`)
        .then(response => {
            if (!response.ok) {
                // Kota dolmuşsa (403 hatası)
                if(response.status === 403) throw new Error("Kota Doldu");
                throw new Error("Veri Alınamadı");
            }
            return response.json();
        })
        .then(data => {
            renderGitHubCard(data);
            // Veriyi hafızaya kaydet
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(CACHE_TIME, now);
        })
        .catch(error => {
            console.error(error);
            // Hata olursa (Kota dolarsa) manuel kart göster
            container.innerHTML = `
                <div style="text-align: center; color: #e50914; padding: 20px;">
                    <h3>sinansamiil</h3>
                    <p>Yazılım Mühendisliği & YBS Öğrencisi</p>
                    <a href="https://github.com/${username}" target="_blank" class="github-btn">GitHub'a Git</a>
                </div>
            `;
        });
});

/* =========================================
   1. MOBİL MENÜ (HAMBURGER)
   ========================================= */
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Linklere tıklanınca menüyü kapat
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

/* =========================================
   2. SCROLL ANİMASYONLARI (Görünür Olma)
   ========================================= */
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


/* =========================================
   3. TEXT SCRAMBLE (Yazı Karıştırma Efekti)
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
   4. MATRIX BACKGROUND EFEKTİ
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
        for (let x = 0; x < columns; x++) {
            drops[x] = 1;
        }
        function drawMatrix() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ff0000ff'; // Matrix Rengi
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


/* =========================================
   5. GITHUB API ENTEGRASYONU (DÜZELTİLMİŞ)
   ========================================= */
document.addEventListener('DOMContentLoaded', function() {
    console.log("GitHub Scripti Başlatılıyor...");

    const username = 'sinansamiil';
    const container = document.getElementById('github-content');
    
    // -----------------------------------------------------------
    // ÖNEMLİ: Token'ın burada tanımlı
    const token = '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'; 
    // -----------------------------------------------------------

    // Eğer kapsayıcı kutu yoksa dur (Hata verme)
    if (!container) return;

    // Verileri Çek
    fetch(`https://api.github.com/users/${username}`, {
        headers: {
            'Authorization': `token ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            if (response.status === 401) throw new Error("HATA 401: Token Geçersiz!");
            if (response.status === 404) throw new Error("HATA 404: Kullanıcı Bulunamadı!");
            throw new Error(`Hata Kodu: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        // BAŞARILI! Kartı oluştur
        container.innerHTML = `
            <img src="${data.avatar_url}" alt="${data.login}" class="github-avatar">
            
            <div class="github-info">
                <h3>${data.login}</h3>
                <p>${data.bio ? data.bio : 'Yazılım Mühendisliği & YBS Öğrencisi'}</p>
                
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
        // Kart stilini düzenle
        container.style.justifyContent = 'flex-start';
        console.log("GitHub verileri başarıyla yüklendi.");
    })
    .catch(error => {
        console.error("GitHub API Hatası:", error);
        container.innerHTML = `
            <div style="text-align: center; color: #e50914;">
                <p><i class="fas fa-exclamation-triangle"></i> Veri Çekilemedi</p>
                <p style="font-size: 0.8rem; color: #ccc;">${error.message}</p>
            </div>
        `;
    });
});

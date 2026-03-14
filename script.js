// --- 1. Logika Hamburger Menu (Mobile) ---
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li a');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('is-active');
    navLinks.classList.toggle('active');
});

navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (mobileMenu.classList.contains('is-active')) {
            mobileMenu.classList.remove('is-active');
            navLinks.classList.remove('active');
        }
    });
});

// --- 2. Animasi Ketik (Typing Effect) pada Nama ---
const typerName = document.querySelector('.typer-name');
const textToType = 'Herland Enda';
let charIndex = 0;
let isDeleting = false;

function typeReveal() {
    if (!typerName) return; 

    if (!isDeleting) {
        // Mode Mengetik
        typerName.textContent = textToType.substring(0, charIndex + 1);
        charIndex++;
        if (charIndex === textToType.length) {
            isDeleting = true;
            setTimeout(typeReveal, 2000); // Jeda setelah selesai mengetik (2 detik)
            return;
        }
    } else {
        // Mode Menghapus
        typerName.textContent = textToType.substring(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
            isDeleting = false;
            setTimeout(typeReveal, 500); // Jeda sebelum mengetik lagi (0.5 detik)
            return;
        }
    }
    // Kecepatan mengetik (150ms) dan menghapus (100ms)
    const typingSpeed = isDeleting ? 100 : 150;
    setTimeout(typeReveal, typingSpeed);
}
// Jalankan animasi ketik saat web dimuat
window.addEventListener('load', typeReveal);


// --- 3. Animasi Muncul Saat Scroll (Scroll Reveal) ---
const revealElements = document.querySelectorAll('.reveal-on-scroll');

const revealObserverOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
}, revealObserverOptions);

revealElements.forEach(el => {
    revealObserver.observe(el);
});


// ==============================================================
// 4. INTERAKSI 'NAME TAG' BEBAS (TARIK & MELAYANG 2D)
// ==============================================================
const contactBox = document.querySelector('.contact-photo-box');
const photoGantung = document.querySelector('.photo-gantung');
const stringGantung = document.querySelector('.string-gantung');

if (contactBox && photoGantung && stringGantung) {
    let isDragging = false;
    let startX = 0, startY = 0;
    let currentDx = 0, currentDy = 0;
    
    // Tinggi awal tali sesuai di CSS (250px)
    const initialStringHeight = 250; 

    // Fungsi menghitung sudut (Trigonometri) dan memanjangkan tali
    function updatePhysics(dx, dy) {
        let vecX = dx;
        let vecY = initialStringHeight + dy;
        
        // Rumus Pythagoras untuk panjang tali baru
        let newHeight = Math.sqrt(vecX * vecX + vecY * vecY);
        
        // Rumus Atan2 untuk mendapatkan derajat kemiringan tali
        let angleRad = Math.atan2(vecX, vecY);
        let angleDeg = angleRad * (180 / Math.PI);

        // Terapkan ke Tali: Umpan balik arah yang berlawanan dan bertambah panjang
        stringGantung.style.height = `${newHeight}px`;
        stringGantung.style.transform = `translateX(-50%) rotate(${-angleDeg}deg)`;

        // Terapkan ke Foto: Bisa ditarik bebas (X dan Y) dan ikut miring sesuai sudut tali
        photoGantung.style.transform = `translateX(calc(-50% + ${dx}px)) translateY(${dy}px) rotate(${-angleDeg}deg)`;
    }

    // --- Interaksi Mouse (Laptop) ---
    photoGantung.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - currentDx;
        startY = e.clientY - currentDy;
        
        // Matikan transisi & animasi otomatis
        photoGantung.style.transition = 'none';
        stringGantung.style.transition = 'none';
        contactBox.style.animationPlayState = 'paused';
        document.body.style.userSelect = 'none'; // Cegah blok teks biru saat narik
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentDx = e.clientX - startX;
        currentDy = e.clientY - startY;
        updatePhysics(currentDx, currentDy); // Lakukan update posisi bebas
    });

    window.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        document.body.style.userSelect = 'auto';
        
        // Efek Spring/Membal super mulus ke titik 0 saat dilepas
        photoGantung.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        stringGantung.style.transition = 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        
        currentDx = 0; currentDy = 0;
        updatePhysics(0, 0); // Kembalikan ke posisi lurus
        
        // Lanjutkan animasi swing melayang setelah efek membal selesai
        setTimeout(() => {
            contactBox.style.animationPlayState = 'running';
            photoGantung.style.transition = 'none'; 
            stringGantung.style.transition = 'none';
        }, 800);
    });

    // --- Interaksi Touch (HP / Tablet) ---
    photoGantung.addEventListener('touchstart', (e) => {
        isDragging = true;
        startX = e.touches[0].clientX - currentDx;
        startY = e.touches[0].clientY - currentDy;
        photoGantung.style.transition = 'none';
        stringGantung.style.transition = 'none';
        contactBox.style.animationPlayState = 'paused';
    }, { passive: false });

    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault(); // Cegah layar HP ikut scroll saat narik foto
        currentDx = e.touches[0].clientX - startX;
        currentDy = e.touches[0].clientY - startY;
        updatePhysics(currentDx, currentDy);
    }, { passive: false });

    window.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        photoGantung.style.transition = 'transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        stringGantung.style.transition = 'height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)';
        currentDx = 0; currentDy = 0;
        updatePhysics(0, 0);
        setTimeout(() => {
            contactBox.style.animationPlayState = 'running';
            photoGantung.style.transition = 'none';
            stringGantung.style.transition = 'none';
        }, 800);
    });
}


// ==============================================================
// 5. LOGIKA TABS (PROYEK, SERTIFIKAT, TEKNOLOGI)
// ==============================================================
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Hapus active dari semua tab
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Tambah active ke tab yang diklik
        button.classList.add('active');
        const targetId = button.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');
    });
});


// ==============================================================
// 6. LOGIKA FILTER & TOMBOL BUKA-TUTUP PROYEK
// ==============================================================
const btnToggleProject = document.getElementById('show-more-project');
const extraProjects = document.querySelectorAll('.extra-project');
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.porto-card');
let isExpanded = false; 

function applyFilter() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const filterValue = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';

    portfolioCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        const isExtra = card.classList.contains('extra-project');
        const isCollapsed = card.classList.contains('collapsed');

        const matchesCategory = (filterValue === 'all' || filterValue === cardCategory);

        if (matchesCategory && (!isExtra || !isCollapsed)) {
            card.classList.remove('hide');
            card.style.opacity = '0';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transition = 'opacity 0.4s ease';
            }, 50);
        } else {
            card.classList.add('hide'); 
        }
    });
}

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        applyFilter();
    });
});

if (btnToggleProject) {
    btnToggleProject.addEventListener('click', () => {
        isExpanded = !isExpanded;
        
        extraProjects.forEach(project => {
            if (isExpanded) {
                project.classList.remove('collapsed'); 
            } else {
                project.classList.add('collapsed'); 
            }
        });

        btnToggleProject.textContent = isExpanded ? 'Tutup Proyek Tambahan' : 'Lihat Proyek Lainnya';
        applyFilter(); 
    });
}

window.addEventListener('DOMContentLoaded', applyFilter);


// ==============================================================
// 7. LOGIKA LIGHTBOX MODAL UNTUK SERTIFIKAT
// ==============================================================
const modal = document.getElementById("cert-modal");
const modalImg = document.getElementById("modal-img");
const captionText = document.getElementById("modal-caption");
const certImages = document.querySelectorAll(".cert-card img");
const closeModal = document.querySelector(".close-modal");

if (modal) {
    certImages.forEach(img => {
        img.addEventListener("click", function() {
            modal.classList.add('show');
            modalImg.src = this.src; 
            captionText.innerHTML = this.nextElementSibling.innerHTML; 
        });
    });

    closeModal.addEventListener("click", () => {
        modal.classList.remove('show');
    });

    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}
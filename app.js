// ============================================================================
// APP LOGIC - PINK PUPPY GRADUATION TRIBUTE & INTERACTIVE 3D WISH BOOK 🌸🐶📖
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initSakuraFallingPetals();
  initFloatingBackground();
  loadConfigData();
  initIntroEnvelope();
  initAudioSystem();
  initCapTossAndReactions();
  initPolaroidGallery();
  initWishesBook();
  initAddWishModal();
  initReactionButtons();
});

// ============================================================================
// 0. CONTINUOUS FALLING SAKURA (HOA ANH ĐÀO RƠI LIÊN TỤC)
// ============================================================================
function initSakuraFallingPetals() {
  const canvas = document.getElementById('sakuraCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const petals = [];
  const petalCount = 45; // Số lượng cánh hoa vừa phải, mượt mà và không rối mắt

  class Petal {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : -20;
      this.size = 10 + Math.random() * 12; // Kích thước cánh hoa
      this.speedY = 1.0 + Math.random() * 1.5; // Tốc độ rơi
      this.speedX = -0.5 + Math.random() * 1.2; // Tốc độ lướt ngang
      this.rotation = Math.random() * Math.PI * 2;
      this.rotationSpeed = (Math.random() - 0.5) * 0.03;
      this.swing = Math.random() * Math.PI * 2;
      this.swingSpeed = 0.02 + Math.random() * 0.02;
      this.opacity = 0.5 + Math.random() * 0.45;
      this.flip = Math.random() * Math.PI * 2;
      this.flipSpeed = 0.03 + Math.random() * 0.03;
      
      // Màu sắc hồng tự nhiên của hoa anh đào
      const colors = [
        'rgba(255, 182, 193, ',
        'rgba(255, 192, 203, ',
        'rgba(255, 105, 180, ',
        'rgba(255, 228, 225, '
      ];
      this.baseColor = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.y += this.speedY;
      this.swing += this.swingSpeed;
      this.x += Math.sin(this.swing) * 0.8 + this.speedX;
      this.rotation += this.rotationSpeed;
      this.flip += this.flipSpeed;

      if (this.y > height + 25 || this.x < -30 || this.x > width + 30) {
        this.reset(false);
      }
    }

    draw() {
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      ctx.scale(Math.sin(this.flip), 1); // Hiệu ứng lật 3D trong không gian

      // Vẽ cánh hoa hình giọt nước/trái tim hoa anh đào mềm mại
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size / 2, -this.size / 2, -this.size, this.size / 3, 0, this.size);
      ctx.bezierCurveTo(this.size, this.size / 3, this.size / 2, -this.size / 2, 0, 0);
      
      const grad = ctx.createLinearGradient(0, 0, 0, this.size);
      grad.addColorStop(0, `${this.baseColor}${this.opacity * 0.7})`);
      grad.addColorStop(1, `${this.baseColor}${this.opacity})`);
      
      ctx.fillStyle = grad;
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < petalCount; i++) {
    petals.push(new Petal());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < petals.length; i++) {
      petals[i].update();
      petals[i].draw();
    }
    requestAnimationFrame(animate);
  }

  animate();
}

// ============================================================================
// 1. FLOATING BACKGROUND ELEMENTS (Paw prints, Sakura, Hearts, Sparkles)
// ============================================================================
function initFloatingBackground() {
  const bgContainer = document.getElementById('floatingBg');
  if (!bgContainer) return;

  const symbols = ['🌸', '🐾', '💖', '✨', '🐶', '🎓', '🎀', '🦴'];
  const count = 22;

  for (let i = 0; i < count; i++) {
    const item = document.createElement('div');
    item.className = 'floating-item';
    item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    item.style.left = `${Math.random() * 95}vw`;
    item.style.animationDuration = `${8 + Math.random() * 12}s`;
    item.style.animationDelay = `${Math.random() * 10}s`;
    item.style.fontSize = `${1.2 + Math.random() * 1.5}rem`;
    bgContainer.appendChild(item);
  }
}

// ============================================================================
// 2. LOAD DATA FROM CONFIG.JS
// ============================================================================
function loadConfigData() {
  if (typeof GRADUATION_CONFIG === 'undefined') return;

  const { graduate, mainLetter } = GRADUATION_CONFIG;

  // Set Graduate Information
  const gradNameEl = document.getElementById('gradName');
  const certRecipientEl = document.getElementById('certRecipientName');
  const gradNicknameEl = document.getElementById('gradNickname');
  const gradUniEl = document.getElementById('gradUni');
  const gradMajorEl = document.getElementById('gradMajor');
  const gradQuoteEl = document.getElementById('gradQuote');
  const gradAvatarEl = document.getElementById('gradAvatar');
  const gradDegreeBadgeEl = document.getElementById('gradDegreeBadge');

  if (gradNameEl) gradNameEl.textContent = graduate.name;
  if (certRecipientEl) certRecipientEl.textContent = graduate.name;
  if (gradNicknameEl) gradNicknameEl.textContent = graduate.nickname;
  if (gradUniEl) gradUniEl.textContent = graduate.university;
  if (gradMajorEl) gradMajorEl.textContent = `${graduate.major} 🎓 Class of ${graduate.gradYear}`;
  if (gradQuoteEl) gradQuoteEl.textContent = graduate.favoriteQuote;
  if (gradAvatarEl) {
    gradAvatarEl.src = graduate.avatar;
    gradAvatarEl.alt = graduate.name;
  }
  if (gradDegreeBadgeEl) gradDegreeBadgeEl.textContent = graduate.degreeType;

  // Set Main Congratulatory Letter
  const letterTitleEl = document.getElementById('mainLetterTitle');
  const letterContentEl = document.getElementById('mainLetterContent');
  const letterSignatureEl = document.getElementById('mainLetterSignature');

  if (letterTitleEl) letterTitleEl.textContent = mainLetter.title;
  if (letterSignatureEl) letterSignatureEl.textContent = mainLetter.signature;

  if (letterContentEl && mainLetter.paragraphs) {
    letterContentEl.innerHTML = mainLetter.paragraphs
      .map(p => `<p>${p}</p>`)
      .join('');
  }
}

// ============================================================================
// 3. INTRO ENVELOPE MODAL (GIFT OPENING)
// ============================================================================
function initIntroEnvelope() {
  const overlay = document.getElementById('introOverlay');
  const openBtn = document.getElementById('openGiftBtn');
  const envelopeBox = document.getElementById('envelopeBox');

  if (!overlay || !openBtn) return;

  const handleOpen = () => {
    // Play celebratory sound
    playFanfareChime();
    
    // Confetti explosion
    triggerBigConfetti();

    // Animate envelope
    if (envelopeBox) {
      envelopeBox.style.transform = 'scale(1.1) translateY(-20px)';
    }

    setTimeout(() => {
      overlay.classList.add('hide-envelope');
      // Auto start soft bg melody if enabled
      startBgMelody();
    }, 650);
  };

  openBtn.addEventListener('click', handleOpen);
  envelopeBox?.addEventListener('click', handleOpen);
}

// ============================================================================
// 4. PHOTO MEMORY GALLERY (VỚI CÁC KIỂU KHUNG HÌNH NGHỆ THUẬT)
// ============================================================================
function initPolaroidGallery() {
  const galleryGrid = document.getElementById('memoryGrid');
  if (!galleryGrid || typeof GRADUATION_CONFIG === 'undefined') return;

  const memories = GRADUATION_CONFIG.memories || [];
  galleryGrid.innerHTML = memories.map((item, idx) => {
    const style = item.frameStyle || 'polaroid';
    
    // Tùy biến cấu trúc HTML theo từng loại khung
    let frameDecorHtml = '';
    if (style === 'polaroid') {
      frameDecorHtml = '<div class="washi-tape"></div>';
    } else if (style === 'puppy') {
      frameDecorHtml = `
        <div class="frame-ears">
          <span>🐾</span>
          <span>🐶</span>
          <span>🐾</span>
        </div>
      `;
    } else if (style === 'heart') {
      frameDecorHtml = '<div class="frame-heart-badge">💖 Xinh Đẹp</div>';
    } else if (style === 'magazine') {
      frameDecorHtml = `
        <div class="mag-header">
          <span>GRADUATE ISSUE</span>
          <span>VOL. 2026</span>
        </div>
      `;
    } else if (style === 'rosegold') {
      frameDecorHtml = '<div class="corner-rose">🌸</div>';
    } else if (style === 'film') {
      frameDecorHtml = '<div class="film-sprockets"></div>';
    }

    return `
      <div class="photo-frame-card frame-${style}" data-idx="${idx}">
        ${frameDecorHtml}
        <div class="frame-img-wrapper">
          <img src="${item.img}" alt="${item.title}" class="frame-img" loading="lazy">
          <img src="${item.dogGif}" alt="Dog sticker" class="frame-dog-sticker">
        </div>
        <div class="polaroid-caption">
          <span class="polaroid-tag">${item.tag}</span>
          <h4 class="polaroid-title">${item.title}</h4>
          <p class="polaroid-desc">${item.desc}</p>
        </div>
      </div>
    `;
  }).join('');

  // Lightbox expansion click
  const lightbox = document.getElementById('photoLightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxDesc = document.getElementById('lightboxDesc');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryGrid.querySelectorAll('.photo-frame-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = card.dataset.idx;
      const mem = memories[idx];
      if (mem && lightbox && lightboxImg) {
        lightboxImg.src = mem.img;
        if (lightboxTitle) lightboxTitle.textContent = mem.title;
        if (lightboxDesc) lightboxDesc.textContent = mem.desc;
        lightbox.classList.add('active');
        playSparkleSound();
      }
    });
  });

  if (lightboxClose && lightbox) {
    lightboxClose.addEventListener('click', () => lightbox.classList.remove('active'));
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) lightbox.classList.remove('active');
    });
  }
}

// ============================================================================
// 5. THE BIG INTERACTIVE BOOK OF WISHES 📖✨ (3D PAGE FLIP ENGINE)
// ============================================================================
let currentLeftPageIndex = 0;
let allWishes = [];
let isFlipping = false;

function initWishesBook() {
  const defaultWishes = (typeof GRADUATION_CONFIG !== 'undefined' && GRADUATION_CONFIG.wishesBook) 
    ? GRADUATION_CONFIG.wishesBook 
    : [];
  
  const savedWishes = JSON.parse(localStorage.getItem('grad_custom_wishes') || '[]');
  allWishes = [...defaultWishes, ...savedWishes];

  const book3d = document.getElementById('book3d');
  const bookControls = document.getElementById('bookControls');
  const openBookBtn = document.getElementById('openBookBtn');
  const closeBookBtn = document.getElementById('closeBookBtn');
  const prevPageBtn = document.getElementById('prevPageBtn');
  const nextPageBtn = document.getElementById('nextPageBtn');
  const bookLeftPage = document.getElementById('bookLeftPage');
  const bookRightPage = document.getElementById('bookRightPage');

  // Render initial static content
  renderBookSpread();

  // 1. OPEN HARDCOVER BOOK (LẬT MỞ BÌA SAU KHI CLICK)
  if (openBookBtn) {
    openBookBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playPageFlipSound();
      playSparkleSound();
      
      book3d.classList.add('is-open');
      
      setTimeout(() => {
        if (bookControls) bookControls.style.display = 'flex';
        triggerSparkleConfetti();
      }, 500);
    });
  }

  // 2. CLOSE HARDCOVER BOOK (GẤP BÌA LẠI)
  if (closeBookBtn) {
    closeBookBtn.addEventListener('click', () => {
      playPageFlipSound();
      if (bookControls) bookControls.style.display = 'none';
      book3d.classList.remove('is-open');
    });
  }

  // 3. FLIP NEXT PAGE (LẬT TRANG TIẾP THEO)
  const handleNextPage = () => {
    if (isFlipping) return;
    if (currentLeftPageIndex + 2 < allWishes.length) {
      isFlipping = true;
      playPageFlipSound();

      const flippingLeaf = document.getElementById('flippingLeaf');
      const leafFront = document.getElementById('leafFrontContent');
      const leafBack = document.getElementById('leafBackContent');

      // Chuẩn bị nội dung cho 2 mặt của lá lật
      const currentRightItem = allWishes[currentLeftPageIndex + 1];
      const incomingLeftItem = allWishes[currentLeftPageIndex + 2];

      if (leafFront && currentRightItem) {
        leafFront.innerHTML = createWishCardHTML(currentRightItem);
      }
      if (leafBack && incomingLeftItem) {
        leafBack.innerHTML = createWishCardHTML(incomingLeftItem);
      }

      // Kích hoạt animation lật trang 3D
      flippingLeaf.className = 'flipping-leaf flip-forward';

      setTimeout(() => {
        currentLeftPageIndex += 2;
        renderBookSpread();
        flippingLeaf.className = 'flipping-leaf';
        isFlipping = false;
      }, 820);
    }
  };

  // 4. FLIP PREVIOUS PAGE (LẬT TRANG TRƯỚC)
  const handlePrevPage = () => {
    if (isFlipping) return;
    if (currentLeftPageIndex >= 2) {
      isFlipping = true;
      playPageFlipSound();

      const flippingLeaf = document.getElementById('flippingLeaf');
      const leafFront = document.getElementById('leafFrontContent');
      const leafBack = document.getElementById('leafBackContent');

      // Chuẩn bị nội dung cho 2 mặt của lá lật
      const currentLeftItem = allWishes[currentLeftPageIndex];
      const incomingRightItem = allWishes[currentLeftPageIndex - 1];

      if (leafBack && currentLeftItem) {
        leafBack.innerHTML = createWishCardHTML(currentLeftItem);
      }
      if (leafFront && incomingRightItem) {
        leafFront.innerHTML = createWishCardHTML(incomingRightItem);
      }

      // Kích hoạt animation lật trang 3D lùi
      flippingLeaf.className = 'flipping-leaf flip-backward';

      setTimeout(() => {
        currentLeftPageIndex -= 2;
        renderBookSpread();
        flippingLeaf.className = 'flipping-leaf';
        isFlipping = false;
      }, 820);
    }
  };

  if (nextPageBtn) nextPageBtn.addEventListener('click', handleNextPage);
  if (prevPageBtn) prevPageBtn.addEventListener('click', handlePrevPage);

  // Click trực tiếp vào trang sách để lật trang
  if (bookRightPage) bookRightPage.addEventListener('click', handleNextPage);
  if (bookLeftPage) bookLeftPage.addEventListener('click', handlePrevPage);
}

function renderBookSpread() {
  const leftContainer = document.getElementById('leftPageContent');
  const rightContainer = document.getElementById('rightPageContent');
  const leftPageNum = document.getElementById('leftPageNum');
  const rightPageNum = document.getElementById('rightPageNum');
  const indicator = document.getElementById('currentPageIndicator');
  const prevBtn = document.getElementById('prevPageBtn');
  const nextBtn = document.getElementById('nextPageBtn');

  const totalPages = allWishes.length;
  const leftItem = allWishes[currentLeftPageIndex];
  const rightItem = allWishes[currentLeftPageIndex + 1];

  // Render Left Page
  if (leftContainer) {
    if (leftItem) {
      leftContainer.innerHTML = createWishCardHTML(leftItem);
      if (leftPageNum) leftPageNum.textContent = `Trang ${currentLeftPageIndex + 1}`;
    } else {
      leftContainer.innerHTML = createEmptyPageHTML();
      if (leftPageNum) leftPageNum.textContent = `Trang ${currentLeftPageIndex + 1}`;
    }
  }

  // Render Right Page
  if (rightContainer) {
    if (rightItem) {
      rightContainer.innerHTML = createWishCardHTML(rightItem);
      if (rightPageNum) rightPageNum.textContent = `Trang ${currentLeftPageIndex + 2}`;
    } else {
      rightContainer.innerHTML = createEmptyPageHTML();
      if (rightPageNum) rightPageNum.textContent = `Trang ${currentLeftPageIndex + 2}`;
    }
  }

  // Update Page Indicator
  if (indicator) {
    indicator.textContent = `Trang ${currentLeftPageIndex + 1} - ${Math.min(currentLeftPageIndex + 2, totalPages)} / ${totalPages} trang`;
  }

  // Update Prev / Next buttons state
  if (prevBtn) prevBtn.disabled = (currentLeftPageIndex === 0);
  if (nextBtn) nextBtn.disabled = (currentLeftPageIndex + 2 >= totalPages);
}

function createWishCardHTML(item) {
  return `
    <div class="wish-page-card">
      <div class="wish-card-header">
        <img src="${item.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}" alt="${item.author}" class="wish-avatar">
        <div class="wish-meta">
          <h4 class="wish-author-name">${item.author}</h4>
          <span class="wish-badge">${item.badge || 'Bạn thân'}</span>
        </div>
        <span class="wish-dog-sticker">${item.dogSticker || '🐶'}</span>
      </div>
      <div class="wish-body-text">
        ${item.wish}
      </div>
      <div class="wish-page-date">📅 Ngày gửi: ${item.date || 'Hôm nay'}</div>
    </div>
  `;
}

function createEmptyPageHTML() {
  return `
    <div class="empty-page-wrapper">
      <div class="empty-dog-icon">🐶✨</div>
      <p>Trang này đang chờ lời chúc của bạn!</p>
      <small>Nhấn "Viết Lời Chúc Mới ✍️" bên dưới để ghi thêm vào sách nha.</small>
    </div>
  `;
}

// ============================================================================
// 6. MODAL FORM: ADD NEW WISH INTO BOOK
// ============================================================================
function initAddWishModal() {
  const modal = document.getElementById('addWishModal');
  const openModalBtn = document.getElementById('openWishModalBtn');
  const closeModalBtn = document.getElementById('closeWishModalBtn');
  const cancelBtn = document.getElementById('cancelWishBtn');
  const form = document.getElementById('newWishForm');
  const stickerOptions = document.getElementById('stickerOptions');

  let selectedSticker = '🐶';

  // Sticker Selector
  if (stickerOptions) {
    stickerOptions.querySelectorAll('.sticker-choice').forEach(choice => {
      choice.addEventListener('click', () => {
        stickerOptions.querySelectorAll('.sticker-choice').forEach(c => c.classList.remove('selected'));
        choice.classList.add('selected');
        selectedSticker = choice.dataset.sticker;
        playBarkSound();
      });
    });
  }

  // Open Modal
  if (openModalBtn && modal) {
    openModalBtn.addEventListener('click', () => {
      modal.classList.add('active');
    });
  }

  // Close Modal
  const closeModal = () => modal && modal.classList.remove('active');
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  // Form Submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const authorName = document.getElementById('authorName').value.trim();
      const authorBadge = document.getElementById('authorBadge').value.trim();
      const wishMessage = document.getElementById('wishMessage').value.trim();

      if (!authorName || !wishMessage) return;

      const randomColors = ['#FFE4E8', '#FFF0F5', '#FDE2E4', '#FFE5EC', '#FFF3E2', '#E8F4F8'];
      const chosenColor = randomColors[Math.floor(Math.random() * randomColors.length)];

      const newWishItem = {
        author: authorName,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(authorName)}`,
        badge: authorBadge || 'Bạn thân cưng xỉu',
        dogSticker: selectedSticker,
        colorTheme: chosenColor,
        wish: wishMessage,
        date: new Date().toLocaleDateString('vi-VN')
      };

      // Save to localStorage
      const saved = JSON.parse(localStorage.getItem('grad_custom_wishes') || '[]');
      saved.push(newWishItem);
      localStorage.setItem('grad_custom_wishes', JSON.stringify(saved));

      // Append to memory array
      allWishes.push(newWishItem);

      // Make sure book is open in 3D
      const book3d = document.getElementById('book3d');
      const bookControls = document.getElementById('bookControls');

      if (book3d) book3d.classList.add('is-open');
      if (bookControls) bookControls.style.display = 'flex';

      // Set page index to where the new wish is
      currentLeftPageIndex = Math.floor((allWishes.length - 1) / 2) * 2;
      renderBookSpread();

      // Reset & Close form
      form.reset();
      closeModal();

      // Celebration
      playFanfareChime();
      playPageFlipSound();
      triggerBigConfetti();
      alert(`Yay! Lời chúc của "${authorName}" đã được lưu vào Quyển Sách Kỷ Niệm! 🌸📖`);
    });
  }
}

// ============================================================================
// 7. CAP TOSS & REACTION BUTTONS
// ============================================================================
let capCount = 0;

function initCapTossAndReactions() {
  const capCountEl = document.getElementById('capCount');
  const tossCapNavBtn = document.getElementById('tossCapNavBtn');
  const throwCapHeroBtn = document.getElementById('throwCapBtn');
  const barkBtn = document.getElementById('interactiveBarkBtn');
  const sendLoveBtn = document.getElementById('sendLoveBtn');

  const doCapToss = () => {
    capCount++;
    if (capCountEl) capCountEl.textContent = capCount;
    playFanfareChime();
    triggerGraduationCapExplosion();
  };

  if (tossCapNavBtn) tossCapNavBtn.addEventListener('click', doCapToss);
  if (throwCapHeroBtn) throwCapHeroBtn.addEventListener('click', doCapToss);

  if (barkBtn) {
    barkBtn.addEventListener('click', () => {
      playBarkSound();
      spawnFloatingReaction('🐶', window.innerWidth / 2, window.innerHeight / 2);
    });
  }

  if (sendLoveBtn) {
    sendLoveBtn.addEventListener('click', () => {
      playSparkleSound();
      for (let i = 0; i < 7; i++) {
        setTimeout(() => {
          spawnFloatingReaction('💖', (window.innerWidth / 2) + (Math.random() * 200 - 100), (window.innerHeight / 2) + (Math.random() * 100 - 50));
        }, i * 100);
      }
    });
  }
}

function initReactionButtons() {
  document.querySelectorAll('.reaction-bubble-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const emoji = btn.dataset.reaction || '💖';
      const cntEl = btn.querySelector('.react-cnt');
      if (cntEl) {
        let val = parseInt(cntEl.textContent) || 0;
        cntEl.textContent = val + 1;
      }
      playSparkleSound();
      const rect = btn.getBoundingClientRect();
      spawnFloatingReaction(emoji, rect.left + rect.width / 2, rect.top);
    });
  });
}

function spawnFloatingReaction(emoji, x, y) {
  const particle = document.createElement('div');
  particle.className = 'pop-reaction-particle';
  particle.textContent = emoji;
  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.style.setProperty('--tx', `${(Math.random() - 0.5) * 120}px`);
  document.body.appendChild(particle);

  setTimeout(() => particle.remove(), 1200);
}

// ============================================================================
// 8. CELEBRATION EFFECTS (CONFETTI & CAP TOSS)
// ============================================================================
function triggerBigConfetti() {
  if (typeof confetti !== 'function') return;

  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    colors: ['#FF69B4', '#FFB6C1', '#FFD700', '#FF1493', '#FFFFFF']
  };

  function fire(particleRatio, opts) {
    confetti(Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio)
    }));
  }

  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

function triggerSparkleConfetti() {
  if (typeof confetti !== 'function') return;
  confetti({
    particleCount: 50,
    angle: 60,
    spread: 55,
    origin: { x: 0 },
    colors: ['#FF69B4', '#FFD700', '#FFE4E8']
  });
  confetti({
    particleCount: 50,
    angle: 120,
    spread: 55,
    origin: { x: 1 },
    colors: ['#FF69B4', '#FFD700', '#FFE4E8']
  });
}

function triggerGraduationCapExplosion() {
  triggerBigConfetti();
  // Spawn 6 large emoji caps throwing upward
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      const cap = document.createElement('div');
      cap.className = 'pop-reaction-particle';
      cap.textContent = ['🎓', '🐾', '💖', '🦴'][Math.floor(Math.random() * 4)];
      cap.style.fontSize = '3rem';
      cap.style.left = `${20 + Math.random() * 60}vw`;
      cap.style.top = `${60 + Math.random() * 20}vh`;
      cap.style.setProperty('--tx', `${(Math.random() - 0.5) * 160}px`);
      document.body.appendChild(cap);
      setTimeout(() => cap.remove(), 1200);
    }, i * 80);
  }
}

// ============================================================================
// 9. WEB AUDIO API SYNTHESIZER (PUPPY BARK, PAGE FLIP, CHIMES, MELODY)
// ============================================================================
let audioCtx = null;
let isMusicPlaying = false;
let melodyInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playSparkleSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.05);

    gain.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.05 + 0.3);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + i * 0.05);
    osc.stop(ctx.currentTime + i * 0.05 + 0.35);
  });
}

function playFanfareChime() {
  const ctx = getAudioContext();
  if (!ctx) return;

  const chord = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
  chord.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);

    gain.gain.setValueAtTime(0.12, ctx.currentTime + idx * 0.07);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + idx * 0.07);
    osc.stop(ctx.currentTime + idx * 0.07 + 0.85);
  });
}

function playPageFlipSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Soft white noise burst with filter for realistic page turning whoosh
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1200, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.15);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.12, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start();
}

function playBarkSound() {
  const ctx = getAudioContext();
  if (!ctx) return;

  // Cute woof synthesis (two quick modulated sine/triangle chirps)
  [0, 0.12].forEach((delay) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, ctx.currentTime + delay);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + delay + 0.09);

    gain.gain.setValueAtTime(0.18, ctx.currentTime + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + delay);
    osc.stop(ctx.currentTime + delay + 0.1);
  });
}

// Gentle celebratory background music loop
function startBgMelody() {
  if (isMusicPlaying) return;
  isMusicPlaying = true;

  const musicStatus = document.getElementById('musicStatus');
  if (musicStatus) musicStatus.textContent = 'BẬT';

  const notes = [
    523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 659.25,
    783.99, 880.00, 783.99, 659.25, 587.33, 523.25, 587.33, 523.25
  ];
  let noteIndex = 0;

  melodyInterval = setInterval(() => {
    if (!isMusicPlaying) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(notes[noteIndex % notes.length], ctx.currentTime);

    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);

    noteIndex++;
  }, 420);
}

function stopBgMelody() {
  isMusicPlaying = false;
  if (melodyInterval) clearInterval(melodyInterval);
  const musicStatus = document.getElementById('musicStatus');
  if (musicStatus) musicStatus.textContent = 'TẮT';
}

function initAudioSystem() {
  const toggleBtn = document.getElementById('audioToggleBtn');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    if (isMusicPlaying) {
      stopBgMelody();
    } else {
      startBgMelody();
    }
  });
}

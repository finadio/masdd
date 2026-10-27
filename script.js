// ========================================================
// LOGIKA BUKU MINIMALIS MONOKROM - SURAT NANA
// ========================================================

document.addEventListener('DOMContentLoaded', () => {
  // Elements Slide
  const slides = document.querySelectorAll('.page-slide');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const currentSlideNumEl = document.getElementById('current-slide-num');
  const totalSlideNumEl = document.getElementById('total-slide-num');
  const bookSheet = document.getElementById('book-sheet');

  // Elements Audio
  const bgAudio = document.getElementById('bg-audio');
  const audioToggle = document.getElementById('audio-toggle');
  const audioLabel = audioToggle ? audioToggle.querySelector('.audio-label') : null;

  // 1. Inisialisasi Halaman
  let currentSlide = 1;
  const totalSlides = slides.length;
  if (totalSlideNumEl) totalSlideNumEl.textContent = totalSlides;

  function updateSlideView(direction = 'next') {
    slides.forEach((slide, index) => {
      const slideIndex = index + 1;
      slide.classList.remove('active', 'slide-next', 'slide-prev');

      if (slideIndex === currentSlide) {
        slide.classList.add('active');
        if (direction === 'next') {
          slide.classList.add('slide-next');
        } else {
          slide.classList.add('slide-prev');
        }
      }
    });

    if (currentSlideNumEl) currentSlideNumEl.textContent = currentSlide;

    // Status Tombol Navigasi
    if (prevBtn) prevBtn.disabled = currentSlide === 1;
    if (nextBtn) nextBtn.disabled = currentSlide === totalSlides;
  }

  // Tombol Next & Prev
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      startAudio();
      if (currentSlide < totalSlides) {
        currentSlide++;
        updateSlideView('next');
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      startAudio();
      if (currentSlide > 1) {
        currentSlide--;
        updateSlideView('prev');
      }
    });
  }

  // Navigasi Keyboard (Panah Kiri & Kanan)
  window.addEventListener('keydown', (e) => {
    startAudio();
    if (e.key === 'ArrowRight' && currentSlide < totalSlides) {
      currentSlide++;
      updateSlideView('next');
    } else if (e.key === 'ArrowLeft' && currentSlide > 1) {
      currentSlide--;
      updateSlideView('prev');
    }
  });

  // Navigasi Touch / Swipe di Layar HP
  let touchStartX = 0;
  let touchEndX = 0;

  if (bookSheet) {
    bookSheet.addEventListener('touchstart', (e) => {
      startAudio();
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    bookSheet.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold && currentSlide < totalSlides) {
      currentSlide++;
      updateSlideView('next');
    } else if (touchEndX > touchStartX + swipeThreshold && currentSlide > 1) {
      currentSlide--;
      updateSlideView('prev');
    }
  }

  // 2. Autoplay Audio dengan Penanganan Kebijakan Browser
  let isPlaying = false;
  if (bgAudio) {
    bgAudio.volume = 0.7;

    function startAudio() {
      if (isPlaying) return;

      const playPromise = bgAudio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlaying = true;
            if (audioToggle) audioToggle.classList.add('playing');
            if (audioLabel) audioLabel.textContent = 'Musik Mengalun';
            removeInteractionListeners();
          })
          .catch(err => {
            if (audioLabel) audioLabel.textContent = 'Klik untuk Putar';
            attachInteractionListeners();
          });
      }
    }

    function onFirstInteraction() {
      startAudio();
    }

    function attachInteractionListeners() {
      window.addEventListener('click', onFirstInteraction, { once: true });
      window.addEventListener('pointerdown', onFirstInteraction, { once: true });
      window.addEventListener('touchstart', onFirstInteraction, { once: true });
      window.addEventListener('scroll', onFirstInteraction, { once: true });
      window.addEventListener('keydown', onFirstInteraction, { once: true });
    }

    function removeInteractionListeners() {
      window.removeEventListener('click', onFirstInteraction);
      window.removeEventListener('pointerdown', onFirstInteraction);
      window.removeEventListener('touchstart', onFirstInteraction);
      window.removeEventListener('scroll', onFirstInteraction);
      window.removeEventListener('keydown', onFirstInteraction);
    }

    startAudio();
    window.addEventListener('load', startAudio);

    // Kontrol Musik Manual
    if (audioToggle) {
      audioToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPlaying) {
          bgAudio.pause();
          isPlaying = false;
          audioToggle.classList.remove('playing');
          if (audioLabel) audioLabel.textContent = 'Musik Dijeda';
        } else {
          bgAudio.play().then(() => {
            isPlaying = true;
            audioToggle.classList.add('playing');
            if (audioLabel) audioLabel.textContent = 'Musik Mengalun';
          });
        }
      });
    }
  }
});

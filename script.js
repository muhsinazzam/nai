document.addEventListener('DOMContentLoaded', () => {
    // === AUDIO & OVERLAY LOGIC ===
    const overlay = document.getElementById('welcome-overlay');
    const enterBtn = document.getElementById('enter-btn');
    const audio = document.getElementById('birthday-audio');
    const audioBtn = document.getElementById('play-music-btn');
    let isPlaying = false;

    // Enter Button Click
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            overlay.classList.add('fade-out');
            setTimeout(() => {
                overlay.style.display = 'none';
            }, 1000);

            // Attempt to play audio
            audio.play().then(() => {
                isPlaying = true;
                if (audioBtn) audioBtn.textContent = "⏸ 暂停音乐";
            }).catch(e => {
                console.log("Audio play failed interaction", e);
            });
        });
    }

    // Manual Audio Control
    if (audioBtn) {
        audioBtn.addEventListener('click', () => {
            if (!isPlaying) {
                audio.play().then(() => {
                    isPlaying = true;
                    audioBtn.textContent = "⏸ 暂停音乐";
                });
            } else {
                audio.pause();
                isPlaying = false;
                audioBtn.textContent = "🎵 播放音乐";
            }
        });
    }


    // === BACKGROUND & DECORATIONS ===
    const cards = document.querySelectorAll('.photo-card');
    cards.forEach(card => {
        const randomRotation = Math.random() * 10 - 5;
        card.style.setProperty('--rotation', `${randomRotation}deg`);
    });

    const bgContainer = document.querySelector('.bg-hearts');
    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.classList.add('heart');
        heart.innerHTML = '❤';
        heart.style.left = Math.random() * 100 + 'vw';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
        heart.style.animationDelay = Math.random() * 5 + 's';
        bgContainer.appendChild(heart);
    }

    // === MEMORY GAME LOGIC ===
    const gameContainer = document.querySelector('.memory-game');
    const images = [
        'assets/photo1.jpg',
        'assets/photo2.jpg',
        'assets/photo3.jpg',
        'assets/photo4.jpg'
    ];
    const gameCards = [...images, ...images];
    gameCards.sort(() => 0.5 - Math.random());

    if (gameContainer) {
        gameCards.forEach(imgSrc => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.image = imgSrc;

            card.innerHTML = `
                <div class="front-face">
                    <img src="${imgSrc}" alt="Memory Card">
                </div>
                <div class="back-face">?</div>
            `;
            gameContainer.appendChild(card);
        });
    }

    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchCount = 0;

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flip');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.image === secondCard.dataset.image;

        if (isMatch) {
            disableCards();
            matchCount++;
            if (matchCount === images.length) {
                setTimeout(() => {
                    alert("哇！你赢了！真棒！🎉 现在可以去开礼物啦！");
                    // Scroll to gift section
                    document.querySelector('.message-section').scrollIntoView({ behavior: 'smooth' });
                }, 500);
            }
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    document.querySelectorAll('.memory-card').forEach(card => card.addEventListener('click', flipCard));


    // === GIFT BOX ANIMATION ===
    window.openGift = function () {
        const giftBox = document.querySelector('.gift-box');
        const giftContainer = document.getElementById('gift-box-container');
        const hiddenMessage = document.getElementById('hidden-message');
        const flowerContainer = document.getElementById('single-flower-container');
        const cakeContainer = document.querySelector('.cake-container');
        const cake = document.querySelector('.cake-wrapper');

        if (giftBox.classList.contains('open')) return;

        giftBox.classList.add('open');

        // Logic after lid opens
        setTimeout(() => {
            giftContainer.classList.add('hidden');
            hiddenMessage.classList.add('show');

            // Show new animations
            flowerContainer.classList.add('show');
            cakeContainer.classList.add('show');

            // Trigger Blooming Flower
            if (window.startFlower) window.startFlower();

            // Trigger Tremble (Anticipation)
            setTimeout(() => {
                cake.classList.add('trembling');
            }, 2000);

            // Trigger Knife Cut (Visual)
            setTimeout(() => {
                cake.classList.add('cutting-action'); // Shows knife
            }, 2500);

            // Trigger Cake Cutting after delay (Phase 2)
            setTimeout(() => {
                cake.classList.remove('trembling'); // Stop trembling
                cake.classList.add('cutting');

                // Show Replay Button after animation settles
                setTimeout(() => {
                    document.getElementById('replay-btn').style.display = 'inline-block';
                }, 2000);
            }, 3500); // 3.5s: Cut finishes, Slice moves, Crying starts

            // Confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

        }, 1200);
    };

    // Replay Logic
    const replayBtn = document.getElementById('replay-btn');
    if (replayBtn) { // Added check for replayBtn existence
        replayBtn.addEventListener('click', () => {
            // Reset everything
            const giftBox = document.querySelector('.gift-box'); // Re-get giftBox for replay
            const giftContainer = document.getElementById('gift-box-container');
            const hiddenMessage = document.getElementById('hidden-message');
            const flowerContainer = document.getElementById('single-flower-container');
            const cakeContainer = document.querySelector('.cake-container');
            const cake = document.querySelector('.cake-wrapper');

            giftBox.classList.remove('open');
            giftContainer.classList.remove('hidden'); // Show gift box again
            hiddenMessage.classList.remove('show'); // Hide message again
            flowerContainer.classList.remove('show');
            cakeContainer.classList.remove('show');

            // Reset Cake Classes
            cake.classList.remove('trembling', 'cutting-action', 'cutting');

            // Hide Replay Button
            replayBtn.style.display = 'none';

            // Optional: Reset Audio? keeping it playing is usually better for party vibe
        });
    }


    // Celebration Button
    const btn = document.getElementById('celebrate-btn');
    if (btn) {
        btn.addEventListener('click', () => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            btn.textContent = "耶！生日快乐！🎉";
        });
    }

    // Lightbox Logic
    window.openLightbox = function (element) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const caption = document.getElementById('lightbox-caption');
        const img = element.querySelector('img');
        const text = element.querySelector('.chinese-caption').textContent;

        lightbox.style.display = "block";
        lightboxImg.src = img.src;
        caption.textContent = text;
    }

    window.closeLightbox = function () {
        document.getElementById('lightbox').style.display = "none";
    }
});

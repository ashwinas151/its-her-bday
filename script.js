/* =========================================================
   SCENE CONTROL
========================================================= */

const scenes = [...document.querySelectorAll(".scene")];

function show(id) {
    scenes.forEach(scene => {
        scene.classList.toggle("active", scene.id === id);
    });
}


/* =========================================================
   STARS
========================================================= */

const stars = document.getElementById("stars");

for (let i = 0; i < 85; i++) {
    const star = document.createElement("span");

    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 2 + "s";
    star.style.animationDuration =
        1.3 + Math.random() * 2 + "s";

    stars.appendChild(star);
}

/* =========================================================
   MUSIC
========================================================= */

const audio =
    document.getElementById("musicAudio");

const countdownAudio =
    document.getElementById("countdownAudio");

const musicBtn =
    document.getElementById("musicBtn");

let giftUnlocked = false;
let userAllowedAudio = false;


/* Update the Music button from actual audio status */

function updateMusicButton() {

    const countdownIsPlaying =
        countdownAudio &&
        !countdownAudio.paused;

    const normalMusicIsPlaying =
        audio &&
        !audio.paused;

    musicBtn.textContent =
        countdownIsPlaying ||
        normalMusicIsPlaying
            ? "♫"
            : "🔇";
}


/* Play the countdown song */

function playCountdownMusic() {

    if (
        giftUnlocked ||
        !countdownAudio
    ) {
        return;
    }

    if (audio) {
        audio.pause();
    }

    countdownAudio
        .play()
        .then(function () {

            userAllowedAudio = true;

            updateMusicButton();
        })
        .catch(function () {

            updateMusicButton();
        });
}


/* Play the normal birthday song */

function tryMusic() {

    if (!audio) {
        return;
    }

    if (countdownAudio) {

        countdownAudio.pause();

        countdownAudio.currentTime = 0;
    }

    audio.play()
        .then(function () {

            userAllowedAudio = true;

            updateMusicButton();
        })
        .catch(function () {

            updateMusicButton();
        });
}


/* Switch from countdown song to normal song */

function switchToNormalMusic() {

    if (countdownAudio) {

        countdownAudio.pause();

        countdownAudio.currentTime = 0;
    }

    if (!audio) {
        updateMusicButton();
        return;
    }

    audio.currentTime = 0;

    audio.play()
        .then(function () {

            updateMusicButton();
        })
        .catch(function () {

            /*
               Some mobile browsers block the
               automatic switch.

               The Music button stays available.
            */

            updateMusicButton();
        });
}


/* Music button */

if (musicBtn) {

    musicBtn.addEventListener(
        "click",
        function () {

            userAllowedAudio = true;


            /* Before countdown completion */

            if (!giftUnlocked) {

                if (!countdownAudio) {
                    return;
                }

                if (countdownAudio.paused) {

                    playCountdownMusic();

                } else {

                    countdownAudio.pause();

                    updateMusicButton();
                }

                return;
            }


            /* After countdown completion */

            if (!audio) {
                return;
            }

            if (audio.paused) {

                tryMusic();

            } else {

                audio.pause();

                updateMusicButton();
            }
        }
    );
}


/* First page interaction starts countdown music */

document.addEventListener(
    "pointerdown",
    function startFirstMusic(event) {

        /*
           Let the Music button handle
           its own click.
        */

        if (
            event.target &&
            event.target.closest("#musicBtn")
        ) {
            return;
        }

        userAllowedAudio = true;

        if (!giftUnlocked) {

            playCountdownMusic();

        } else if (audio && audio.paused) {

            tryMusic();
        }

        document.removeEventListener(
            "pointerdown",
            startFirstMusic
        );
    },
    {
        once: true
    }
);


/* Keep button icon synchronized */

if (countdownAudio) {

    countdownAudio.addEventListener(
        "play",
        updateMusicButton
    );

    countdownAudio.addEventListener(
        "pause",
        updateMusicButton
    );
}

if (audio) {

    audio.addEventListener(
        "play",
        updateMusicButton
    );

    audio.addEventListener(
        "pause",
        updateMusicButton
    );
}

/* =========================================================
   BIRTHDAY COUNTDOWN
========================================================= */

/*
   Change this date if needed.

   NOTE:
   August 26, 2026 is already past as of October 15, 2026.
   Therefore this date will unlock the gift immediately.
*/

const targetDate =
    new Date("2026-12-06T00:00:00+05:30").getTime();

const countdown =
    document.getElementById("countdown");

const giftMessage =
    document.getElementById("giftMessage");


function updateCountdown() {
    const now = Date.now();

    const distance =
        targetDate - now;


    if (distance <= 0) {

    const justUnlocked =
        !giftUnlocked;

    giftUnlocked = true;

    countdown.textContent =
        "🎉 Gift Unlocked!";


    /*
       Switch songs only once when
       the countdown reaches zero.
    */

    if (justUnlocked) {

        switchToNormalMusic();
    }


    return;
}


    const days =
        Math.floor(
            distance /
            (1000 * 60 * 60 * 24)
        );


    const hours =
        Math.floor(
            (
                distance %
                (1000 * 60 * 60 * 24)
            ) /
            (1000 * 60 * 60)
        );


    const minutes =
        Math.floor(
            (
                distance %
                (1000 * 60 * 60)
            ) /
            (1000 * 60)
        );


    const seconds =
        Math.floor(
            (
                distance %
                (1000 * 60)
            ) /
            1000
        );


    countdown.textContent =
        `${days}d ${hours}h ${minutes}m ${seconds}s`;
}


/* Run immediately */

updateCountdown();


/* Update every second */

setInterval(updateCountdown, 1000);


/* =========================================================
   GIFT
========================================================= */

const giftBtn =
    document.getElementById("giftBtn");


giftBtn.onclick = () => {

    if (!giftUnlocked) {

        const funnyMessages = [
            "🙈 Oops! Someone is too excited!",
            "🎁 Not yet... birthday magic is loading.",
            "😂 Nice try! Come back later.",
            "⏳ Patience, detective!",
            "🎂 The cake isn't ready yet!"
        ];


        giftMessage.textContent =
            funnyMessages[
                Math.floor(
                    Math.random() *
                    funnyMessages.length
                )
            ];


        return;
    }


    tryMusic();


    const animation =
        giftBtn.animate(
            [
                {
                    transform: "scale(1)"
                },
                {
                    transform:
                        "scale(1.2) rotate(-4deg)"
                },
                {
                    transform: "scale(0)"
                }
            ],
            {
                duration: 650,
                easing: "ease-in-out"
            }
        );


    animation.onfinish = () => {
        show("scene-password");
    };
};

/* =========================================================
   YES / NO COIN TOSS GAME
========================================================= */

const coinGameShortcut =
    document.getElementById(
        "coinGameShortcut"
    );

const yesNoCoin =
    document.getElementById(
        "yesNoCoin"
    );

const tossCoinBtn =
    document.getElementById(
        "tossCoinBtn"
    );

const coinTossResult =
    document.getElementById(
        "coinTossResult"
    );

const coinTossHint =
    document.getElementById(
        "coinTossHint"
    );

const coinBackBtn =
    document.getElementById(
        "coinBackBtn"
    );


let coinPreviewShowsNo = false;
let coinIsTossing = false;


/* =========================================================
   RESET COIN GAME
========================================================= */

function resetCoinTossGame() {

    coinPreviewShowsNo = false;
    coinIsTossing = false;


    if (yesNoCoin) {

        yesNoCoin.classList.remove(
            "show-no",
            "tossing"
        );
    }


    if (coinTossResult) {

        coinTossResult.textContent =
            "YES or NO... what will fate choose?";

        coinTossResult.classList.remove(
            "yes-result"
        );
    }


    if (coinTossHint) {

        coinTossHint.textContent =
            "Tap the coin to see both sides, then toss it ✨";
    }


    if (tossCoinBtn) {

        tossCoinBtn.disabled = false;

        tossCoinBtn.textContent =
            "Toss the Coin 🪙";
    }
}


/* =========================================================
   FIRST PAGE COIN BUTTON
========================================================= */

if (coinGameShortcut) {

    coinGameShortcut.addEventListener(
        "click",
        function () {

            resetCoinTossGame();

            show(
                "scene-coin-toss"
            );

        }
    );
}


/* =========================================================
   TOUCH COIN TO SEE NEXT FACE
========================================================= */

function changeCoinPreviewFace() {

    if (
        coinIsTossing ||
        !yesNoCoin
    ) {
        return;
    }


    coinPreviewShowsNo =
        !coinPreviewShowsNo;


    yesNoCoin.classList.toggle(
        "show-no",
        coinPreviewShowsNo
    );


    if (coinTossResult) {

        coinTossResult.textContent =
            coinPreviewShowsNo
                ? "NO ✨"
                : "YES 💖";
    }
}


if (yesNoCoin) {

    yesNoCoin.addEventListener(
        "click",
        changeCoinPreviewFace
    );


    yesNoCoin.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                changeCoinPreviewFace();

            }
        }
    );
}


/* =========================================================
   TOSS COIN - FINAL ANSWER IS ALWAYS YES
========================================================= */

if (tossCoinBtn) {

    tossCoinBtn.addEventListener(
        "click",
        function () {

            if (
                coinIsTossing ||
                !yesNoCoin
            ) {
                return;
            }


            coinIsTossing = true;
            coinPreviewShowsNo = false;


            yesNoCoin.classList.remove(
                "show-no",
                "tossing"
            );


            /*
               Restart animation reliably.
            */

            void yesNoCoin.offsetWidth;


            yesNoCoin.classList.add(
                "tossing"
            );


            tossCoinBtn.disabled = true;

            tossCoinBtn.textContent =
                "Tossing... 🪙";


            if (coinTossResult) {

                coinTossResult.textContent =
                    "The coin is deciding... ✨";

                coinTossResult.classList.remove(
                    "yes-result"
                );
            }


            setTimeout(
                function () {

                    coinIsTossing = false;


                    yesNoCoin.classList.remove(
                        "tossing",
                        "show-no"
                    );


                    if (coinTossResult) {

                        coinTossResult.textContent =
                            "YES you need to come out as per the toss💖✨";

                        coinTossResult.classList.add(
                            "yes-result"
                        );
                    }


                    if (coinTossHint) {

                        coinTossHint.textContent =
                            "Looks like fate has already decided 💕";
                    }


                    tossCoinBtn.disabled = false;

                    tossCoinBtn.textContent =
                        "Toss Again 🪙";

                },
                1800
            );

        }
    );
}


/* =========================================================
   BACK TO GIFT PAGE
========================================================= */

if (coinBackBtn) {

    coinBackBtn.addEventListener(
        "click",
        function () {

            show(
                "scene-gift"
            );

        }
    );
}

/* =========================================================
   PASSWORD
========================================================= */

const secret = "4478";

let entered = "";

const dots =
    [...document.querySelectorAll("#codeDots i")];

const keypad =
    document.getElementById("keypad");

const codeMessage =
    document.getElementById("codeMessage");


function updateDots() {

    dots.forEach((dot, index) => {

        dot.classList.toggle(
            "filled",
            index < entered.length
        );

    });
}


function createKiss(button) {

    const rect =
        button.getBoundingClientRect();


    const kiss =
        document.createElement("div");


    kiss.className =
        "kiss-emoji";

    kiss.textContent =
        "😘";


    kiss.style.left =
        rect.left +
        rect.width / 2 +
        "px";


    kiss.style.top =
        rect.top +
        rect.height / 2 +
        "px";


    document.body.appendChild(kiss);


    setTimeout(() => {
        kiss.remove();
    }, 1500);
}


function createPasswordHearts() {

    for (let i = 0; i < 80; i++) {

        setTimeout(() => {

            const heart =
                document.createElement("div");


            heart.className =
                "password-heart";


            heart.textContent =
                "❤️";


            heart.style.left =
                Math.random() * 100 + "vw";


            heart.style.top =
                "100vh";


            heart.style.fontSize =
                10 +
                Math.random() * 25 +
                "px";


            document.body.appendChild(
                heart
            );


            setTimeout(() => {
                heart.remove();
            }, 5000);

        }, i * 60);
    }
}


function passwordSuccess() {

    codeMessage.textContent =
        "Unlocked ❤️";

    createPasswordHearts();

    setTimeout(() => {

        resetBirthday22();

        show("scene-candles");

    }, 5000);
}


function passwordWrong() {

    const funnyErrors = [
        "🐵👊 Monkey punch! Wrong password!",
        "🙈 Nope! Try again genius!",
        "😂 Even the monkey knows that is wrong!",
        "🐒 The monkey stole the correct password!",
        "🍌 Monkey says: Access Denied!"
    ];


    codeMessage.textContent =
        funnyErrors[
            Math.floor(
                Math.random() *
                funnyErrors.length
            )
        ];


    const codeBox =
        document.querySelector(".code-box");


    codeBox.animate(
        [
            {
                transform:
                    "translateX(0)"
            },
            {
                transform:
                    "translateX(-15px)"
            },
            {
                transform:
                    "translateX(15px)"
            },
            {
                transform:
                    "translateX(-15px)"
            },
            {
                transform:
                    "translateX(15px)"
            },
            {
                transform:
                    "translateX(0)"
            }
        ],
        {
            duration: 500
        }
    );


    entered = "";

    updateDots();
}


keypad.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest(
                "button[data-key]"
            );


        if (!button) {
            return;
        }


        const key =
            button.dataset.key;


        createKiss(button);


        /* Delete */

        if (key === "clear") {

            entered =
                entered.slice(0, -1);

            codeMessage.textContent = "";

            updateDots();

            return;
        }


        /* Submit password */

        if (key === "enter") {

            if (entered === secret) {
                passwordSuccess();
            } else {
                passwordWrong();
            }

            return;
        }


        /* Number */

        if (
            entered.length < 4 &&
            /^\d$/.test(key)
        ) {

            entered += key;

            codeMessage.textContent = "";

            updateDots();
        }

    }
);

/* =========================================================
   22ND BIRTHDAY CANDLE GAME
========================================================= */

const birthdayCandles =
    [
        ...document.querySelectorAll(
            ".number-candle"
        )
    ];

const candleCounter =
    document.getElementById(
        "candleCounter"
    );

const candleHint =
    document.getElementById(
        "candleHint"
    );

const wishReveal =
    document.getElementById(
        "wishReveal"
    );

const blowCandlesBtn =
    document.getElementById(
        "blowCandlesBtn"
    );


let birthdayCandlesLit = 0;
let birthdayWishFinished = false;


/* =========================================================
   RESET 22 GAME
========================================================= */

function resetBirthday22() {

    birthdayCandlesLit = 0;

    birthdayWishFinished = false;


    birthdayCandles.forEach(
        function (candle) {

            candle.classList.remove(
                "lit",
                "blown"
            );

            candle.disabled = false;
        }
    );


    if (candleCounter) {

        candleCounter.textContent =
            "🔥 0 / 2 candles lit";
    }


    if (candleHint) {

        candleHint.textContent =
            "Tap both number candles to light them 🕯️";
    }


    if (wishReveal) {

        wishReveal.classList.remove(
            "visible"
        );
    }


    if (blowCandlesBtn) {

        blowCandlesBtn.style.display =
            "none";
    }
}


/* =========================================================
   LIGHT NUMBER CANDLES
========================================================= */

birthdayCandles.forEach(
    function (candle) {

        candle.addEventListener(
            "click",
            function () {

                if (
                    birthdayWishFinished ||
                    candle.classList.contains(
                        "lit"
                    )
                ) {
                    return;
                }


                candle.classList.add(
                    "lit"
                );


                candle.disabled = true;


                birthdayCandlesLit++;


                if (candleCounter) {

                    candleCounter.textContent =
                        "🔥 " +
                        birthdayCandlesLit +
                        " / 2 candles lit";
                }


                createBirthday22Sparkles(
                    candle
                );


                if (
                    birthdayCandlesLit === 2
                ) {

                    birthday22Ready();
                }
            }
        );
    }
);


/* =========================================================
   SPARKLES WHEN A 2 LIGHTS
========================================================= */

function createBirthday22Sparkles(
    candle
) {

    const rect =
        candle.getBoundingClientRect();


    const sparkleSymbols = [
        "✨",
        "⭐",
        "💛",
        "💖"
    ];


    for (
        let i = 0;
        i < 10;
        i++
    ) {

        const sparkle =
            document.createElement(
                "span"
            );


        sparkle.className =
            "seal-particle";


        sparkle.textContent =
            sparkleSymbols[
                Math.floor(
                    Math.random() *
                    sparkleSymbols.length
                )
            ];


        sparkle.style.left =
            rect.left +
            rect.width / 2 +
            "px";


        sparkle.style.top =
            rect.top +
            10 +
            "px";


        sparkle.style.setProperty(
            "--seal-x",
            (
                Math.random() *
                100 -
                50
            ) +
            "px"
        );


        sparkle.style.setProperty(
            "--seal-y",
            (
                Math.random() *
                -110 -
                20
            ) +
            "px"
        );


        document.body.appendChild(
            sparkle
        );


        setTimeout(
            function () {

                sparkle.remove();

            },
            1200
        );
    }
}


/* =========================================================
   BOTH 2s ARE LIT
========================================================= */

function birthday22Ready() {

    if (candleCounter) {

        candleCounter.textContent =
            "22 is glowing! 🔥💖";
    }


    if (candleHint) {

        candleHint.textContent =
            "Both birthday candles are shining ✨";
    }


    setTimeout(
        function () {

            if (wishReveal) {

                wishReveal.classList.add(
                    "visible"
                );
            }


            if (blowCandlesBtn) {

                blowCandlesBtn.style.display =
                    "inline-block";
            }

        },
        500
    );
}


/* =========================================================
   SMOKE
========================================================= */

function createBirthday22Smoke(
    candle
) {

    const rect =
        candle.getBoundingClientRect();


    for (
        let i = 0;
        i < 5;
        i++
    ) {

        const smoke =
            document.createElement(
                "span"
            );


        smoke.className =
            "candle-smoke";


        smoke.style.left =
            rect.left +
            rect.width / 2 +
            "px";


        smoke.style.top =
            rect.top +
            "px";


        smoke.style.setProperty(
            "--smoke-x",
            (
                Math.random() *
                35 -
                17
            ) +
            "px"
        );


        document.body.appendChild(
            smoke
        );


        setTimeout(
            function () {

                smoke.remove();

            },
            1700
        );
    }
}


/* =========================================================
   BLOW BOTH 2s
========================================================= */

if (blowCandlesBtn) {

    blowCandlesBtn.addEventListener(
        "click",
        function () {

            if (birthdayWishFinished) {
                return;
            }


            birthdayWishFinished = true;


            blowCandlesBtn.style.display =
                "none";


            if (candleHint) {

                candleHint.textContent =
                    "Your wish is on its way... 💖";
            }


            birthdayCandles.forEach(
                function (
                    candle,
                    index
                ) {

                    setTimeout(
                        function () {

                            candle.classList.add(
                                "blown"
                            );


                            createBirthday22Smoke(
                                candle
                            );

                        },
                        index * 180
                    );
                }
            );


            setTimeout(
                function () {

                    show("scene-cake");

                },
                2000
            );
        }
    );
}

/* =========================================================
   CAKE
========================================================= */

const cakeBtn =
    document.getElementById("cakeBtn");


cakeBtn.onclick = () => {

    /* Blow candles */

    document
        .querySelectorAll(".flames b")
        .forEach(flame => {

            flame.style.opacity = "0";

        });

    setTimeout(() => {
resetRibbonGame();
show("scene-ribbon");
    }, 3000);
};

/* =========================================================
   UNTIE THE RIBBON
========================================================= */

const ribbonGift =
    document.getElementById(
        "ribbonGift"
    );

const giftRibbons =
    [
        ...document.querySelectorAll(
            ".gift-ribbon"
        )
    ];

const ribbonCounter =
    document.getElementById(
        "ribbonCounter"
    );

const ribbonMessage =
    document.getElementById(
        "ribbonMessage"
    );

const ribbonNextBtn =
    document.getElementById(
        "ribbonNextBtn"
    );


let ribbonsRemoved = 0;
let ribbonGameComplete = false;


/* =========================================================
   RESET RIBBON GAME
========================================================= */

function resetRibbonGame() {

    ribbonsRemoved = 0;
    ribbonGameComplete = false;


    if (ribbonGift) {

        ribbonGift.classList.remove(
            "opened"
        );
    }


    giftRibbons.forEach(
        function (ribbon) {

            ribbon.disabled = false;

            ribbon.style.display =
                "block";

            ribbon.classList.remove(
                "ribbon-removed"
            );
        }
    );


    if (ribbonCounter) {

        ribbonCounter.textContent =
            "🎀 3 ribbons remaining";
    }


    if (ribbonMessage) {

        ribbonMessage.textContent =
            "Start with any ribbon ✨";
    }


    if (ribbonNextBtn) {

        ribbonNextBtn.style.display =
            "none";
    }
}


/* =========================================================
   REMOVE RIBBONS
========================================================= */

giftRibbons.forEach(
    function (ribbon) {

        ribbon.addEventListener(
            "click",
            function () {

                if (
                    ribbonGameComplete ||
                    ribbon.classList.contains(
                        "ribbon-removed"
                    )
                ) {
                    return;
                }


                ribbon.disabled = true;

                ribbon.classList.add(
                    "ribbon-removed"
                );


                ribbonsRemoved++;


                /*
                   Different effect for each
                   ribbon removed.
                */

                if (ribbonsRemoved === 1) {

                    createRibbonParticles(
                        ribbon,
                        [
                            "✨",
                            "⭐",
                            "💫"
                        ]
                    );

                    if (ribbonMessage) {

                        ribbonMessage.textContent =
                            "A little sparkle escaped ✨";
                    }
                }


                if (ribbonsRemoved === 2) {

                    createRibbonParticles(
                        ribbon,
                        [
                            "🌸",
                            "🌷",
                            "💮"
                        ]
                    );

                    if (ribbonMessage) {

                        ribbonMessage.textContent =
                            "Flowers were hiding inside 🌸";
                    }
                }


                if (ribbonsRemoved === 3) {

                    createRibbonParticles(
                        ribbon,
                        [
                            "❤️",
                            "💖",
                            "💕"
                        ]
                    );

                    if (ribbonMessage) {

                        ribbonMessage.textContent =
                            "One last ribbon... 💖";
                    }
                }


                if (ribbonCounter) {

                    const remaining =
                        giftRibbons.length -
                        ribbonsRemoved;


                    ribbonCounter.textContent =
                        "🎀 " +
                        remaining +
                        " ribbon" +
                        (
                            remaining === 1
                                ? ""
                                : "s"
                        ) +
                        " remaining";
                }


                setTimeout(
                    function () {

                        ribbon.style.display =
                            "none";

                    },
                    620
                );


                if (
                    ribbonsRemoved ===
                    giftRibbons.length
                ) {

                    completeRibbonGame();

                }

            }
        );
    }
);


/* =========================================================
   PARTICLES
========================================================= */

function createRibbonParticles(
    ribbon,
    symbols
) {

    const rectangle =
        ribbon.getBoundingClientRect();


    const centerX =
        rectangle.left +
        rectangle.width / 2;


    const centerY =
        rectangle.top +
        rectangle.height / 2;


    for (
        let index = 0;
        index < 22;
        index++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "ribbon-particle";


        particle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        particle.style.left =
            centerX + "px";


        particle.style.top =
            centerY + "px";


        particle.style.setProperty(
            "--ribbon-x",
            (
                Math.random() *
                220 -
                110
            ) +
            "px"
        );


        particle.style.setProperty(
            "--ribbon-y",
            (
                Math.random() *
                220 -
                110
            ) +
            "px"
        );


        document.body.appendChild(
            particle
        );


        setTimeout(
            function () {

                particle.remove();

            },
            1100
        );
    }
}


/* =========================================================
   ALL RIBBONS REMOVED
========================================================= */

function completeRibbonGame() {

    if (ribbonGameComplete) {
        return;
    }


    ribbonGameComplete = true;


    if (ribbonCounter) {

        ribbonCounter.textContent =
            "🎀 All ribbons untied!";
    }


    setTimeout(
        function () {

            if (ribbonGift) {

                ribbonGift.classList.add(
                    "opened"
                );
            }


            if (ribbonMessage) {

                ribbonMessage.textContent =
                    "Surprise! 💖";
            }

        },
        500
    );


    setTimeout(
        function () {

            if (ribbonNextBtn) {

                ribbonNextBtn.style.display =
                    "inline-block";
            }

        },
        1100
    );
}


/* =========================================================
   RIBBON -> MEMORIES
========================================================= */

if (ribbonNextBtn) {

    ribbonNextBtn.addEventListener(
        "click",
        function () {

            show("scene-memory");

        }
    );
}

/* =========================================================
   GENERIC NEXT BUTTONS
========================================================= */

document
    .querySelectorAll("[data-next]")
    .forEach(button => {

        button.onclick = () => {

            const nextScene =
                button.dataset.next;


            /* Flower effect */

            if (
                nextScene ===
                "scene-balloons"
            ) {

                const flowers = [
                    "🌸",
                    "🌹",
                    "🌺",
                    "🌷",
                    "💮"
                ];


                const flowerInterval =
                    setInterval(() => {

                        const flower =
                            document.createElement(
                                "div"
                            );


                        flower.className =
                            "flower";


                        flower.textContent =
                            flowers[
                                Math.floor(
                                    Math.random() *
                                    flowers.length
                                )
                            ];


                        flower.style.left =
                            Math.random() *
                            100 +
                            "vw";


                        flower.style.top =
                            "-50px";


                        flower.style.fontSize =
                            15 +
                            Math.random() *
                            20 +
                            "px";


                        document.body
                            .appendChild(
                                flower
                            );


                        setTimeout(() => {
                            flower.remove();
                        }, 5000);

                    }, 80);


                setTimeout(() => {

                    clearInterval(
                        flowerInterval
                    );

                    show(
                        "scene-balloons"
                    );

                }, 5000);


                return;
            }

            if (nextScene === "scene-flower-game") {
    resetMagicFlowerGame();
}

if (nextScene === "scene-butterfly") {
    resetButterflyGame();
}

show(nextScene);

        };
    });

/* =========================================================
   PICK THE MAGIC FLOWER
========================================================= */

const magicFlowers =
    [
        ...document.querySelectorAll(
            ".magic-flower"
        )
    ];

const magicFlowerMessage =
    document.getElementById(
        "magicFlowerMessage"
    );

const magicFlowerReveal =
    document.getElementById(
        "magicFlowerReveal"
    );

const flowerNextBtn =
    document.getElementById(
        "flowerNextBtn"
    );

const flowerGameHint =
    document.getElementById(
        "flowerGameHint"
    );


/*
   Winning flower:
   0 = 🌷
   1 = 🌸
   2 = 🌹
   3 = 🌺
   4 = 🌼
   5 = 🪷

   Currently 🌺 is the winner.
*/

const magicFlowerIndex = 3;

let magicFlowerFound = false;


/* =========================================================
   RESET FLOWER GAME
========================================================= */

function resetMagicFlowerGame() {

    magicFlowerFound = false;

    const magicFlowerArea =
    document.getElementById(
        "magicFlowerArea"
    );

if (magicFlowerArea) {
    magicFlowerArea.style.display =
        "grid";
}


    magicFlowers.forEach(
        function (flower) {

            flower.disabled = false;

            flower.style.opacity = "1";

            flower.classList.remove(
                "flower-wrong",
                "magic-found"
            );
        }
    );


    if (magicFlowerMessage) {

        magicFlowerMessage.textContent =
            "Choose carefully... 🌷";
    }


    if (flowerGameHint) {

        flowerGameHint.textContent =
            "One flower is hiding a little surprise... 💖";
    }


    if (magicFlowerReveal) {

        magicFlowerReveal.classList.remove(
            "visible"
        );
    }


    if (flowerNextBtn) {

        flowerNextBtn.style.display =
            "none";
    }
}


/* =========================================================
   CLICK FLOWERS
========================================================= */

magicFlowers.forEach(
    function (flower, index) {

        flower.addEventListener(
            "click",
            function () {

                if (magicFlowerFound) {
                    return;
                }


                if (
                    index ===
                    magicFlowerIndex
                ) {

                    findMagicFlower(
                        flower
                    );

                } else {

                    wrongMagicFlower(
                        flower
                    );
                }
            }
        );
    }
);


/* =========================================================
   WRONG FLOWER
========================================================= */

function wrongMagicFlower(
    flower
) {

    const messages = [
        "Almost 🌷",
        "Nice try 🌸",
        "This flower is keeping a secret 🤭",
        "Hmm... not this one 💗",
        "The magic flower is still hiding ✨"
    ];


    flower.classList.remove(
        "flower-wrong"
    );


    void flower.offsetWidth;


    flower.classList.add(
        "flower-wrong"
    );


    flower.disabled = true;

    flower.style.opacity =
        "0.45";


    if (magicFlowerMessage) {

        magicFlowerMessage.textContent =
            messages[
                Math.floor(
                    Math.random() *
                    messages.length
                )
            ];
    }
}


/* =========================================================
   CORRECT FLOWER
========================================================= */

function findMagicFlower(flower) {

    if (magicFlowerFound) {
        return;
    }

    magicFlowerFound = true;

    flower.classList.add("magic-found");

    magicFlowers.forEach(
        function (flowerButton) {
            flowerButton.disabled = true;
        }
    );

    if (magicFlowerMessage) {
        magicFlowerMessage.textContent =
            "You found it! 🌸✨";
    }

    if (flowerGameHint) {
        flowerGameHint.textContent =
            "The magic flower is blooming... 💖";
    }

    createMagicFlowerExplosion(flower);

    setTimeout(function () {

        const magicFlowerArea =
            document.getElementById(
                "magicFlowerArea"
            );

        if (magicFlowerArea) {
            magicFlowerArea.style.display =
                "none";
        }

        if (magicFlowerReveal) {
            magicFlowerReveal.classList.add(
                "visible"
            );
        }

    }, 600);

    setTimeout(function () {

        if (flowerNextBtn) {
            flowerNextBtn.style.display =
                "inline-block";
        }

    }, 1000);
}

/* =========================================================
   FLOWER EXPLOSION
========================================================= */

function createMagicFlowerExplosion(
    flower
) {

    const rectangle =
        flower.getBoundingClientRect();


    const centerX =
        rectangle.left +
        rectangle.width / 2;


    const centerY =
        rectangle.top +
        rectangle.height / 2;


    const symbols = [
        "🌸",
        "🌷",
        "🌺",
        "✨",
        "💖",
        "💮"
    ];


    for (
        let index = 0;
        index < 30;
        index++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "magic-flower-particle";


        particle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        particle.style.left =
            centerX + "px";


        particle.style.top =
            centerY + "px";


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            70 +
            Math.random() *
            170;


        particle.style.setProperty(
            "--flower-x",
            Math.cos(angle) *
            distance +
            "px"
        );


        particle.style.setProperty(
            "--flower-y",
            Math.sin(angle) *
            distance +
            "px"
        );


        document.body.appendChild(
            particle
        );


        setTimeout(
            function () {

                particle.remove();

            },
            1200
        );
    }
}


/* =========================================================
   FLOWER GAME -> BALLOONS
========================================================= */

if (flowerNextBtn) {

    flowerNextBtn.addEventListener(
        "click",
        function () {

            resetBalloonsGame();

            show("scene-balloons");

        }
    );
}


/* =========================================================
   BALLOONS
========================================================= */

let balloonsLeft = 6;

const balloonCount =
    document.getElementById(
        "balloonCount"
    );

/* =========================================================
   RESET BALLOONS
========================================================= */

function resetBalloonsGame() {

    balloonsLeft = 6;

    if (balloonCount) {
        balloonCount.textContent =
            "6 balloons left";
    }

    document
        .querySelectorAll(".balloon")
        .forEach(
            function (balloon) {

                balloon.classList.remove(
                    "popped"
                );

                balloon.disabled = false;

                balloon.style.display = "";

                balloon.style.opacity = "";

                balloon.style.transform = "";

                balloon.style.pointerEvents =
                    "auto";
            }
        );
}


document
    .querySelectorAll(".balloon")
    .forEach(balloon => {

        balloon.onclick = () => {

            if (
                balloon.classList.contains(
                    "popped"
                )
            ) {
                return;
            }


            const rect =
                balloon.getBoundingClientRect();


            /* Hearts when balloon pops */

            for (let i = 0; i < 10; i++) {

                const heart =
                    document.createElement(
                        "div"
                    );


                heart.className =
                    "heart-particle";


                heart.textContent =
                    "❤️";


                heart.style.left =
                    (
                        rect.left +
                        rect.width / 2 +
                        (
                            Math.random() *
                            60 -
                            30
                        )
                    ) +
                    "px";


                heart.style.top =
                    (
                        rect.top +
                        rect.height / 2 +
                        (
                            Math.random() *
                            20 -
                            10
                        )
                    ) +
                    "px";


                heart.style.fontSize =
                    12 +
                    Math.random() *
                    12 +
                    "px";


                document.body.appendChild(
                    heart
                );


                setTimeout(() => {
                    heart.remove();
                }, 2000);
            }


            balloon.classList.add(
                "popped"
            );


            balloonsLeft--;


            balloonCount.textContent =
                `${balloonsLeft} balloon${
                    balloonsLeft === 1
                        ? ""
                        : "s"
                } left`;


           if (balloonsLeft === 0) {

    setTimeout(() => {

        resetHiddenHeartsGame();

        show(
            "scene-hidden-hearts"
        );

    }, 500);
}

        };

    });

    /* =========================================================
   HIDDEN HEARTS PHOTO GAME
========================================================= */

const hiddenHearts =
    [
        ...document.querySelectorAll(
            ".hidden-heart"
        )
    ];

const hiddenHeartCounter =
    document.getElementById(
        "hiddenHeartCounter"
    );

const hiddenHeartHint =
    document.getElementById(
        "hiddenHeartHint"
    );

const hiddenHeartSecret =
    document.getElementById(
        "hiddenHeartSecret"
    );

const hiddenHeartNextBtn =
    document.getElementById(
        "hiddenHeartNextBtn"
    );


let hiddenHeartsFound = 0;
let hiddenHeartsComplete = false;


/* =========================================================
   RESET HIDDEN HEARTS
========================================================= */

function resetHiddenHeartsGame() {

    hiddenHeartsFound = 0;

    hiddenHeartsComplete = false;


    hiddenHearts.forEach(
        function (heart) {

            heart.disabled = false;

            heart.style.display =
                "flex";

            heart.classList.remove(
                "heart-found"
            );

        }
    );


    if (hiddenHeartCounter) {

        hiddenHeartCounter.textContent =
            "0/5 little hearts found ❤️";
    }


    if (hiddenHeartHint) {

        hiddenHeartHint.textContent =
            "Five tiny hearts are hiding in this memory... can you find them? ✨";
    }


    if (hiddenHeartSecret) {

        hiddenHeartSecret.classList.remove(
            "visible"
        );
    }


    if (hiddenHeartNextBtn) {

        hiddenHeartNextBtn.style.display =
            "none";
    }
}


/* =========================================================
   FIND HEART
========================================================= */

hiddenHearts.forEach(
    function (heart) {

        heart.addEventListener(
            "click",
            function () {

                if (
                    hiddenHeartsComplete ||
                    heart.classList.contains(
                        "heart-found"
                    )
                ) {

                    return;
                }


                heart.classList.add(
                    "heart-found"
                );


                heart.disabled =
                    true;


                hiddenHeartsFound++;


                createHiddenHeartParticles(
                    heart
                );


                if (hiddenHeartCounter) {

                    hiddenHeartCounter.textContent =
                        hiddenHeartsFound +
                        "/5 little hearts found ❤️";
                }


                setTimeout(
                    function () {

                        heart.style.display =
                            "none";

                    },
                    520
                );


                if (
                    hiddenHeartsFound ===
                    hiddenHearts.length
                ) {

                    completeHiddenHeartsGame();

                }

            }
        );
    }
);


/* =========================================================
   HEART PARTICLES
========================================================= */

function createHiddenHeartParticles(
    heart
) {

    const rectangle =
        heart.getBoundingClientRect();


    const centerX =
        rectangle.left +
        rectangle.width / 2;


    const centerY =
        rectangle.top +
        rectangle.height / 2;


    const symbols = [
        "❤️",
        "💖",
        "💕",
        "✨"
    ];


    for (
        let index = 0;
        index < 14;
        index++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "hidden-heart-particle";


        particle.textContent =
            symbols[
                Math.floor(
                    Math.random() *
                    symbols.length
                )
            ];


        particle.style.left =
            centerX + "px";


        particle.style.top =
            centerY + "px";


        particle.style.setProperty(
            "--heart-x",
            (
                Math.random() *
                140 -
                70
            ) +
            "px"
        );


        particle.style.setProperty(
            "--heart-y",
            (
                Math.random() *
                140 -
                70
            ) +
            "px"
        );


        document.body.appendChild(
            particle
        );


        setTimeout(
            function () {

                particle.remove();

            },
            1000
        );
    }
}


/* =========================================================
   ALL HEARTS FOUND
========================================================= */

function completeHiddenHeartsGame() {

    if (hiddenHeartsComplete) {
        return;
    }


    hiddenHeartsComplete = true;


    if (hiddenHeartCounter) {

        hiddenHeartCounter.textContent =
            "5/5 little hearts found ❤️";
    }


    if (hiddenHeartHint) {

        hiddenHeartHint.textContent =
            "You found every little heart ✨";
    }


    setTimeout(
        function () {

            if (hiddenHeartSecret) {

                hiddenHeartSecret.classList.add(
                    "visible"
                );
            }

        },
        650
    );


    setTimeout(
        function () {

            if (hiddenHeartNextBtn) {

                hiddenHeartNextBtn.style.display =
                    "inline-block";
            }

        },
        1100
    );
}


/* =========================================================
   HIDDEN HEARTS -> HEART VAULT
========================================================= */

if (hiddenHeartNextBtn) {

    hiddenHeartNextBtn.addEventListener(
        "click",
        function () {

            resetHeartSafe();

            show(
                "scene-heart-safe"
            );

        }
    );
}

/* =========================================================
   HEART COMBINATION SAFE
========================================================= */

const heartSafe =
    document.getElementById(
        "heartSafe"
    );

const safeDials =
    [
        ...document.querySelectorAll(
            ".safe-dial"
        )
    ];

const safeUnlockBtn =
    document.getElementById(
        "safeUnlockBtn"
    );

const safeMessage =
    document.getElementById(
        "safeMessage"
    );

const safeNextBtn =
    document.getElementById(
        "safeNextBtn"
    );


const safeSymbols = [
    "🌸",
    "⭐",
    "🎂",
    "❤️"
];


/*
   Correct combination:

   ❤️*🎂 ⭐ 🌸
*/

const safeAnswer = [
    "❤️",
    "🎂",
    "⭐",
    "🌸"
];


let safeValues = [
    0,
    0,
    0,
    0
];

let safeOpened = false;


/* =========================================================
   RESET SAFE
========================================================= */

function resetHeartSafe() {

    safeValues = [
        0,
        0,
        0,
        0
    ];

    safeOpened = false;


    if (heartSafe) {

        heartSafe.classList.remove(
            "safe-open",
            "wrong-safe"
        );
    }


    safeDials.forEach(
        (dial, index) => {

            safeValues[index] = 0;

            dial.textContent =
                safeSymbols[0];

            dial.disabled =
                false;

            dial.classList.remove(
                "dial-spin"
            );
        }
    );


    if (safeMessage) {

        safeMessage.textContent =
            "";
    }


    if (safeNextBtn) {

        safeNextBtn.style.display =
            "none";
    }


    if (safeUnlockBtn) {

        safeUnlockBtn.disabled =
            false;

        safeUnlockBtn.textContent =
            "🔐 Unlock";
    }
}


/* =========================================================
   ROTATE DIAL
========================================================= */

safeDials.forEach(
    (dial, index) => {

        dial.addEventListener(
            "click",
            function () {

                if (safeOpened) {
                    return;
                }


                safeValues[index] =
                    (
                        safeValues[index] +
                        1
                    ) %
                    safeSymbols.length;


                dial.classList.remove(
                    "dial-spin"
                );


                void dial.offsetWidth;


                dial.classList.add(
                    "dial-spin"
                );


                /*
                   Change symbol halfway
                   through animation.
                */

                setTimeout(
                    function () {

                        dial.textContent =
                            safeSymbols[
                                safeValues[
                                    index
                                ]
                            ];

                    },
                    130
                );


                if (safeMessage) {

                    safeMessage.textContent =
                        "";

                }
            }
        );
    }
);


/* =========================================================
   CHECK COMBINATION
========================================================= */

if (safeUnlockBtn) {

    safeUnlockBtn.addEventListener(
        "click",
        function () {

            if (safeOpened) {
                return;
            }


            const currentCombination =
                safeValues.map(
                    function (
                        value
                    ) {

                        return safeSymbols[
                            value
                        ];
                    }
                );


            const correct =
                currentCombination.every(
                    function (
                        symbol,
                        index
                    ) {

                        return (
                            symbol ===
                            safeAnswer[
                                index
                            ]
                        );
                    }
                );


            if (correct) {

                openHeartSafe();

            } else {

                wrongHeartSafe();

            }
        }
    );
}


/* =========================================================
   WRONG COMBINATION
========================================================= */

function wrongHeartSafe() {

    if (!heartSafe) {
        return;
    }


    heartSafe.classList.remove(
        "wrong-safe"
    );


    void heartSafe.offsetWidth;


    heartSafe.classList.add(
        "wrong-safe"
    );


    if (safeMessage) {

        const messages = [
            "Not quite... follow the clue 💗",
            "The vault says nope 😜",
            "Almost! Try another combination ✨",
            "The heart knows the answer ❤️"
        ];


        safeMessage.textContent =
            messages[
                Math.floor(
                    Math.random() *
                    messages.length
                )
            ];
    }
}


/* =========================================================
   OPEN SAFE
========================================================= */

function openHeartSafe() {

    if (
        safeOpened ||
        !heartSafe
    ) {
        return;
    }


    safeOpened = true;


    heartSafe.classList.add(
        "safe-open"
    );


    if (safeMessage) {

        safeMessage.textContent =
            "Vault Unlocked! ❤️";
    }


    if (safeUnlockBtn) {

        safeUnlockBtn.textContent =
            "🔓 Unlocked";

        safeUnlockBtn.disabled =
            true;
    }


    safeDials.forEach(
        function (dial) {

            dial.disabled =
                true;

        }
    );


    setTimeout(
        function () {

            if (safeNextBtn) {

                safeNextBtn.style.display =
                    "inline-block";

            }

        },
        850
    );
}


/* =========================================================
   SAFE -> PUZZLE
========================================================= */

if (safeNextBtn) {

    safeNextBtn.addEventListener(
        "click",
        function () {

            selectedPiece = null;

            if (puzzle) {
                puzzle.style.gap = "3px";
            }

            puzzleButtons.forEach(
                function (button) {

                    button.style.pointerEvents =
                        "auto";

                    button.style.border = "";

                    button.style.outline = "";

                    button.style.boxShadow = "";

                    button.classList.remove(
                        "selected"
                    );
                }
            );

            createImagePuzzle();

            show(
                "scene-puzzle"
            );
        }
    );
}
    
/* =========================================================
   IMAGE PUZZLE
========================================================= */

const puzzle =
    document.getElementById("puzzle");

const puzzleMessage =
    document.getElementById(
        "puzzleMessage"
    );

const puzzleNextBtn =
    document.getElementById(
        "puzzleNextBtn"
    );

const puzzleButtons =
    [
        ...puzzle.querySelectorAll(
            "button"
        )
    ];


const correctOrder = [
    1, 2, 3,
    4, 5, 6,
    7, 8, 9
];


const backgroundPositions = {

    1: "0% 0%",
    2: "50% 0%",
    3: "100% 0%",

    4: "0% 50%",
    5: "50% 50%",
    6: "100% 50%",

    7: "0% 100%",
    8: "50% 100%",
    9: "100% 100%"

};


function shufflePuzzle(array) {

    const shuffled =
        [...array];


    for (
        let i =
            shuffled.length - 1;

        i > 0;

        i--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                (i + 1)
            );


        [
            shuffled[i],
            shuffled[randomIndex]
        ] =
        [
            shuffled[randomIndex],
            shuffled[i]
        ];
    }


    /* Don't start solved */

    if (
        shuffled.every(
            (value, index) =>
                value ===
                correctOrder[index]
        )
    ) {

        [
            shuffled[0],
            shuffled[1]
        ] =
        [
            shuffled[1],
            shuffled[0]
        ];
    }


    return shuffled;
}


function updatePuzzlePiece(button) {

    const pieceNumber =
        Number(
            button.dataset.value
        );


    button.style.backgroundPosition =
        backgroundPositions[
            pieceNumber
        ];


    button.setAttribute(
        "aria-label",
        `Puzzle piece ${pieceNumber}`
    );
}


function createImagePuzzle() {

    const shuffledPieces =
        shufflePuzzle(
            correctOrder
        );


    puzzleButtons.forEach(
        (button, index) => {

            button.dataset.value =
                shuffledPieces[
                    index
                ];


            button.textContent =
                "";


            button.classList.remove(
                "selected"
            );


            updatePuzzlePiece(
                button
            );
        }
    );


    puzzleMessage.textContent = "";

    puzzleNextBtn.style.display =
        "none";
}


function checkPuzzleCompletion() {
    const currentOrder = puzzleButtons.map(button =>
        Number(button.dataset.value)
    );

    const completed = currentOrder.every(
        (value, index) => value === correctOrder[index]
    );

    if (completed) {

        /* Show completion message */
        if (puzzleMessage) {
            puzzleMessage.textContent =
                "Puzzle Complete! ✨";
        }

        /* Remove grid lines */
        puzzleButtons.forEach(button => {
            button.classList.remove("selected");

            button.style.border = "none";
            button.style.outline = "none";
            button.style.boxShadow = "none";

            /* Stop puzzle from being changed again */
            button.style.pointerEvents = "none";
        });

        /* Remove spacing between pieces */
        if (puzzle) {
            puzzle.style.gap = "0";
        }

        /* Show Reveal Surprise button */
        if (puzzleNextBtn) {
            puzzleNextBtn.style.display =
                "inline-block";
        }
    }
}


let selectedPiece = null;


puzzle.addEventListener(
    "click",
    event => {

        const clickedPiece =
            event.target.closest(
                "button"
            );


        if (!clickedPiece) {
            return;
        }


        /* Select first piece */

        if (!selectedPiece) {

            selectedPiece =
                clickedPiece;


            selectedPiece
                .classList
                .add("selected");


            return;
        }


        /* Clicking same piece */

        if (
            selectedPiece ===
            clickedPiece
        ) {

            selectedPiece
                .classList
                .remove("selected");


            selectedPiece =
                null;


            return;
        }


        /* Swap pieces */

        const firstValue =
            selectedPiece
                .dataset
                .value;


        const secondValue =
            clickedPiece
                .dataset
                .value;


        selectedPiece.dataset.value =
            secondValue;


        clickedPiece.dataset.value =
            firstValue;


        updatePuzzlePiece(
            selectedPiece
        );


        updatePuzzlePiece(
            clickedPiece
        );


        selectedPiece
            .classList
            .remove("selected");


        selectedPiece =
            null;


        checkPuzzleCompletion();
    }
);


createImagePuzzle();


/* =========================================================
   ENVELOPE SEAL GAME
========================================================= */

const envelopeGame =
    document.getElementById(
        "envelopeGame"
    );

const waxSeal =
    document.getElementById(
        "waxSeal"
    );

const sealCounter =
    document.getElementById(
        "sealCounter"
    );

const envelopeHint =
    document.getElementById(
        "envelopeHint"
    );

const envelopeNextBtn =
    document.getElementById(
        "envelopeNextBtn"
    );


let sealHits = 0;
let envelopeOpened = false;


/* =========================================================
   RESET ENVELOPE
========================================================= */

function resetEnvelopeGame() {

    sealHits = 0;
    envelopeOpened = false;


    if (envelopeGame) {

        envelopeGame.classList.remove(
            "crack-one",
            "crack-two",
            "opened"
        );
    }


    if (waxSeal) {

        waxSeal.classList.remove(
            "seal-hit"
        );

        waxSeal.style.pointerEvents =
            "auto";
    }


    if (sealCounter) {

        sealCounter.textContent =
            "Seal strength: 3 ❤️";
    }


    if (envelopeHint) {

        envelopeHint.textContent =
            "Tap the wax seal three times to open it ❤️";
    }


    if (envelopeNextBtn) {

        envelopeNextBtn.style.display =
            "none";

        envelopeNextBtn.classList.remove(
            "show-envelope-button"
        );
    }
}


/* =========================================================
   CREATE SEAL PARTICLES
========================================================= */

function createSealParticles() {

    if (!waxSeal) {
        return;
    }


    const rectangle =
        waxSeal.getBoundingClientRect();


    const particles = [
        "❤️",
        "✨",
        "🌸",
        "💗",
        "✦",
        "💕"
    ];


    for (let i = 0; i < 18; i++) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "seal-particle";


        particle.textContent =
            particles[
                Math.floor(
                    Math.random() *
                    particles.length
                )
            ];


        particle.style.left =
            rectangle.left +
            rectangle.width / 2 +
            "px";


        particle.style.top =
            rectangle.top +
            rectangle.height / 2 +
            "px";


        particle.style.setProperty(
            "--seal-x",
            (
                Math.random() *
                220 -
                110
            ) +
            "px"
        );


        particle.style.setProperty(
            "--seal-y",
            (
                Math.random() *
                -180 -
                30
            ) +
            "px"
        );


        particle.style.fontSize =
            (
                12 +
                Math.random() *
                14
            ) +
            "px";


        document.body.appendChild(
            particle
        );


        setTimeout(function () {

            particle.remove();

        }, 1200);
    }
}


/* =========================================================
   TAP WAX SEAL
========================================================= */

function hitWaxSeal() {

    if (
        envelopeOpened ||
        !waxSeal ||
        !envelopeGame
    ) {
        return;
    }


    sealHits++;


    waxSeal.classList.remove(
        "seal-hit"
    );


    void waxSeal.offsetWidth;


    waxSeal.classList.add(
        "seal-hit"
    );


    if (sealHits === 1) {

        envelopeGame.classList.add(
            "crack-one"
        );


        if (sealCounter) {

            sealCounter.textContent =
                "Seal strength: 2 💗";
        }


        if (envelopeHint) {

            envelopeHint.textContent =
                "A tiny crack appeared... tap again ✨";
        }
    }


    if (sealHits === 2) {

        envelopeGame.classList.add(
            "crack-two"
        );


        if (sealCounter) {

            sealCounter.textContent =
                "Seal strength: 1 💖";
        }


        if (envelopeHint) {

            envelopeHint.textContent =
                "Almost open... one final tap ❤️";
        }
    }


    if (sealHits >= 3) {

        openEnvelopeGame();
    }
}


/* =========================================================
   OPEN ENVELOPE
========================================================= */

function openEnvelopeGame() {

    if (
        envelopeOpened ||
        !envelopeGame
    ) {
        return;
    }


    envelopeOpened = true;


    envelopeGame.classList.add(
        "opened"
    );


    createSealParticles();


    if (waxSeal) {

        waxSeal.style.pointerEvents =
            "none";
    }


    if (sealCounter) {

        sealCounter.textContent =
            "The seal is broken ✨";
    }


    if (envelopeHint) {

        envelopeHint.textContent =
            "A little secret was waiting inside 💌";
    }


    setTimeout(function () {

        if (envelopeNextBtn) {

            envelopeNextBtn.style.display =
                "inline-block";

            envelopeNextBtn.classList.add(
                "show-envelope-button"
            );
        }

    }, 900);
}


/* Mouse / touch activation */

if (waxSeal) {

    waxSeal.addEventListener(
        "click",
        hitWaxSeal
    );


    waxSeal.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                hitWaxSeal();
            }
        }
    );
}


/* =========================================================
   KEEP GOING -> SCRATCH CARD
========================================================= */

if (envelopeNextBtn) {

    envelopeNextBtn.addEventListener(
        "click",
        function () {

            show("scene-scratch");


            requestAnimationFrame(
                function () {

                    drawScratchCover();

                }
            );
        }
    );
}
/* =========================================================
   SCRATCH CARD
========================================================= */

const scratchCanvas =
    document.getElementById("scratchCanvas");

const scratchNextBtn =
    document.getElementById("scratchNextBtn");

let scratchCtx = null;

if (scratchCanvas instanceof HTMLCanvasElement) {
    scratchCtx = scratchCanvas.getContext("2d", {
        willReadFrequently: true
    });
} else {
    console.error(
        "scratchCanvas is missing or is not a canvas element."
    );
}

let isScratching = false;
let scratchDone = false;

let lastScratchX = 0;
let lastScratchY = 0;


/* =========================================================
   DRAW SILVER COVER
========================================================= */

function drawScratchCover() {

    if (!scratchCanvas || !scratchCtx) {
        console.error("Scratch canvas cannot be initialized.");
        return;
    }

    scratchDone = false;
    isScratching = false;

    scratchCanvas.style.display = "block";
    scratchCanvas.style.visibility = "visible";
    scratchCanvas.style.opacity = "1";
    scratchCanvas.style.pointerEvents = "auto";

    if (scratchNextBtn) {
        scratchNextBtn.style.display = "none";
    }

    scratchCtx.globalCompositeOperation = "source-over";

    scratchCtx.clearRect(
        0,
        0,
        scratchCanvas.width,
        scratchCanvas.height
    );

    const silver = scratchCtx.createLinearGradient(
        0,
        0,
        scratchCanvas.width,
        scratchCanvas.height
    );

    silver.addColorStop(0, "#eeeeee");
    silver.addColorStop(0.25, "#888888");
    silver.addColorStop(0.5, "#dddddd");
    silver.addColorStop(0.75, "#777777");
    silver.addColorStop(1, "#eeeeee");

    scratchCtx.fillStyle = silver;

    scratchCtx.fillRect(
        0,
        0,
        scratchCanvas.width,
        scratchCanvas.height
    );

    scratchCtx.fillStyle = "#444444";
    scratchCtx.font = "bold 42px Arial";
    scratchCtx.textAlign = "center";
    scratchCtx.textBaseline = "middle";

    scratchCtx.fillText(
        "SCRATCH HERE",
        scratchCanvas.width / 2,
        scratchCanvas.height / 2
    );
}
   


/* =========================================================
   PUZZLE -> ENVELOPE GAME
========================================================= */

if (puzzleNextBtn) {

    puzzleNextBtn.onclick = function () {

        resetEnvelopeGame();

        show("scene-envelope");

    };
}


/* =========================================================
   GET SCRATCH POSITION
========================================================= */

function getScratchPosition(event) {

    const rect =
        scratchCanvas.getBoundingClientRect();

    const scaleX =
        scratchCanvas.width / rect.width;

    const scaleY =
        scratchCanvas.height / rect.height;

    return {

        x:
            (event.clientX - rect.left) *
            scaleX,

        y:
            (event.clientY - rect.top) *
            scaleY
    };
}


/* =========================================================
   ERASE SCRATCH LAYER
========================================================= */

function eraseScratch(event) {

    if (
        !isScratching ||
        scratchDone ||
        !scratchCanvas ||
        !scratchCtx
    ) {
        return;
    }

    event.preventDefault();

    const position =
        getScratchPosition(event);

    scratchCtx.globalCompositeOperation =
        "destination-out";

    scratchCtx.lineWidth = 90;
    scratchCtx.lineCap = "round";
    scratchCtx.lineJoin = "round";

    scratchCtx.beginPath();

    scratchCtx.moveTo(
        lastScratchX,
        lastScratchY
    );

    scratchCtx.lineTo(
        position.x,
        position.y
    );

    scratchCtx.stroke();

    scratchCtx.beginPath();

    scratchCtx.arc(
        position.x,
        position.y,
        45,
        0,
        Math.PI * 2
    );

    scratchCtx.fill();

    lastScratchX = position.x;
    lastScratchY = position.y;
}


/* =========================================================
   SCRATCH POINTER EVENTS
========================================================= */

if (scratchCanvas instanceof HTMLCanvasElement) {

    scratchCanvas.addEventListener(
        "pointerdown",
        function (event) {

            if (scratchDone) {
                return;
            }

            event.preventDefault();

            const position =
                getScratchPosition(event);

            lastScratchX =
                position.x - 1;

            lastScratchY =
                position.y - 1;

            isScratching = true;

            try {

                scratchCanvas.setPointerCapture(
                    event.pointerId
                );

            } catch (error) {

                /* Pointer capture is optional */

            }

            eraseScratch(event);
        }
    );


    scratchCanvas.addEventListener(
        "pointermove",
        function (event) {

            if (!isScratching) {
                return;
            }

            eraseScratch(event);
        }
    );


    scratchCanvas.addEventListener(
        "pointerup",
        function (event) {

            stopScratch(event);

        }
    );


    scratchCanvas.addEventListener(
        "pointercancel",
        function (event) {

            stopScratch(event);

        }
    );
}
/* =========================================================
   STOP SCRATCHING
========================================================= */

function stopScratch(event) {

    if (!isScratching) {
        return;
    }

    isScratching = false;

    try {

        if (
            scratchCanvas &&
            event &&
            scratchCanvas.hasPointerCapture(event.pointerId)
        ) {

            scratchCanvas.releasePointerCapture(
                event.pointerId
            );
        }

    } catch (error) {

        /* Pointer already released */

    }

    checkScratchProgress();
}

/* =========================================================
   CHECK SCRATCH PROGRESS
========================================================= */

function checkScratchProgress() {

    if (scratchDone) {
        return;
    }

    const imageData =
        scratchCtx.getImageData(
            0,
            0,
            scratchCanvas.width,
            scratchCanvas.height
        );

    const pixels =
        imageData.data;

    let transparentPixels = 0;
    let checkedPixels = 0;

    for (
        let i = 3;
        i < pixels.length;
        i += 16
    ) {

        checkedPixels++;

        if (pixels[i] < 50) {
            transparentPixels++;
        }
    }

    const percentage =
        (
            transparentPixels /
            checkedPixels
        ) * 100;

    console.log(
        "Scratch progress:",
        percentage.toFixed(1) + "%"
    );

    if (percentage >= 35) {
        finishScratchCard();
    }
}


/* =========================================================
   SCRATCH COMPLETE
========================================================= */

function finishScratchCard() {

    if (
        scratchDone ||
        !scratchCanvas ||
        !scratchCtx
    ) {
        return;
    }

    scratchDone = true;
    isScratching = false;

    scratchCtx.clearRect(
        0,
        0,
        scratchCanvas.width,
        scratchCanvas.height
    );

    scratchCanvas.style.display = "none";

    if (scratchNextBtn) {
        scratchNextBtn.style.display =
            "inline-block";
    }
}


/* =========================================================
   SCRATCH CARD -> FALLING STARS
========================================================= */

if (scratchNextBtn) {

    scratchNextBtn.onclick = function () {

        show("scene-stars-game");

        startFallingStarsGame();

    };
}

/* =========================================================
   CATCH THE FALLING STARS GAME
========================================================= */

const fallingStarsArea =
    document.getElementById(
        "fallingStarsArea"
    );

const starGameCounter =
    document.getElementById(
        "starGameCounter"
    );

const starsGameMessage =
    document.getElementById(
        "starsGameMessage"
    );

const starsNextBtn =
    document.getElementById(
        "starsNextBtn"
    );

const totalStarsNeeded = 22;

let starsCaughtCount = 0;
let fallingStarGameStarted = false;
let fallingStarSpawnTimer = null;




/* =========================================================
   RESET STAR GAME
========================================================= */

function resetFallingStarsGame() {

    starsCaughtCount = 0;
    fallingStarGameStarted = false;


    if (fallingStarSpawnTimer) {

        clearInterval(
            fallingStarSpawnTimer
        );

        fallingStarSpawnTimer = null;
    }


    if (fallingStarsArea) {

        fallingStarsArea.classList.remove(
            "stars-complete"
        );

        fallingStarsArea
            .querySelectorAll(
                ".catch-star"
            )
            .forEach(function (star) {

                star.remove();

            });
    }


    if (starGameCounter) {
starGameCounter.textContent =
    "⭐ 0 / " +
    totalStarsNeeded +
    " wishes collected";
    }


    if (starsGameMessage) {

        starsGameMessage.textContent =
            "Tap the falling stars before they disappear! 💫";
    }


    if (starsNextBtn) {

        starsNextBtn.style.display =
            "none";

        starsNextBtn.classList.remove(
            "show-stars-button"
        );
    }
}


/* =========================================================
   START STAR GAME
========================================================= */

function startFallingStarsGame() {

    if (
        !fallingStarsArea ||
        fallingStarGameStarted
    ) {
        return;
    }


    resetFallingStarsGame();


    fallingStarGameStarted = true;


    /* Create first star immediately */

    createFallingGameStar();


    /* Continue creating stars */

    fallingStarSpawnTimer =
        setInterval(
            function () {

                if (
    starsCaughtCount <
    totalStarsNeeded
) {
    createFallingGameStar();
}


            },
            900
        );
}


/* =========================================================
   CREATE FALLING STAR
========================================================= */

function createFallingGameStar() {

    if (
    !fallingStarsArea ||
    starsCaughtCount >=
        totalStarsNeeded
) {
    return;
}


    const fallingStarButton =
        document.createElement(
            "button"
        );


    fallingStarButton.type =
        "button";


    fallingStarButton.className =
        "catch-star";


    fallingStarButton.textContent =
        "⭐";


    fallingStarButton.setAttribute(
        "aria-label",
        "Catch falling star"
    );


    /*
       Keep the star fully inside
       the game-area width.
    */

    const availableWidth =
        Math.max(
            0,
            fallingStarsArea.clientWidth -
            60
        );


    fallingStarButton.style.left =
        Math.random() *
        availableWidth +
        "px";


    /*
       Random falling speed:
       between 3 and 4.7 seconds.
    */

    const fallDuration =
        3 +
        Math.random() *
        1.7;


    fallingStarButton.style.setProperty(
        "--fall-duration",
        fallDuration + "s"
    );


    fallingStarsArea.appendChild(
        fallingStarButton
    );


    fallingStarButton.addEventListener(
        "pointerdown",
        function (event) {

            event.preventDefault();

            catchFallingGameStar(
                fallingStarButton
            );

        }
    );


    fallingStarButton.addEventListener(
        "animationend",
        function () {

            if (
                fallingStarButton
                    .isConnected &&
                !fallingStarButton
                    .classList
                    .contains(
                        "star-caught"
                    )
            ) {

                fallingStarButton.remove();

            }

        }
    );
}


/* =========================================================
   CATCH STAR
========================================================= */

function catchFallingGameStar(
    fallingStarButton
) {

    if (
    !fallingStarButton ||
    starsCaughtCount >= totalStarsNeeded ||
    fallingStarButton.classList.contains(
        "star-caught"
    )
) {
    return;
}


    fallingStarButton.classList.add(
        "star-caught"
    );


    starsCaughtCount++;


    if (starGameCounter) {

        starGameCounter.textContent =
    "⭐ " +
    starsCaughtCount +
    " / " +
    totalStarsNeeded +
    " wishes collected";
    }


    createStarCatchParticles(
        fallingStarButton
    );


    if (
    starsCaughtCount >=
    totalStarsNeeded
) {
    completeFallingStarsGame();
}


    setTimeout(
        function () {

            if (
                fallingStarButton
                    .isConnected
            ) {

                fallingStarButton.remove();

            }

        },
        450
    );
}


/* =========================================================
   SMALL CATCH SPARKLES
========================================================= */

function createStarCatchParticles(
    fallingStarButton
) {

    const rectangle =
        fallingStarButton
            .getBoundingClientRect();


    const centerX =
        rectangle.left +
        rectangle.width / 2;


    const centerY =
        rectangle.top +
        rectangle.height / 2;


    const particleSymbols = [
        "✨",
        "⭐",
        "💫"
    ];


    for (
        let index = 0;
        index < 12;
        index++
    ) {

        const particle =
            document.createElement(
                "span"
            );


        particle.className =
            "star-catch-particle";


        particle.textContent =
            particleSymbols[
                Math.floor(
                    Math.random() *
                    particleSymbols.length
                )
            ];


        particle.style.left =
            centerX + "px";


        particle.style.top =
            centerY + "px";


        particle.style.setProperty(
            "--particle-x",
            (
                Math.random() *
                150 -
                75
            ) +
            "px"
        );


        particle.style.setProperty(
            "--particle-y",
            (
                Math.random() *
                150 -
                75
            ) +
            "px"
        );


        document.body.appendChild(
            particle
        );


        setTimeout(
            function () {

                particle.remove();

            },
            900
        );
    }
}


/* =========================================================
   COMPLETE STAR GAME
========================================================= */

function completeFallingStarsGame() {

    if (fallingStarSpawnTimer) {

        clearInterval(
            fallingStarSpawnTimer
        );

        fallingStarSpawnTimer = null;
    }


    if (fallingStarsArea) {

        fallingStarsArea
            .querySelectorAll(
                ".catch-star"
            )
            .forEach(function (
                fallingStarButton
            ) {

                if (
                    !fallingStarButton
                        .classList
                        .contains(
                            "star-caught"
                        )
                ) {

                    fallingStarButton
                        .remove();

                }

            });


        fallingStarsArea.classList.add(
            "stars-complete"
        );
    }


    if (starGameCounter) {

        starGameCounter.textContent =
    "⭐ 22 / 22 wishes collected! ✨";
    }


    if (starsGameMessage) {

        starsGameMessage.textContent =
    "All 22 wishes are yours 💖";
    }


    createFinalStarsExplosion();


    setTimeout(
        function () {

            if (starsNextBtn) {

                starsNextBtn.style.display =
                    "inline-block";

                starsNextBtn.classList.add(
                    "show-stars-button"
                );
            }

        },
        650
    );
}


/* =========================================================
   BIG FIFTH-STAR EXPLOSION
========================================================= */

function createFinalStarsExplosion() {

    if (!fallingStarsArea) {
        return;
    }


    const rectangle =
        fallingStarsArea
            .getBoundingClientRect();


    const centerX =
        rectangle.left +
        rectangle.width / 2;


    const centerY =
        rectangle.top +
        rectangle.height / 2;


    const sparkleSymbols = [
        "⭐",
        "✨",
        "💫",
        "🌟",
        "💖"
    ];


    for (
        let index = 0;
        index < 40;
        index++
    ) {

        const sparkle =
            document.createElement(
                "span"
            );


        sparkle.className =
            "final-star-sparkle";


        sparkle.textContent =
            sparkleSymbols[
                Math.floor(
                    Math.random() *
                    sparkleSymbols.length
                )
            ];


        sparkle.style.left =
            centerX + "px";


        sparkle.style.top =
            centerY + "px";


        const angle =
            Math.random() *
            Math.PI *
            2;


        const distance =
            90 +
            Math.random() *
            220;


        sparkle.style.setProperty(
            "--explosion-x",
            Math.cos(angle) *
            distance +
            "px"
        );


        sparkle.style.setProperty(
            "--explosion-y",
            Math.sin(angle) *
            distance +
            "px"
        );


        document.body.appendChild(
            sparkle
        );


        setTimeout(
            function () {

                sparkle.remove();

            },
            1300
        );
    }
}


/* =========================================================
   STAR GAME -> TORN PHOTOGRAPH
========================================================= */

if (starsNextBtn) {

    starsNextBtn.addEventListener(
        "click",
        function () {

            resetTornPhotoGame();

            show("scene-torn-photo");

        }
    );
}

/* =========================================================
   TORN PHOTOGRAPH
========================================================= */

const tornPhotoBoard =
    document.getElementById(
        "tornPhotoBoard"
    );

const tornPhotoPieces =
    [
        ...document.querySelectorAll(
            ".torn-piece"
        )
    ];

const tornPhotoMessage =
    document.getElementById(
        "tornPhotoMessage"
    );

const tornPhotoReveal =
    document.getElementById(
        "tornPhotoReveal"
    );

const tornPhotoNextBtn =
    document.getElementById(
        "tornPhotoNextBtn"
    );


const tornCorrectOrder = [
    1, 2, 3,
    4, 5, 6
];


const tornBackgroundPositions = {

    1: "0% 0%",
    2: "50% 0%",
    3: "100% 0%",

    4: "0% 100%",
    5: "50% 100%",
    6: "100% 100%"
};


let selectedTornPiece = null;
let tornPhotoComplete = false;


/* =========================================================
   SHUFFLE
========================================================= */

function shuffleTornPhoto() {

    const values =
        [...tornCorrectOrder];


    for (
        let index =
            values.length - 1;

        index > 0;

        index--
    ) {

        const randomIndex =
            Math.floor(
                Math.random() *
                (index + 1)
            );


        [
            values[index],
            values[randomIndex]
        ] =
        [
            values[randomIndex],
            values[index]
        ];
    }


    /*
       Prevent starting already solved.
    */

    if (
        values.every(
            function (value, index) {

                return (
                    value ===
                    tornCorrectOrder[index]
                );
            }
        )
    ) {

        [
            values[0],
            values[1]
        ] =
        [
            values[1],
            values[0]
        ];
    }


    return values;
}


/* =========================================================
   UPDATE PIECE
========================================================= */

function updateTornPiece(
    piece
) {

    const pieceValue =
        Number(
            piece.dataset.value
        );


    piece.style.backgroundPosition =
        tornBackgroundPositions[
            pieceValue
        ];
}


/* =========================================================
   RESET GAME
========================================================= */

function resetTornPhotoGame() {

    tornPhotoComplete = false;
    selectedTornPiece = null;


    const shuffled =
        shuffleTornPhoto();


    tornPhotoPieces.forEach(
        function (piece, index) {

            piece.dataset.value =
                shuffled[index];


            piece.classList.remove(
                "selected"
            );


            piece.style.pointerEvents =
                "auto";


            updateTornPiece(
                piece
            );
        }
    );


    if (tornPhotoBoard) {

        tornPhotoBoard.classList.remove(
            "restored"
        );

        tornPhotoBoard.style.display =
            "grid";
    }


    if (tornPhotoMessage) {

        tornPhotoMessage.textContent =
            "The memory is waiting to be restored... ✨";
    }


    if (tornPhotoReveal) {

        tornPhotoReveal.classList.remove(
            "visible"
        );
    }


    if (tornPhotoNextBtn) {

        tornPhotoNextBtn.style.display =
            "none";
    }
}


/* =========================================================
   CLICK / SWAP PIECES
========================================================= */

tornPhotoPieces.forEach(
    function (piece) {

        piece.addEventListener(
            "click",
            function () {

                if (tornPhotoComplete) {
                    return;
                }


                if (!selectedTornPiece) {

                    selectedTornPiece =
                        piece;


                    piece.classList.add(
                        "selected"
                    );


                    if (tornPhotoMessage) {

                        tornPhotoMessage.textContent =
                            "Now choose where this piece belongs 🧩";
                    }


                    return;
                }


                if (
                    selectedTornPiece ===
                    piece
                ) {

                    selectedTornPiece
                        .classList
                        .remove(
                            "selected"
                        );


                    selectedTornPiece =
                        null;


                    return;
                }


                const firstValue =
                    selectedTornPiece
                        .dataset
                        .value;


                const secondValue =
                    piece
                        .dataset
                        .value;


                selectedTornPiece
                    .dataset
                    .value =
                    secondValue;


                piece.dataset.value =
                    firstValue;


                updateTornPiece(
                    selectedTornPiece
                );


                updateTornPiece(
                    piece
                );


                selectedTornPiece
                    .classList
                    .remove(
                        "selected"
                    );


                selectedTornPiece =
                    null;


                checkTornPhoto();

            }
        );
    }
);


/* =========================================================
   CHECK COMPLETION
========================================================= */

function checkTornPhoto() {

    const currentOrder =
        tornPhotoPieces.map(
            function (piece) {

                return Number(
                    piece.dataset.value
                );
            }
        );


    const complete =
        currentOrder.every(
            function (value, index) {

                return (
                    value ===
                    tornCorrectOrder[index]
                );
            }
        );


    if (!complete) {

        if (tornPhotoMessage) {

            tornPhotoMessage.textContent =
                "Almost... keep restoring the memory 💗";
        }

        return;
    }


    completeTornPhoto();
}


/* =========================================================
   MEMORY RESTORED
========================================================= */

function completeTornPhoto() {

    if (tornPhotoComplete) {
        return;
    }

    tornPhotoComplete = true;

    if (tornPhotoMessage) {
        tornPhotoMessage.textContent =
            "❤️ Memory Restored";
    }

    if (tornPhotoBoard) {
        tornPhotoBoard.classList.add(
            "restored"
        );
    }

    tornPhotoPieces.forEach(
        function (piece) {

            piece.classList.remove(
                "selected"
            );

            piece.style.pointerEvents =
                "none";
        }
    );

    /*
       IMPORTANT:
       Stay on this page after completion.
       Do NOT automatically change scene.
    */

    setTimeout(
        function () {

            if (tornPhotoNextBtn) {
                tornPhotoNextBtn.style.display =
                    "inline-block";
            }

        },
        700
    );
}

/* =========================================================
   TORN PHOTO -> CONSTELLATION
========================================================= */

if (tornPhotoNextBtn) {

    tornPhotoNextBtn.addEventListener(
        "click",
        function () {

            resetConstellationGame();

            show("scene-constellation");

        }
    );
}




/* =========================================================
   CONSTELLATION CONNECTION GAME
========================================================= */

const constellationBoard =
    document.getElementById(
        "constellationBoard"
    );

const constellationStars =
    [
        ...document.querySelectorAll(
            ".constellation-star"
        )
    ];

const constellationLines =
    document.getElementById(
        "constellationLines"
    );

const constellationCounter =
    document.getElementById(
        "constellationCounter"
    );

const constellationHint =
    document.getElementById(
        "constellationHint"
    );

const constellationStatus =
    document.getElementById(
        "constellationStatus"
    );

const constellationCompleteMessage =
    document.getElementById(
        "constellationCompleteMessage"
    );

const constellationNextBtn =
    document.getElementById(
        "constellationNextBtn"
    );


let constellationProgress = 0;
let constellationComplete = false;


/* =========================================================
   RESET CONSTELLATION
========================================================= */

function resetConstellationGame() {

    constellationProgress = 0;
    constellationComplete = false;


    if (constellationLines) {

        constellationLines.innerHTML =
            "";
    }


    constellationStars.forEach(
        function (star) {

            star.disabled = false;

            star.classList.remove(
                "connected",
                "next-star",
                "wrong-star"
            );
        }
    );


    if (constellationStars[0]) {

        constellationStars[0]
            .classList
            .add(
                "next-star"
            );
    }


    if (constellationCounter) {

        constellationCounter.textContent =
            "⭐ 0 / 8 stars connected";
    }


    if (constellationHint) {

        constellationHint.textContent =
            "Tap the glowing stars in the correct order ✨";
    }


    if (constellationStatus) {

        constellationStatus.textContent =
            "Begin with the glowing first star 💫";
    }


    if (constellationCompleteMessage) {

        constellationCompleteMessage
            .classList
            .remove(
                "visible"
            );
    }


    if (constellationNextBtn) {

        constellationNextBtn.style.display =
            "none";
    }
}


/* =========================================================
   CLICK CONSTELLATION STARS
========================================================= */

constellationStars.forEach(
    function (star) {

        star.addEventListener(
            "click",
            function () {

                if (constellationComplete) {
                    return;
                }


                const clickedOrder =
                    Number(
                        star.dataset.order
                    );


                const expectedOrder =
                    constellationProgress +
                    1;


                /*
                   Wrong star selected.
                */

                if (
                    clickedOrder !==
                    expectedOrder
                ) {

                    star.classList.remove(
                        "wrong-star"
                    );


                    void star.offsetWidth;


                    star.classList.add(
                        "wrong-star"
                    );


                    if (constellationStatus) {

                        constellationStatus.textContent =
                            "That star isn't next... follow the glow 🌙";
                    }


                    return;
                }


                /*
                   Correct star selected.
                */

                star.classList.remove(
                    "next-star"
                );


                star.classList.add(
                    "connected"
                );


                star.disabled = true;


                if (constellationProgress > 0) {

                    const previousStar =
                        constellationStars[
                            constellationProgress -
                            1
                        ];


                    drawConstellationLine(
                        previousStar,
                        star
                    );
                }


                constellationProgress++;


                if (constellationCounter) {

                    constellationCounter.textContent =
                        "⭐ " +
                        constellationProgress +
                        " / " +
                        constellationStars.length +
                        " stars connected";
                }


                if (
                    constellationProgress <
                    constellationStars.length
                ) {

                    constellationStars[
                        constellationProgress
                    ].classList.add(
                        "next-star"
                    );


                    if (constellationStatus) {

                        constellationStatus.textContent =
                            "Beautiful... follow the next glowing star ✨";
                    }

                } else {

                    completeConstellationGame();

                }

            }
        );
    }
);


/* =========================================================
   DRAW CONNECTING LINE
========================================================= */

function drawConstellationLine(
    firstStar,
    secondStar
) {

    if (
        !constellationBoard ||
        !constellationLines
    ) {
        return;
    }


    const boardRectangle =
        constellationBoard
            .getBoundingClientRect();


    const firstRectangle =
        firstStar
            .getBoundingClientRect();


    const secondRectangle =
        secondStar
            .getBoundingClientRect();


    const scaleX =
        400 /
        boardRectangle.width;


    const scaleY =
        320 /
        boardRectangle.height;


    const x1 =
        (
            firstRectangle.left -
            boardRectangle.left +
            firstRectangle.width / 2
        ) *
        scaleX;


    const y1 =
        (
            firstRectangle.top -
            boardRectangle.top +
            firstRectangle.height / 2
        ) *
        scaleY;


    const x2 =
        (
            secondRectangle.left -
            boardRectangle.left +
            secondRectangle.width / 2
        ) *
        scaleX;


    const y2 =
        (
            secondRectangle.top -
            boardRectangle.top +
            secondRectangle.height / 2
        ) *
        scaleY;


    const line =
        document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );


    line.setAttribute(
        "x1",
        x1
    );

    line.setAttribute(
        "y1",
        y1
    );

    line.setAttribute(
        "x2",
        x2
    );

    line.setAttribute(
        "y2",
        y2
    );

    line.setAttribute(
        "class",
        "constellation-line"
    );


    constellationLines.appendChild(
        line
    );
}


/* =========================================================
   COMPLETE CONSTELLATION
========================================================= */

function completeConstellationGame() {

    if (constellationComplete) {
        return;
    }


    constellationComplete = true;


    /*
       Close the heart shape by connecting
       the last star back to the first.
    */

    if (
        constellationStars.length > 1
    ) {

        drawConstellationLine(
            constellationStars[
                constellationStars.length -
                1
            ],
            constellationStars[0]
        );
    }


    if (constellationCounter) {

        constellationCounter.textContent =
            "❤️ Heart constellation completed!";
    }


    if (constellationHint) {

        constellationHint.textContent =
            "The stars created something special 💖";
    }


    if (constellationStatus) {

        constellationStatus.textContent =
            "Our little constellation is complete ✨";
    }


    setTimeout(
        function () {

            if (
                constellationCompleteMessage
            ) {

                constellationCompleteMessage
                    .classList
                    .add(
                        "visible"
                    );
            }

        },
        900
    );


    setTimeout(
        function () {

            if (constellationNextBtn) {

                constellationNextBtn.style.display =
                    "inline-block";
            }

        },
        1400
    );
}


/* =========================================================
   CONSTELLATION -> LAST SURPRISE
========================================================= */

if (constellationNextBtn) {

    constellationNextBtn.addEventListener(
        "click",
        function () {

            show("scene-surprise");

        }
    );
}

/* =========================================================
   BUTTERFLY CHASE
========================================================= */

const chaseButterflies = [
    ...document.querySelectorAll(".chase-butterfly")
];

const capturedButterflies = [
    ...document.querySelectorAll(".captured-butterfly")
];

const butterflyGame =
    document.getElementById("butterflyGame");

const butterflyCounter =
    document.getElementById("butterflyCounter");

const butterflyHint =
    document.getElementById("butterflyHint");

const butterflyReveal =
    document.getElementById("butterflyReveal");

const butterflyNextBtn =
    document.getElementById("butterflyNextBtn");

let butterfliesCaught = 0;
let butterflyGameComplete = false;


/* =========================================================
   RESET BUTTERFLY GAME
========================================================= */

function resetButterflyGame() {

    butterfliesCaught = 0;
    butterflyGameComplete = false;

    chaseButterflies.forEach(function (butterfly) {

        butterfly.disabled = false;

        butterfly.style.display = "flex";

        butterfly.classList.remove(
            "butterfly-caught"
        );
    });

    capturedButterflies.forEach(function (butterfly) {

        butterfly.classList.remove(
            "collected"
        );

        butterfly.getAnimations().forEach(
            function (animation) {
                animation.cancel();
            }
        );
    });

    if (butterflyGame) {

        butterflyGame.style.display = "block";

        butterflyGame.classList.remove(
            "butterflies-complete"
        );
    }

    if (butterflyCounter) {

        butterflyCounter.textContent =
            "🦋 0 / 5 captured";
    }

    if (butterflyHint) {

        butterflyHint.textContent =
            "Catch all the butterflies before they flutter away ✨";
    }

    if (butterflyReveal) {

    butterflyReveal.classList.remove(
        "visible"
    );

    butterflyReveal.style.display =
        "";
}

    if (butterflyNextBtn) {

        butterflyNextBtn.style.display =
            "none";
    }
}


/* =========================================================
   CATCH BUTTERFLY
========================================================= */

chaseButterflies.forEach(function (butterfly) {

    butterfly.addEventListener(
        "click",
        function () {

            if (
                butterflyGameComplete ||
                butterfly.classList.contains(
                    "butterfly-caught"
                )
            ) {
                return;
            }

            butterfly.classList.add(
                "butterfly-caught"
            );

            butterfly.disabled = true;

            if (
                capturedButterflies[
                    butterfliesCaught
                ]
            ) {

                capturedButterflies[
                    butterfliesCaught
                ].classList.add(
                    "collected"
                );
            }

            butterfliesCaught++;

            if (butterflyCounter) {

                butterflyCounter.textContent =
                    "🦋 " +
                    butterfliesCaught +
                    " / " +
                    chaseButterflies.length +
                    " captured";
            }

            setTimeout(
                function () {

                    butterfly.style.display =
                        "none";

                },
                500
            );

            if (
                butterfliesCaught ===
                chaseButterflies.length
            ) {

                completeButterflyGame();
            }
        }
    );
});


/* =========================================================
   COMPLETE BUTTERFLY GAME
========================================================= */

function completeButterflyGame() {

    if (butterflyGameComplete) {
        return;
    }

    butterflyGameComplete = true;

    if (butterflyCounter) {

        butterflyCounter.textContent =
            "All butterflies captured! 🦋✨";
    }

    if (butterflyHint) {

        butterflyHint.textContent =
            "They're bringing one final little memory... 💖";
    }

    capturedButterflies.forEach(
        function (butterfly, index) {

            butterfly.animate(
                [
                    {
                        transform: "scale(1)",
                        filter:
                            "drop-shadow(0 0 8px #ff77c0)"
                    },
                    {
                        transform:
                            "translateY(-35px) scale(1.6)",
                        filter:
                            "drop-shadow(0 0 22px #ffffff)"
                    },
                    {
                        transform:
                            "translateY(0) scale(1)",
                        filter:
                            "drop-shadow(0 0 12px #ff77c0)"
                    }
                ],
                {
                    duration: 900,
                    delay: index * 100,
                    easing: "ease-in-out",
                    fill: "forwards"
                }
            );
        }
    );

    setTimeout(
        function () {

            if (butterflyGame) {

                butterflyGame.classList.add(
                    "butterflies-complete"
                );
            }
        },
        700
    );

    setTimeout(
        function () {

            if (butterflyGame) {

                butterflyGame.style.display =
                    "none";
            }

            if (butterflyReveal) {

                butterflyReveal.classList.add(
                    "visible"
                );
            }
        },
        1300
    );

    setTimeout(
        function () {

            if (butterflyNextBtn) {

                butterflyNextBtn.style.display =
                    "inline-block";
            }
        },
        1700
    );
}


/* =========================================================
   BUTTERFLY -> LETTER
========================================================= */

if (butterflyNextBtn) {

    butterflyNextBtn.addEventListener(
        "click",
        function () {

            show("scene-letter");

        }
    );
}

/* =========================================================
   KEYBOARD ENTER SUPPORT
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key !== "Enter") {
            return;
        }


        const activeScene =
            document.querySelector(
                ".scene.active"
            );


        if (!activeScene) {
            return;
        }


        /*
           Find only visible pink buttons.
        */

        const buttons =
            [
                ...activeScene
                    .querySelectorAll(
                        ".pink-btn"
                    )
            ];


        const visibleButton =
            buttons.find(button => {

                const style =
                    window.getComputedStyle(
                        button
                    );


                return (
                    style.display !==
                    "none" &&

                    style.visibility !==
                    "hidden"
                );
            });


        if (visibleButton) {

            visibleButton.click();
        }
    }
);


/* =========================================================
   UNIVERSAL BACK BUTTONS
========================================================= */

const sceneOrder = [
    "scene-gift",
    "scene-password",
    "scene-candles",
    "scene-cake",
    "scene-ribbon",
    "scene-memory",
    "scene-flower-game",
    "scene-balloons",
    "scene-hidden-hearts",
    "scene-heart-safe",
    "scene-puzzle",
    "scene-envelope",
    "scene-scratch",
    "scene-stars-game",
    "scene-torn-photo",
    "scene-constellation",
    "scene-surprise",
    "scene-final-photo",
    "scene-butterfly",
    "scene-letter",
    "scene-end"
];


/* =========================================================
   RESET A SCENE BEFORE RETURNING TO IT
========================================================= */

function resetSceneForBack(sceneId) {

    /* PASSWORD */

    if (sceneId === "scene-password") {

        entered = "";

        updateDots();

        if (codeMessage) {
            codeMessage.textContent = "";
        }
    }


    /* 22 CANDLES */

    if (
        sceneId === "scene-candles" &&
        typeof resetBirthday22 === "function"
    ) {
        resetBirthday22();
    }


    /* BIRTHDAY CAKE */

    if (sceneId === "scene-cake") {

        document
            .querySelectorAll(".flames b")
            .forEach(
                function (flame) {

                    flame.style.opacity =
                        "1";
                }
            );
    }


    /* RIBBON */

    if (
        sceneId === "scene-ribbon" &&
        typeof resetRibbonGame === "function"
    ) {
        resetRibbonGame();
    }


    /* MAGIC FLOWER */

    if (
        sceneId === "scene-flower-game" &&
        typeof resetMagicFlowerGame ===
            "function"
    ) {
        resetMagicFlowerGame();
    }


    /* BALLOONS */

    if (
        sceneId === "scene-balloons" &&
        typeof resetBalloonsGame ===
            "function"
    ) {
        resetBalloonsGame();
    }


    /* HIDDEN HEARTS */

    if (
        sceneId === "scene-hidden-hearts" &&
        typeof resetHiddenHeartsGame ===
            "function"
    ) {
        resetHiddenHeartsGame();
    }


    /* HEART VAULT */

    if (
        sceneId === "scene-heart-safe" &&
        typeof resetHeartSafe === "function"
    ) {
        resetHeartSafe();
    }


    /* IMAGE PUZZLE */

    if (
        sceneId === "scene-puzzle" &&
        typeof createImagePuzzle ===
            "function"
    ) {

        selectedPiece = null;

        if (puzzle) {
            puzzle.style.gap = "3px";
        }

        puzzleButtons.forEach(
            function (button) {

                button.style.pointerEvents =
                    "auto";

                button.style.border = "";

                button.style.outline = "";

                button.style.boxShadow = "";

                button.classList.remove(
                    "selected"
                );
            }
        );

        createImagePuzzle();
    }


    /* ENVELOPE */

    if (
        sceneId === "scene-envelope" &&
        typeof resetEnvelopeGame ===
            "function"
    ) {
        resetEnvelopeGame();
    }


    /* SCRATCH CARD */

    if (
        sceneId === "scene-scratch" &&
        typeof drawScratchCover ===
            "function"
    ) {

        requestAnimationFrame(
            function () {

                drawScratchCover();
            }
        );
    }


    /* FALLING STARS */

    if (
        sceneId === "scene-stars-game" &&
        typeof resetFallingStarsGame ===
            "function"
    ) {

        resetFallingStarsGame();

        setTimeout(
            function () {

                const starsScene =
                    document.getElementById(
                        "scene-stars-game"
                    );

                if (
                    starsScene &&
                    starsScene.classList.contains(
                        "active"
                    )
                ) {
                    startFallingStarsGame();
                }

            },
            150
        );
    }


    /* TORN PHOTOGRAPH */

    if (
        sceneId === "scene-torn-photo" &&
        typeof resetTornPhotoGame ===
            "function"
    ) {
        resetTornPhotoGame();
    }


    /* CONSTELLATION */

    if (
        sceneId ===
            "scene-constellation" &&
        typeof resetConstellationGame ===
            "function"
    ) {
        resetConstellationGame();
    }


    /* BUTTERFLY CHASE */

    if (
        sceneId === "scene-butterfly" &&
        typeof resetButterflyGame ===
            "function"
    ) {
        resetButterflyGame();
    }
}

/* =========================================================
   CREATE BACK BUTTONS
========================================================= */

sceneOrder.forEach(
    function (sceneId, index) {

        /*
           First page does not need Back.
        */

        if (index === 0) {
            return;
        }


        const scene =
            document.getElementById(
                sceneId
            );


        if (!scene) {
            return;
        }


        /*
           Prevent duplicate Back buttons.
        */

        if (
            scene.querySelector(
                ".scene-back-btn"
            )
        ) {
            return;
        }


        const backButton =
            document.createElement(
                "button"
            );


        backButton.type =
            "button";


        backButton.className =
            "scene-back-btn";


        backButton.textContent =
            "←";


        backButton.setAttribute(
            "aria-label",
            "Go back to previous page"
        );


        backButton.addEventListener(
            "click",
            function () {

                const previousScene =
                    sceneOrder[
                        index - 1
                    ];


                resetSceneForBack(
                    previousScene
                );


                show(
                    previousScene
                );

            }
        );


        scene.appendChild(
            backButton
        );

    }
);
// Republish GitHub Pages

document.addEventListener('DOMContentLoaded', () => {
    const playerInputs = document.querySelectorAll('.player-input');
    const multiplierInputs = document.querySelectorAll('.multiplier-input');
    const decideWinnerButtons = document.querySelectorAll('.decide-winner-btn');

    const getMatchElement = (element) => element.closest('.match');

    const arePlayerInputsComplete = (matchElement) => {
        const player1NameInput = matchElement.querySelector('.player-input[data-player-id="1"]:not([readonly])');
        const player1MultiplierInput = matchElement.querySelector('.multiplier-input[data-player-id="1"]:not([readonly])');
        const player2NameInput = matchElement.querySelector('.player-input[data-player-id="2"]:not([readonly])');
        const player2MultiplierInput = matchElement.querySelector('.multiplier-input[data-player-id="2"]:not([readonly])');

        if (!player1NameInput || !player2NameInput) return false;

        return (
            player1NameInput.value.trim() !== '' &&
            player2NameInput.value.trim() !== '' &&
            player1MultiplierInput.value.trim() !== '' &&
            player2MultiplierInput.value.trim() !== ''
        );
    };

    const toggleDecideWinnerButton = (matchElement) => {
        const decideBtn = matchElement.querySelector('.decide-winner-btn');
        if (decideBtn && !decideBtn.classList.contains('match-completed')) {
            if (arePlayerInputsComplete(matchElement)) {
                decideBtn.classList.add('active');
            } else {
                decideBtn.classList.remove('active');
            }
        }
    };

    playerInputs.forEach(input => {
        input.addEventListener('input', () => toggleDecideWinnerButton(getMatchElement(input)));
        input.addEventListener('focus', () => input.style.boxShadow = '0 0 10px var(--glow-color)');
        input.addEventListener('blur', () => input.style.boxShadow = '');
    });

    multiplierInputs.forEach(input => {
        input.addEventListener('input', () => toggleDecideWinnerButton(getMatchElement(input)));
        input.addEventListener('focus', () => input.style.boxShadow = '0 0 10px var(--glow-color)');
        input.addEventListener('blur', () => input.style.boxShadow = '');
    });

    decideWinnerButtons.forEach(button => {
        button.addEventListener('click', () => {
            const match = getMatchElement(button);
            const matchId = match.id;

            const p1Name = match.querySelector('.player-input[data-player-id="1"]');
            const p1Mult = match.querySelector('.multiplier-input[data-player-id="1"]');
            const p2Name = match.querySelector('.player-input[data-player-id="2"]');
            const p2Mult = match.querySelector('.multiplier-input[data-player-id="2"]');

            if (!p1Name || !p2Name || !p1Mult || !p2Mult || !p1Name.value || !p2Name.value || !p1Mult.value || !p2Mult.value) {
                alert('Please enter both names and multipliers.');
                return;
            }

            const m1 = parseFloat(p1Mult.value);
            const m2 = parseFloat(p2Mult.value);
            let winnerName = (m1 >= m2) ? p1Name.value : p2Name.value;

            const nextMatchMap = {
                "match-R1A": { nextMatch: "match-R2A", playerId: "1" },
                "match-R1B": { nextMatch: "match-R2A", playerId: "2" },
                "match-R1C": { nextMatch: "match-R2B", playerId: "1" },
                "match-R1D": { nextMatch: "match-R2B", playerId: "2" },
                "match-R2A": { nextMatch: "match-R3A", playerId: "1" },
                "match-R2B": { nextMatch: "match-R3A", playerId: "2" },
                "match-R3A": { nextMatch: "match-Winner", playerId: "1" }
            };

            const next = nextMatchMap[matchId];
            if (next) {
                const { nextMatch, playerId } = next;
                const nameSelector = nextMatch === "match-Winner"
                    ? `#${nextMatch} .final-winner-input`
                    : `#${nextMatch} .player-input[data-player-id="${playerId}"]`;

                const inputName = document.querySelector(nameSelector);
                if (inputName) inputName.value = winnerName;

                // ✅ Save to Firebase
                import("https://www.gstatic.com/firebasejs/10.11.1/firebase-database.js").then(({ getDatabase, ref, set }) => {
                    const db = getDatabase();
                    const path = `matches/${nextMatch}/player${playerId}/name`;
                    set(ref(db, path), winnerName);
                });
            }

            match.querySelectorAll('input').forEach(input => {
                input.readOnly = true;
                input.style.pointerEvents = 'none';
            });
            button.disabled = true;
        });
    });

    document.querySelectorAll('.match').forEach(match => toggleDecideWinnerButton(match));

    const initialAnimateMatches = () => {
        const matches = document.querySelectorAll('.match');
        matches.forEach((match, index) => {
            match.style.animationDelay = `${index * 0.08}s`;
            match.style.opacity = 0;
            match.style.transform = 'translateY(20px)';
            match.style.animation = 'matchFadeIn 0.7s forwards ease-out';
        });
    };

    if (!document.querySelector('style[data-keyframe-matchfadein]')) {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.setAttribute('data-keyframe-matchfadein', 'true');
        styleSheet.innerText = `
            @keyframes matchFadeIn {
                to { opacity: 1; transform: translateY(0); }
            }
        `;
        document.head.appendChild(styleSheet);
    }

    initialAnimateMatches();
});

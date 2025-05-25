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
            let winnerName = '';

            if (m1 > m2 || m1 === m2) {
                winnerName = p1Name.value;
            } else {
                winnerName = p2Name.value;
            }

            if (matchId === 'match-R1A') {
                document.querySelector('input[placeholder="Winner R1A/B"][data-player-id="1"]').value = winnerName;
            } else if (matchId === 'match-R1B') {
                document.querySelector('input[placeholder="Winner R1A/B"][data-player-id="2"]').value = winnerName;
            } else if (matchId === 'match-R1C') {
                document.querySelector('input[placeholder="Winner R1C/D"][data-player-id="1"]').value = winnerName;
            } else if (matchId === 'match-R1D') {
                document.querySelector('input[placeholder="Winner R1C/D"][data-player-id="2"]').value = winnerName;
            } else if (matchId === 'match-R2A') {
                document.querySelector('input[placeholder="Winner R2A/B"][data-player-id="1"]').value = winnerName;
            } else if (matchId === 'match-R2B') {
                document.querySelector('input[placeholder="Winner R2A/B"][data-player-id="2"]').value = winnerName;
            } else if (matchId === 'match-R3A') {
                document.querySelector('input.final-winner-input[placeholder="Tournament Champion"]').value = winnerName;
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

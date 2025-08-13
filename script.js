// 게임 상태 변수들
let gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    gameStarted: false,
    gameCompleted: false,
    startTime: null,
    timerInterval: null
};

// 카드 심볼들 (이모지 사용)
const cardSymbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

// DOM 요소들
const gameBoard = document.getElementById('gameBoard');
const timerElement = document.getElementById('timer');
const movesElement = document.getElementById('moves');
const scoreElement = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const gameCompleteModal = document.getElementById('gameCompleteModal');
const finalTimeElement = document.getElementById('finalTime');
const finalMovesElement = document.getElementById('finalMoves');
const finalScoreElement = document.getElementById('finalScore');
const playerNameInput = document.getElementById('playerName');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const leaderboardList = document.getElementById('leaderboardList');
const refreshLeaderboardBtn = document.getElementById('refreshLeaderboardBtn');
const leaderboardLoading = document.getElementById('leaderboardLoading');

// Supabase 설정 (나중에 실제 URL과 키로 교체)
let supabase = null;

// 게임 초기화
function initGame() {
    createCards();
    updateDisplay();
    loadLeaderboard();
}

// 카드 생성 및 셔플
function createCards() {
    gameBoard.innerHTML = '';
    gameState.cards = [];
    
    // 각 심볼을 2개씩 생성 (총 16장)
    const cardPairs = [...cardSymbols, ...cardSymbols];
    
    // 카드 셔플
    for (let i = cardPairs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cardPairs[i], cardPairs[j]] = [cardPairs[j], cardPairs[i]];
    }
    
    // 카드 DOM 요소 생성
    cardPairs.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        
        // 카드 앞면과 뒷면
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        cardFront.textContent = symbol;
        
        const cardBack = document.createElement('div');
        cardBack.className = 'card-back';
        cardBack.textContent = '?';
        
        card.appendChild(cardFront);
        card.appendChild(cardBack);
        
        // 클릭 이벤트
        card.addEventListener('click', () => handleCardClick(card));
        
        gameBoard.appendChild(card);
        gameState.cards.push(card);
    });
}

// 카드 클릭 처리
function handleCardClick(card) {
    if (!gameState.gameStarted || gameState.gameCompleted) return;
    
    const index = parseInt(card.dataset.index);
    const symbol = card.dataset.symbol;
    
    // 이미 뒤집힌 카드나 매치된 카드는 무시
    if (card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // 카드 뒤집기
    card.classList.add('flipped');
    gameState.flippedCards.push({ card, symbol, index });
    
    // 두 번째 카드가 뒤집어졌을 때 매치 확인
    if (gameState.flippedCards.length === 2) {
        gameState.moves++;
        updateDisplay();
        
        const [card1, card2] = gameState.flippedCards;
        
        if (card1.symbol === card2.symbol) {
            // 매치 성공
            setTimeout(() => {
                card1.card.classList.add('matched');
                card2.card.classList.add('matched');
                gameState.matchedPairs++;
                gameState.flippedCards = [];
                
                // 게임 완료 확인
                if (gameState.matchedPairs === cardSymbols.length) {
                    endGame();
                }
            }, 500);
        } else {
            // 매치 실패 - 카드 다시 뒤집기
            setTimeout(() => {
                card1.card.classList.remove('flipped');
                card2.card.classList.remove('flipped');
                gameState.flippedCards = [];
            }, 1000);
        }
    }
}

// 게임 시작
function startGame() {
    if (gameState.gameStarted) return;
    
    gameState.gameStarted = true;
    gameState.startTime = Date.now();
    startTimer();
    startBtn.textContent = '게임 진행 중...';
    startBtn.disabled = true;
}

// 게임 종료
function endGame() {
    gameState.gameCompleted = true;
    gameState.gameStarted = false;
    stopTimer();
    
    const finalTime = Math.floor((Date.now() - gameState.startTime) / 1000);
    const finalScore = calculateScore(finalTime, gameState.moves);
    
    // 모달에 최종 결과 표시
    finalTimeElement.textContent = formatTime(finalTime);
    finalMovesElement.textContent = gameState.moves;
    finalScoreElement.textContent = finalScore;
    
    // 모달 표시
    gameCompleteModal.style.display = 'block';
}

// 게임 리셋
function resetGame() {
    gameState = {
        cards: [],
        flippedCards: [],
        matchedPairs: 0,
        moves: 0,
        gameStarted: false,
        gameCompleted: false,
        startTime: null,
        timerInterval: null
    };
    
    stopTimer();
    createCards();
    updateDisplay();
    
    startBtn.textContent = '게임 시작';
    startBtn.disabled = false;
    
    // 모달 숨기기
    gameCompleteModal.style.display = 'none';
}

// 타이머 시작
function startTimer() {
    gameState.timerInterval = setInterval(() => {
        if (gameState.startTime) {
            const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
            timerElement.textContent = formatTime(elapsed);
        }
    }, 1000);
}

// 타이머 정지
function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

// 시간 포맷팅 (MM:SS)
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// 점수 계산
function calculateScore(time, moves) {
    // 기본 점수: 1000점
    // 시간에 따른 감점: 초당 2점
    // 시도 횟수에 따른 감점: 시도당 5점
    const timePenalty = time * 2;
    const movePenalty = moves * 5;
    const score = Math.max(100, 1000 - timePenalty - movePenalty);
    return Math.floor(score);
}

// 화면 업데이트
function updateDisplay() {
    movesElement.textContent = gameState.moves;
    
    if (gameState.gameStarted && gameState.startTime) {
        const elapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
        const score = calculateScore(elapsed, gameState.moves);
        scoreElement.textContent = score;
    } else {
        scoreElement.textContent = '0';
    }
}

// Supabase 초기화
async function initSupabase() {
    // 설정 검증
    if (!window.gameConfig || !window.gameConfig.validateConfig()) {
        console.error('Configuration validation failed');
        return;
    }
    
    const { config } = window.gameConfig;
    
    try {
        supabase = window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY);
        
        // 연결 테스트
        const { data, error } = await supabase.from('scores').select('count').limit(1);
        if (error) {
            console.error('Supabase connection test failed:', error);
            return;
        }
        
        console.log('Supabase connected successfully');
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
    }
}

// 점수 저장
async function saveScore() {
    const playerName = playerNameInput.value.trim();
    if (!playerName) {
        alert('이름을 입력해주세요!');
        return;
    }
    
    if (!supabase) {
        alert('Supabase가 설정되지 않았습니다. 점수는 저장되지 않습니다.');
        closeModal();
        return;
    }
    
    try {
        const finalTime = Math.floor((Date.now() - gameState.startTime) / 1000);
        const finalScore = calculateScore(finalTime, gameState.moves);
        
        const { data, error } = await supabase
            .from('scores')
            .insert([
                {
                    player_name: playerName,
                    score: finalScore,
                    time_taken: finalTime,
                    attempts: gameState.moves
                }
            ]);
        
        if (error) throw error;
        
        alert('점수가 성공적으로 저장되었습니다!');
        loadLeaderboard();
        closeModal();
    } catch (error) {
        console.error('점수 저장 실패:', error);
        alert('점수 저장에 실패했습니다.');
    }
}

// 리더보드 로드
async function loadLeaderboard() {
    if (!supabase) {
        leaderboardList.innerHTML = '<p>Supabase가 설정되지 않았습니다.</p>';
        return;
    }
    
    // 로딩 상태 표시
    leaderboardList.style.display = 'none';
    leaderboardLoading.style.display = 'block';
    
    try {
        const { data, error } = await supabase
            .from('scores')
            .select('*')
            .order('score', { ascending: false })
            .limit(10);
        
        if (error) throw error;
        
        displayLeaderboard(data || []);
    } catch (error) {
        console.error('리더보드 로드 실패:', error);
        leaderboardList.innerHTML = '<p>리더보드를 불러올 수 없습니다.</p>';
        leaderboardList.style.display = 'block';
    } finally {
        leaderboardLoading.style.display = 'none';
    }
}

// 리더보드 표시
function displayLeaderboard(scores) {
    if (scores.length === 0) {
        leaderboardList.innerHTML = '<p>아직 기록이 없습니다.</p>';
        leaderboardList.style.display = 'block';
        return;
    }
    
    leaderboardList.innerHTML = scores.map((score, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const rankClass = index < 3 ? 'top-rank' : '';
        
        return `
            <div class="leaderboard-item ${rankClass}">
                <div>
                    <strong>${medal} ${index + 1}. ${score.player_name}</strong>
                    <div>${formatTime(score.time_taken)} | ${score.attempts}회 시도</div>
                </div>
                <div class="score">${score.score}점</div>
            </div>
        `;
    }).join('');
    
    leaderboardList.style.display = 'block';
}

// 모달 닫기
function closeModal() {
    gameCompleteModal.style.display = 'none';
    playerNameInput.value = '';
}

// 이벤트 리스너들
startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);
saveScoreBtn.addEventListener('click', saveScore);
playAgainBtn.addEventListener('click', () => {
    closeModal();
    resetGame();
});
refreshLeaderboardBtn.addEventListener('click', loadLeaderboard);

// 모달 외부 클릭 시 닫기
window.addEventListener('click', (event) => {
    if (event.target === gameCompleteModal) {
        closeModal();
    }
});

// Enter 키로 점수 저장
playerNameInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        saveScore();
    }
});

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', async () => {
    await initSupabase();
    initGame();
    
    // 초기 리더보드 로드
    setTimeout(() => {
        loadLeaderboard();
    }, 1000);
});

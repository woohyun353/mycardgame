// 환경 변수 설정
const config = {
    // Supabase 설정 (기본값 포함)
    SUPABASE_URL: 'https://ddqivpgngoxnzaxowhra.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcWl2cGduZ294bnpheG93aHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNTc2ODIsImV4cCI6MjA3MDYzMzY4Mn0.UtC062gAnfM2YLa8JyEM-FWER-UOn-kLaB2VYxXuyxs',
    
    // 게임 설정
    GAME_NAME: 'Card Flip Game',
    GAME_VERSION: '1.0.0',
    
    // 개발/프로덕션 환경 구분
    IS_PRODUCTION: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1',
    
    // API 설정
    API_TIMEOUT: 10000, // 10초
    MAX_RETRIES: 3
};

// 보안 검증 함수
function validateConfig() {
    const requiredKeys = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    const missingKeys = requiredKeys.filter(key => !config[key]);
    
    if (missingKeys.length > 0) {
        console.error('Missing required configuration:', missingKeys);
        return false;
    }
    
    // URL 형식 검증
    try {
        new URL(config.SUPABASE_URL);
    } catch (error) {
        console.error('Invalid SUPABASE_URL format');
        return false;
    }
    
    return true;
}

// 설정 내보내기
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { config, validateConfig };
} else {
    window.gameConfig = { config, validateConfig };
}

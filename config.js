// Supabase 설정 (환경 변수에서 로드)
const config = {
    // Supabase 설정 (환경 변수에서 로드)
    SUPABASE_URL: window.ENV ? window.ENV.SUPABASE_URL : '',
    SUPABASE_ANON_KEY: window.ENV ? window.ENV.SUPABASE_ANON_KEY : '',
    
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

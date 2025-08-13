// 환경 변수 로더 (보안 강화)
(function() {
    'use strict';
    
    // 환경 변수 로드 함수
    function loadEnvironmentVariables() {
        // 자동 생성된 supabase-config.js 파일 사용 (우선순위 1)
        if (typeof window !== 'undefined' && window.SUPABASE_CONFIG) {
            return window.SUPABASE_CONFIG;
        }
        
        // Vercel 환경 변수 (프로덕션) (우선순위 2)
        if (typeof window !== 'undefined' && window.__ENV__) {
            return window.__ENV__;
        }
        
        // 로컬 환경 변수 (개발) (우선순위 3)
        try {
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                return {
                    SUPABASE_URL: 'https://ddqivpgngoxnzaxowhra.supabase.co',
                    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkcWl2cGduZ294bnpheG93aHJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwNTc2ODIsImV4cCI6MjA3MDYzMzY4Mn0.UtC062gAnfM2YLa8JyEM-FWER-UOn-kLaB2VYxXuyxs'
                };
            }
        } catch (error) {
            console.warn('Failed to load local environment variables:', error);
        }
        
        // 기본값 (환경 변수가 없는 경우)
        return {
            SUPABASE_URL: '',
            SUPABASE_ANON_KEY: ''
        };
    }
    
    // 전역 환경 변수 객체 설정
    window.ENV = loadEnvironmentVariables();
    
    console.log('Environment variables loaded:', {
        SUPABASE_URL: window.ENV.SUPABASE_URL ? 'SET' : 'NOT SET',
        SUPABASE_ANON_KEY: window.ENV.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'
    });
})();

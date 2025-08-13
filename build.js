#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// 환경 변수 로드 함수
function loadEnvironmentVariables() {
    const envPath = path.join(__dirname, 'env.local');
    
    // env.local 파일이 존재하는지 확인
    if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, 'utf8');
        const envVars = {};
        
        // 환경 변수 파싱
        envContent.split('\n').forEach(line => {
            const trimmedLine = line.trim();
            if (trimmedLine && !trimmedLine.startsWith('#')) {
                const [key, ...valueParts] = trimmedLine.split('=');
                if (key && valueParts.length > 0) {
                    envVars[key.trim()] = valueParts.join('=').trim();
                }
            }
        });
        
        return envVars;
    }
    
    // env.local이 없으면 process.env에서 로드
    return {
        SUPABASE_URL: process.env.SUPABASE_URL || '',
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || ''
    };
}

// supabase-config.js 생성 함수
function generateSupabaseConfig() {
    const envVars = loadEnvironmentVariables();
    
    const configContent = `// 자동 생성된 Supabase 설정 파일
// 이 파일은 빌드 시 자동으로 생성됩니다.
// 수동으로 수정하지 마세요.

window.SUPABASE_CONFIG = {
    SUPABASE_URL: '${envVars.SUPABASE_URL || ''}',
    SUPABASE_ANON_KEY: '${envVars.SUPABASE_ANON_KEY || ''}'
};

console.log('Supabase configuration loaded from build script');
`;

    const outputPath = path.join(__dirname, 'supabase-config.js');
    
    try {
        fs.writeFileSync(outputPath, configContent, 'utf8');
        console.log('✅ supabase-config.js 파일이 생성되었습니다.');
        console.log('📁 파일 위치:', outputPath);
        
        // 환경 변수 상태 출력
        console.log('🔧 환경 변수 상태:');
        console.log('   SUPABASE_URL:', envVars.SUPABASE_URL ? 'SET' : 'NOT SET');
        console.log('   SUPABASE_ANON_KEY:', envVars.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET');
        
    } catch (error) {
        console.error('❌ supabase-config.js 파일 생성 실패:', error.message);
        process.exit(1);
    }
}

// 빌드 실행
console.log('🚀 Supabase 설정 파일 생성 중...');
generateSupabaseConfig();
console.log('✨ 빌드 완료!');

# 🔒 보안 설정 가이드

## 환경 변수 관리

### 로컬 개발 환경
1. `env.local` 파일에 환경 변수 설정
2. 이 파일은 Git에 커밋되지 않음
3. 로컬에서만 사용

### Vercel 배포 환경
1. Vercel Dashboard → Settings → Environment Variables
2. 다음 변수들을 추가:
   - `SUPABASE_URL`: Supabase 프로젝트 URL
   - `SUPABASE_ANON_KEY`: Supabase Anonymous Key

## 보안 파일 목록
- `env.local` - 로컬 환경 변수 (Git 제외)
- `config.local.js` - 로컬 설정 (Git 제외)
- `.env*` - 모든 환경 변수 파일 (Git 제외)

## 환경 변수 우선순위
1. Vercel 환경 변수 (프로덕션)
2. 로컬 환경 변수 (개발)
3. 기본값 (빈 문자열)

## 주의사항
- API 키를 코드에 직접 하드코딩하지 마세요
- 환경 변수 파일을 Git에 커밋하지 마세요
- 프로덕션 환경에서는 반드시 Vercel 환경 변수를 설정하세요

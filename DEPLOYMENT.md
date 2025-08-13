# 🚀 배포 가이드

## 보안 설정

### 1. 환경 변수 설정

#### 로컬 개발:
1. `config.local.js` 파일을 생성하고 실제 Supabase 정보 입력:
```javascript
window.gameConfig = {
    config: {
        SUPABASE_URL: 'https://your-project.supabase.co',
        SUPABASE_ANON_KEY: 'your-anon-key-here'
    }
};
```

#### 프로덕션 배포:

**GitHub Pages:**
- 환경 변수 설정 불가 (정적 호스팅)
- `config.local.js` 파일에 프로덕션 설정 포함

**Netlify:**
1. Site settings → Environment variables
2. 다음 변수 추가:
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY`: `your-anon-key-here`

**Vercel:**
1. Project settings → Environment Variables
2. 위와 동일한 변수 추가

### 2. 배포 플랫폼별 가이드

#### GitHub Pages
```bash
# 1. 저장소 생성
git init
git add .
git commit -m "Initial commit"

# 2. GitHub에 푸시
git remote add origin https://github.com/username/cardgame.git
git push -u origin main

# 3. Pages 활성화
# Settings → Pages → Source: main branch
```

#### Netlify
1. netlify.com 접속
2. "New site from Git" 클릭
3. GitHub 저장소 연결
4. Build settings:
   - Build command: (비워두기)
   - Publish directory: `.`
5. Environment variables 설정

#### Vercel
1. vercel.com 접속
2. "New Project" 클릭
3. GitHub 저장소 import
4. Environment variables 설정

### 3. 보안 체크리스트

- [ ] `config.local.js` 파일이 `.gitignore`에 포함됨
- [ ] 실제 API 키가 공개 코드에 노출되지 않음
- [ ] 프로덕션 환경에서 환경 변수 사용
- [ ] Supabase RLS (Row Level Security) 설정 확인

### 4. 배포 후 확인사항

1. **게임 기능 테스트**
   - 카드 뒤집기 작동
   - 점수 저장 기능
   - 리더보드 표시

2. **보안 테스트**
   - 브라우저 개발자 도구에서 API 키 노출 확인
   - 네트워크 탭에서 요청/응답 확인

3. **성능 테스트**
   - 페이지 로딩 속도
   - 게임 반응성

### 5. 문제 해결

#### Supabase 연결 실패
- API 키와 URL 확인
- Supabase 프로젝트 상태 확인
- CORS 설정 확인

#### 환경 변수 인식 안됨
- 배포 플랫폼의 환경 변수 설정 확인
- 재배포 필요할 수 있음

#### 리더보드 로드 실패
- Supabase 테이블 권한 설정 확인
- RLS 정책 확인

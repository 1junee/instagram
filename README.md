# instagram

인스타그램 클론을 만드는 저장소입니다. `backend/`는 지난주에 만든 insta API(가입 · 로그인 · 글 · 사진 · 좋아요 · 댓글)이고, `frontend/`에는 이번 주에 React 화면을 만듭니다.

## 폴더 구조

```
instagram/
├── backend/
│   ├── main.py          # 앱 · 라우터 붙이는 곳 · /media
│   ├── config.py        # .env 읽기
│   ├── database.py      # engine · Base
│   ├── models.py        # 테이블 넷(users · posts · comments · likes)
│   ├── schemas.py       # 요청 · 응답 모양
│   ├── deps.py          # SessionDep · 로그인 · 내 글만
│   ├── photos.py        # 사진 저장
│   ├── routers/         # auth · posts · comments · likes · uploads
│   ├── tests/           # pytest
│   ├── alembic/         # 테이블 리비전
│   ├── seed.py          # 더미 데이터
│   └── seed_images/     # 더미 데이터 사진(CC0 — SOURCES.md)
└── frontend/            # React(Vite) — 수업에서 만든다
```

## 시작하기

### 1. 내 저장소 만들기

1. 이 저장소 오른쪽 위의 **Use this template** → **Create a new repository**를 누릅니다.
2. 저장소 이름은 `instagram`, 공개 범위는 **Private**으로 만듭니다.

### 2. 내려받기 · 설치

```bash
git clone https://github.com/내아이디/instagram.git
cd instagram
code .
```

VS Code 터미널에서:

```bash
cd backend
uv sync
```

### 3. `.env` 만들기

`backend`에서:

```bash
cp .env.example .env
uv run python -c "import secrets; print(secrets.token_hex(32))"
```

VS Code에서 `backend/.env`를 열어 두 줄을 채우고 저장합니다.

```
DB_URL=postgresql+psycopg://sd4:sd4@localhost:5432/instagram
SECRET_KEY=위에서_나온_64글자
```

### 4. DB 만들기

```bash
psql -d postgres     # macOS
psql -U postgres     # Windows
```

```sql
CREATE DATABASE instagram OWNER sd4;
\q
```

### 5. 테이블과 더미 데이터

`backend`에서:

```bash
uv run alembic upgrade head
uv run python seed.py
```

`시드 완료: 사용자 3 · 글 8(사진 6) · 댓글 6 · 좋아요 7 (비밀번호 모두 pw1234)`이 나오면 됩니다. 사용자는 `alice`, `bob`, `carol`입니다. `seed.py`는 다시 돌리면 처음 상태로 돌아갑니다.

### 6. 실행 · 테스트

`backend`에서:

```bash
uv run fastapi dev
```

http://localhost:8000/docs 에 주소 목록이 보이면 됩니다. 새 터미널에서 `backend`로 가서:

```bash
uv run pytest
```

## Frontend

### 1. 프로젝트 생성
```
npm create vite@latest frontend -- --template react --no-interactive
```

### 2. 라이브러리 설치
```
npm install
npm install react-router
npm install bootstrap bootstrap-icons
```

### 3. 컴포넌트와 state 구조

분홍색은 로그인 정보를 공유하는 `AuthProvider`, 초록색은 `App`, 회색은 컴포넌트, 파란색은 state(기억하는 값), 주황색은 함수입니다.

```mermaid
flowchart TB
    subgraph Provider["AuthProvider — 로그인 정보를 나눠줌"]
        direction TB
        Token["token"]:::state
        AuthFunctions["login() / logout()"]:::fn

        subgraph App["App"]
            direction TB

            subgraph Navbar["Navbar — 모든 화면에 표시"]
                NavAuth["useAuth()"]:::fn
            end

            subgraph PostList["PostList — /"]
                Posts["posts"]:::state
                ListCard["PostCard × N"]:::component
                Posts -->|"각 게시물을 props로 전달"| ListCard
            end

            subgraph PostDetail["PostDetail — /posts/:id"]
                DetailState["post / comments / error"]:::state
                DetailCard["PostCard"]:::component
                Comments["CommentItem × N"]:::component
                DetailState -->|"post를 props로 전달"| DetailCard
                DetailState -->|"각 댓글을 props로 전달"| Comments
            end

            subgraph Login["Login — /login"]
                LoginState["username / password / error"]:::state
                LoginAuth["useAuth()"]:::fn
            end
        end
    end

    classDef state fill:#193b50,stroke:#38bdf8,color:#fff
    classDef fn fill:#503316,stroke:#f59e0b,color:#fff
    classDef component fill:#171c24,stroke:#64748b,color:#fff
    style Provider fill:#482235,stroke:#ec4899,color:#fff
    style App fill:#263f19,stroke:#84cc16,color:#fff
    style Navbar fill:#171c24,stroke:#64748b,color:#fff
    style PostList fill:#171c24,stroke:#64748b,color:#fff
    style PostDetail fill:#171c24,stroke:#64748b,color:#fff
    style Login fill:#171c24,stroke:#64748b,color:#fff
```

- **AuthProvider**는 `token`을 기억하고, `token`, `login`, `logout`을 하위 컴포넌트에 공유합니다.
- **useAuth()**는 공유된 값을 꺼내 쓰는 함수입니다. `Login`은 `login()`을 호출하고, `Navbar`는 `token`으로 로그인 여부를 표시하며 `logout()`을 호출합니다.
- **각 화면의 state**는 해당 컴포넌트가 관리합니다. `PostList`와 `PostDetail`은 게시물·댓글 데이터를 자식 컴포넌트에 props로 전달합니다.
- **화면 전환**: `Navbar`는 공통으로 보이고, `PostList`, `PostDetail`, `Login` 중 현재 URL에 맞는 화면 하나가 표시됩니다. 그림은 전체 구조를 보여줍니다.

로그인할 때는 `Login → login() → api() → 백엔드` 순서로 요청합니다. 백엔드가 돌려준 토큰은 `AuthProvider`의 state와 `localStorage`에 저장합니다. state는 현재 화면을 갱신하는 데 쓰고, `localStorage`는 새로고침 후 토큰을 다시 읽는 데 씁니다. 로그아웃할 때는 둘 다 비웁니다.

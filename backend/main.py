from fastapi import FastAPI
from routers import posts, auth, likes, comments, uploads
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],  # 이 주소의 프론트가 API 응답을 읽도록 허용
    allow_headers=['Authorization'],  # 요청 헤더에 액세스 토큰을 담아 보내도록 허용
    allow_credentials=True,  # 쿠키 등 인증 정보를 포함한 요청 허용
    allow_methods=['*'],  # GET, POST, DELETE 등 모든 HTTP 메서드 허용
)

app.include_router(posts.router)
app.include_router(auth.router)
app.include_router(likes.router)
app.include_router(comments.router)
app.include_router(uploads.router)

app.mount('/media', StaticFiles(directory='media'))

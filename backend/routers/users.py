from fastapi import APIRouter, HTTPException, Depends
from deps import SessionDep
from sqlalchemy import select
from models import User, Post
from typing import Annotated
from schemas import ProfileOut


router = APIRouter(prefix='/api/users', tags=['users'])


def get_user_or_404(username: str, db: SessionDep):
    user = db.scalar(select(User).where(User.username == username))
    if user is None:
        raise HTTPException(status_code=404, detail='존재하지 않는 사용자')
    return user

UserDep = Annotated[User, Depends(get_user_or_404)]


@router.get('/{username}')
def profile(user: UserDep):
    return user


@router.get('/{username}/posts')
def user_posts(user: UserDep, db: SessionDep):
    return db.scalars(select(Post).where(Post.user_id == user.id)).all()
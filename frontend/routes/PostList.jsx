import { api } from "../src/api.js"
import { useState, useEffect, useRef } from "react"
// import { Link } from 'react-router' // 이전 로그인 안내에서 사용
import PostCard from "../components/PostCard.jsx"
import { useAuth } from '../hooks/useAuth.jsx' // 로그인 확인은 RequireLogin에서 처리

function PostList({ path }) {

    // 게시물을 저장할 state 생성
    const [posts, setPosts] = useState([])
    const [hasMore, setHasMore] = useState(true)

    // const bottom = document.querySelector('p')
    const bottom = useRef(null)

    // const { token } = useAuth() // 이전 방식에서 사용
    const { authApi } = useAuth()

    // 이 컴포넌트가 생성될 때 외부에서 데이터 가져오기
    useEffect(() => {
        async function load() {
            const first = await authApi(path, {})
            setPosts(first)
            setHasMore(first.length === 10)
        }
        load()
    }, [path])


    // 맨 아래칸이 화면에 들어오면 다음 10개 호출(loadMore)
    useEffect(() => { 
        const observer = new IntersectionObserver((entries) => {  
            if (entries[0].isIntersecting) {
                loadMore()
            }
        })
        if (bottom.current) {
            observer.observe(bottom.current)
        }

        // 다음 useEffect를 시작하기 전에 반환된 함수 실행
        return () => observer.disconnect()
    }, [posts])



    async function loadMore() {
        const next = await authApi(`${path}?skip=${posts.length}`, {})    
        setPosts([...posts, ...next])
        setHasMore(next.length === 10)
    }


    function handleUpdate(updated) {
        // const newPosts = posts.map((post) => {  
        //     if (post.id == updated.id){
        //         return updated
        //     }
        //     return post
        // })
        // setPosts(newPosts)
        setPosts(posts.map(post => post.id === updated.id ? updated : post))
    }


    // 이전 방식: PostList 안에서 로그인 여부에 따라 화면을 나눴다.
    // 현재는 App의 RequireLogin이 먼저 확인하므로 게시글 목록만 표시한다.
    // return (
    //     <>
    //         { token ?
    //             <>
    //                 <h2>전체 게시물</h2>
    //                 { posts.length === 0 && <p>불러오는 중</p> }
    //
    //                 <div>
    //                     { posts.map(post => (
    //                         // <article key={ post.id }>
    //                         //     <h3>{ post.user.username }</h3>
    //                         //     <p>{ post.content }</p>
    //                         //     <p>좋아요 { post.likes.length }개</p>
    //                         //     <p>{ new Date(post.created_at).toLocaleString('ko-KR') }</p>
    //                         //     <img src={ `${SERVER_URL}${post.image_url}` } />
    //                         // </article>
    //
    //                         // {...post}는 post의 각 속성을 같은 이름의 props로 전달한다.
    //                         // <PostCard
    //                         //     key={post.id}
    //                         //     id={post.id}
    //                         //     content={post.content}
    //                         //     created_at={post.created_at}
    //                         //     user={post.user}
    //                         //     likes={post.likes}
    //                         //     image_url={post.image_url}
    //                         // />
    //                         <PostCard key={ post.id } {...post}/>
    //                     )) }
    //                 </div>
    //             </>
    //         :
    //             <>
    //                 <p>글을 보기 위해서는 로그인이 필요합니다. </p>
    //                 <Link className="btn btn-sm btn-outline-secondary" to="/login">login</Link>
    //             </>
    //         }
    //
    //     </>
    // )

    return (
        <>
            <h2>전체 게시물</h2>
            {posts.length === 0 && <p>불러오는 중</p>}

            <div>
                {posts.map(post => (
                    <PostCard key={post.id} {...post} onUpdate={ handleUpdate }/>
                ))}
            </div>
            { hasMore && (
                <div className="text-center">
                    {/* <button className="btn btn-outline-secondary" onClick={ loadMore }>더보기</button> */}
                    <p ref={ bottom }>불러오는 중...</p>
                </div>
            ) }
        </>
    )
}

export default PostList

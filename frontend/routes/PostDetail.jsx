import { useParams } from "react-router"
import { useState, useEffect } from "react"
import { api } from '../src/api.js'
import PostCard from "../components/PostCard.jsx"
import CommentItem from "../components/CommentItem.jsx"


function PostDetail() {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])

    // () => { ... }: 실행할 작업, [id]: 변경을 확인할 값(의존성)
    // 처음 화면에 나타난 뒤 실행하고, id가 바뀌면 해당 게시글을 다시 가져온다.
    useEffect(() => {  
        async function load() {
            setPost(await api(`/api/posts/${id}`))
            setComments(await api(`/api/posts/${id}/comments`))
        }
        load()
    }, [id])

    if (!post) return <p>불러오는 중...</p>

    return (
        <>
            <PostCard {...post} />
            <h3>댓글</h3>
            <ul className="list-group">
                { comments.map(c => (
                    <CommentItem key={ c.id } {...c} />
                )) }
            </ul>
        </>
    )
}

export default PostDetail
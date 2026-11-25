import { useParams } from "react-router"
import { useState, useEffect } from "react"
import { api } from '../src/api.js'
import PostCard from "../components/PostCard.jsx"
import CommentItem from "../components/CommentItem.jsx"
import CommentForm from "../components/CommentForm.jsx"


function PostDetail() {
    const { id } = useParams()
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [error, setError] = useState('')

    // () => { ... }: 실행할 작업, [id]: 변경을 확인할 값(의존성)
    // 처음 화면에 나타난 뒤 실행하고, id가 바뀌면 해당 게시글을 다시 가져온다.
    useEffect(() => {  
        async function load() {
            try {
                setPost(await api(`/api/posts/${id}`))
                setComments(await api(`/api/posts/${id}/comments`))
            } catch (e) { 
                setError(e.message)
            }
        }
        load()
    }, [id])

    function handleCreate(created) {
        setComments([...comments, created])        
    }

    function handleDelete(commentId) {
        setComments(comments.filter(c => c.id !== commentId))
    }

    function handleUpdate(updated) {
        setComments(comments.map(c => {
            if (c.id === updated.id) {
                return updated
            }
            return c
        }))
    }

    if (error) return <p className="text-danger">{ error }</p>
    if (!post) return <p>불러오는 중...</p>

    return (
        <>
            <PostCard {...post} onUpdate={setPost} />
            <h3>댓글</h3>
            <ul className="list-group">
                { comments.map(c => (
                    <CommentItem key={ c.id } {...c} onDelete = { handleDelete } onUpdate = { handleUpdate }/>
                )) }
            </ul>
            <CommentForm postId={ post.id } onCreate={ handleCreate } />
        </>
    )
}

export default PostDetail
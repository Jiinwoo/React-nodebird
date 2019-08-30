import React,{useEffect} from 'react'
import propTypes from 'prop-types'
import {useDispatch,useSelector } from 'react-redux';
import PostCard from '../components/PostCard';
import {LOAD_HASHTAG_POSTS_REQUEST} from '../reducers/post';
const Hashtag = ({tag})=>{
    
    const {mainPosts} = useSelector(state=>state.post);
    
    return (
        <div>
            {mainPosts.map(c=>(
                <PostCard key={+c.createdAt} post = {c}/>
            ))}
        </div>
    )
}

Hashtag.propTypes = {
    tag : propTypes.string.isRequired,
}

Hashtag.getInitialProps =  async (context) => {//   라이프 사이클 next가 넣어준

    const tag = context.query.tag;
    //가장 최초의 작업가능 
    //  서버의 데이터를 가져와서 
    //  서버사이드 렌더링 가능
    context.store.dispatch({
        type : LOAD_HASHTAG_POSTS_REQUEST,
        data : tag
    },[])
    return {tag : context.query.tag};
}
export default Hashtag;
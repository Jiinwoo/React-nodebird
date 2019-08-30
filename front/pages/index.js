import React, {useEffect} from 'react';
import {} from 'antd';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import {useSelector,useDispatch} from 'react-redux';
import {LOAD_MAIN_POSTS_REQUEST} from '../reducers/post'

const Home = ()=>{
    const {me} = useSelector(state=> state.user);
    const {mainPosts} = useSelector(state =>state.post);
    
    return (
        <div>
            
            {me && <PostForm/>}
            {mainPosts.map((c)=>{
                return (
                    <PostCard key={c} post={c} />
                )
            })}
        </div>
    );
};
Home.getInitialProps = async(context)=>{
    
    context.store.dispatch({
        type:LOAD_MAIN_POSTS_REQUEST,
    })
}
export default Home;
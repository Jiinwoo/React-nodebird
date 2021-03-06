import React,{useEffect,useCallback} from 'react'
import PropTypes from 'prop-types';
import {useDispatch,useSelector } from 'react-redux';
import {Card,Avatar} from 'antd';
import PostCard from '../components/PostCard'
import {LOAD_USER_POSTS_REQUEST} from '../reducers/post';
import { LOAD_USER_REQUEST } from '../reducers/user';
const User = ({id})=>{
    const dispatch = useDispatch();
    const {mainPosts,hasMorePost} = useSelector(state=>state.post);
    const {userInfo} =useSelector(state=>state.user);
    const onScroll = useCallback(() => {
        if (window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
            if(hasMorePost){
                dispatch({
                    type: LOAD_USER_POSTS_REQUEST,
                    lastId : mainPosts[mainPosts.length -1 ].id,
                    data : id
                    }); 
            }
            
        }
      }, [ hasMorePost,mainPosts.length]);
    useEffect(() => {
        window.addEventListener('scroll', onScroll);
        return () => {
          window.removeEventListener('scroll', onScroll);
        };
      }, [mainPosts.length]);
    return (
        <div>
            {userInfo? <Card actions={[
                            <div key="twit">쨱짹<br/>{userInfo.Posts}</div>,
                            <div key="following">팔로잉<br/>{userInfo.Followings}</div>,
                            <div key="follower">팔로워<br/>{userInfo.Followers}</div>,
                        ]}>
                            <Card.Meta 
                            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
                            title={userInfo.nickname}
                            />
                            </Card>
                : null}
            {mainPosts.map(c=>(
                <PostCard key={+c.createdAt} post = {c}/>
            ))}
        </div>
    )
}

User.propTypes = {
    id : PropTypes.number.isRequired,
}

User.getInitialProps =  async (context) => {//   라이프 사이클 next가 넣어준
    const id = parseInt(context.query.id,10);
    context.store.dispatch({
        type : LOAD_USER_REQUEST,
        data : id,
    })
    context.store.dispatch({
        type : LOAD_USER_POSTS_REQUEST,
        data : id,
    })
    //가장 최초의 작업가능 
    //  서버의 데이터를 가져와서 
    //  서버사이드 렌더링 가능
    //  console.log('user getInitialProps',context.query.id);
    return {id : parseInt(context.query.id,10)}
}
export default User;
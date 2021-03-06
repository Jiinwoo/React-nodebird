import React, { useState, useCallback, useEffect, memo } from 'react';
import {
  Card,
  Icon,
  Avatar,
  Button,
  Input,
  List,
  Form,
  Comment,
  Popover,
} from 'antd';
import styled from 'styled-components';
import moment from 'moment';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import PostImages from './PostImages';
import PostCardContent from './PostCardContent';
import CommentForm from './CommentForm';
import {
  ADD_COMMENT_REQUEST,
  LOAD_COMMENTS_REQUEST,
  UNLIKE_POST_REQUEST,
  LIKE_POST_REQUEST,
  RETWEET_REQUEST,
  REMOVE_POST_REQUEST,
} from '../reducers/post';
import { UNFOLLOW_USER_REQUEST, FOLLOW_USER_REQUEST } from '../reducers/user';
import FollowButton from './FollowButton';

moment.locale('ko');
const CardWrapper = styled.div`
  margin-botton: 20px;
`;
const PostCard = memo(({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const { me } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const liked = me && post.Likers && post.Likers.find((v) => v.id === me.id);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id,
      });
    }
  }, []);

  const onToggleLike = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다!');
    }
    if (liked) {
      // 좋아요 누른 상태
      dispatch({
        type: UNLIKE_POST_REQUEST,
        data: post.id,
      });
    } else {
      // 좋아요 안 누른 상태
      dispatch({
        type: LIKE_POST_REQUEST,
        data: post.id,
      });
    }
  }, [me && me.id, post && post.id, liked]);

  const onRetweet = useCallback(() => {
    if (!me) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [me && me.id, post.id]);

  const onFollow = useCallback(
    (userId) => () => {
      dispatch({
        type: FOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    [],
  );

  const onUnfollow = useCallback(
    (userId) => () => {
      dispatch({
        type: UNFOLLOW_USER_REQUEST,
        data: userId,
      });
    },
    [],
  );
  const onRemovePost = useCallback((userId) => () => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: userId,
    });
  });
  return (
    <CardWrapper>
      <Card
        cover={
          post.Images && post.Images[0] && <PostImages images={post.Images} />
        }
        actions={[
          <Icon type="retweet" key="retweet" onClick={onRetweet} />,
          <Icon
            type="heart"
            key="heart"
            theme={liked ? 'twoTone' : 'outlined'}
            twoToneColor="#eb2f96"
            onClick={onToggleLike}
          />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Popover
            key="ellipsis"
            content={
              <Button.Group>
                {me && post.UserId === me.id ? (
                  <>
                    <Button>수정</Button>
                    <Button type="danger" onClick={onRemovePost(post.id)}>
                      삭제
                    </Button>
                  </>
                ) : (
                  <Button>신고</Button>
                )}
              </Button.Group>
            }
          >
            <Icon type="ellipsis" />
          </Popover>,
        ]}
        title={
          post.RetweetId ? `${post.User.nickname}님이 리트윗 하셨습니다.` : null
        }
        extra={
          <FollowButton me={me} post={post} onFollow={onFollow} onUnfollow={onUnfollow}/>
        }
      >
        {post.RetweetId && post.Retweet ? (
          <Card
            cover={
              post.Retweet.Images[0] && (
                <PostImages images={post.Retweet.Images} />
              )
            }
          >
            <Card.Meta
              avatar={
                <Link
                  href={{
                    pathname: '/user',
                    query: { id: post.Retweet.User.id },
                  }}
                  as={`/user/${post.Retweet.User.id}`}
                >
                  <a>
                    <Avatar>{post.User.nickname[0]}</Avatar>
                  </a>
                </Link>
              }
              title={post.Retweet.User.nickname}
              description={<PostCardContent postData={post.Retweet.content} />} //   a tag 대신 - >Link 태그로 변경
            />
            {moment(post.createdAt).format('YYYY.MM.DD')}
          </Card>
        ) : (
          <Card.Meta
            avatar={
              <Link
                href={{ pathname: '/user', query: { id: post.User.id } }}
                as={`/user/${post.User.id}`}
              >
                <a>
                  <Avatar>{post.User.nickname[0]}</Avatar>
                </a>
              </Link>
            }
            title={post.User.nickname}
            description={<PostCardContent postData={post.content} />} // a tag x -> Link
          />
        )}

        {commentFormOpened && (
          <>
            <CommentForm post={post} />
            <List
              header={`${post.Comments ? post.Comments.length : 0} 댓글`}
              itemLayout="horizontal"
              dataSource={post.Comments || []}
              renderItem={(item) => (
                <li>
                  <Comment
                    author={item.User.nickname}
                    avatar={
                      <Link
                        href={{
                          pathname: '/user',
                          query: { id: item.User.id },
                        }}
                        as={`/user/${item.User.id}`}
                      >
                        <a>
                          <Avatar>{item.User.nickname[0]}</Avatar>
                        </a>
                      </Link>
                    }
                    content={item.content}
                  />
                </li>
              )}
            />
          </>
        )}
      </Card>
    </CardWrapper>
  );
});
PostCard.propTypes = {
  post: PropTypes.shape({
    User: PropTypes.object,
    content: PropTypes.string,
    img: PropTypes.string,
    createdAt: PropTypes.string,
  }),
};
export default PostCard;

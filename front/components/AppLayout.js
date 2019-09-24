import React, { useEffect } from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { Menu, Input, Row, Col } from 'antd';
import LoginForm from './LoginForm';
import UserProfile from '../components/UserProfile';
import { useSelector, useDispatch } from 'react-redux';
import { LOAD_USER_REQUEST } from '../reducers/user';
import Chat from '../components/Chat';

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  const onSearch = (value) => {
    Router.push(
      { pathname: '/hashtag', query: { tag: value } },
      `/hashtag/${value}`,
    );
  };
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link href="/">
            <a>노드 버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile" prefetch>
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="game">
          <Link href="/game" prefetch>
            <a>게임</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="mail">
          <Input.Search
            enterButton
            style={{ verticalAlign: 'middle' }}
            onSearch={onSearch}
          />
        </Menu.Item>
      </Menu>

      {/* xs는 모바일 sm은 작은 화면 md 는 중간화면 lg 큰화면 */}
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <Chat />
        </Col>
      </Row>
    </div>
  );
};
AppLayout.propTypes = {
  children: PropTypes.node,
};
export default AppLayout;

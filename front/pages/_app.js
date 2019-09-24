/* eslint-disable arrow-body-style */
//  root

import React from 'react';
import propTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import withReduxSage from 'next-redux-saga';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose } from 'redux';
import { Container } from 'next/app';
import AppLayout from '../components/AppLayout';
import reducer from '../reducers';
import rootSaga from '../sagas/index';
import { LOAD_USER_REQUEST } from '../reducers/user';
import Axios from 'axios';
import Helmet from 'react-helmet';

const NodeBird = ({ Component, store, pageProps }) => {
  return (
    <Container>
      <Provider store={store}>
        <Helmet
          title="NodeBird"
          htmlAttributes={{ lang: 'ko' }}
          meta={[
            {
              charset: 'UTF-8',
            },
            {
              name: 'viewport',
              content:
                'width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=yes,viewport-fit=cover',
            },
            {
              'http-equiv': 'X-UA-Compatible',
              content: 'IE=edge',
            },
            {
              name: 'description',
              content: '제로초의 NodeBird SNS',
            },
            {
              name: 'og:title',
              content: 'NodeBird',
            },
            {
              name: 'og:description',
              content: '제로초의 NodeBird SNS',
            },
            {
              property: 'og:type',
              content: 'website',
            },
          ]}
          link={[
            {
              rel: 'shortcut icon',
              href: '/favicon.ico',
            },
            {
              rel: 'stylesheet',
              href:
                'https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css',
            },
            {
              rel: 'stylesheet',
              href:
                'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css',
            },
            {
              rel: 'stylesheet',
              href:
                'https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css',
            },
          ]}
        />

        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </Provider>
    </Container>
  );
};
NodeBird.propTypes = {
  Component: propTypes.elementType.isRequired, // jsx 에 들어갈수 있는 전부
  store: propTypes.object.isRequired,
  pageProps: propTypes.object.isRequired,
};

NodeBird.getInitialProps = async (context) => {
  // next에서 context 넣어줌

  const { ctx } = context;
  let pageProps = {};
  if (context.Component.getInitialProps) {
    pageProps = (await context.Component.getInitialProps(ctx)) || {};
  }
  const state = ctx.store.getState();
  Axios.defaults.headers.Cookie = '';
  const cookie = ctx.isServer ? ctx.req.headers.cookie : '';
  if (ctx.isServer && cookie) {
    Axios.defaults.headers.Cookie = cookie;
  }
  //
  if (!state.user.me) {
    ctx.store.dispatch({
      type: LOAD_USER_REQUEST,
    });
  }

  return { pageProps };
};
const configureStore = (initialState, options) => {
  //  여기에다가 store 커스터마이징
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = [sagaMiddleware];
  const enhancer =
    process.env.NODE_ENV === 'production'
      ? compose(applyMiddleware(...middlewares))
      : compose(
          applyMiddleware(...middlewares),
          !options.isServer &&
            window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined'
            ? window.__REDUX_DEVTOOLS_EXTENSION__()
            : (f) => f,
        );
  const store = createStore(reducer, initialState, enhancer);

  store.sagaTask = sagaMiddleware.run(rootSaga);
  return store;
};
export default withRedux(configureStore)(withReduxSage(NodeBird));

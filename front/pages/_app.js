/* eslint-disable arrow-body-style */
//  root

import React from 'react';
import Head from 'next/head';
import propTypes from 'prop-types';
import withRedux from 'next-redux-wrapper';
import withReduxSage from 'next-redux-saga';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose } from 'redux';

import AppLayout from '../components/AppLayout';
import reducer from '../reducers';
import rootSaga from '../sagas/index';
import {LOAD_USER_REQUEST} from '../reducers/user'
import Axios from 'axios';

const NodeBird = ({ Component, store,pageProps }) => {
    return (
      <Provider store={store}>
        <Head>
          <title>NodeBird</title>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.17.0/antd.css" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/3.17.0/antd.js" />
          <link rel="stylesheet" type="text/css" charSet="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
          <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" />
        </Head>
        <AppLayout>
          <Component {...pageProps} />
        </AppLayout>
      </Provider>
    );
};
NodeBird.propTypes = {
    Component: propTypes.elementType.isRequired, // jsx 에 들어갈수 있는 전부
    store: propTypes.object.isRequired,
    pageProps : propTypes.object.isRequired,
};

NodeBird.getInitialProps = async (context)=>{// next에서 context 넣어줌
  
  const{ ctx } = context;
  let pageProps = {};
  if(context.Component.getInitialProps){
    pageProps = await context.Component.getInitialProps(ctx);
  }
  const state = ctx.store.getState();
  const cookie = ctx.isServer? ctx.req.headers.cookie : '';
  if(ctx.isServer && cookie){
    Axios.defaults.headers.Cookie = cookie;
  }
  //
  if(!state.user.me){
    ctx.store.dispatch({
      type : LOAD_USER_REQUEST
    })
  }
  
  return {pageProps};
}
const configureStore = (initialState, options) => {
    //  여기에다가 store 커스터마이징
    const sagaMiddleware = createSagaMiddleware();
    const middlewares = [sagaMiddleware];
    const enhancer = process.env.NODE_ENV === 'production'
    ? compose(applyMiddleware(...middlewares))
    : compose(applyMiddleware(...middlewares),
    !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : f => f , );
    const store = createStore(reducer, initialState, enhancer);
    
    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store;
};
export default withRedux(configureStore)(withReduxSage(NodeBird));

import React from 'react';
import { connect } from 'react-redux';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import Root from './components/Root';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import MapTest from './components/Map';

import Editor from './components/Editor';
import ViewStory from './components/ViewStory';

/* -----------------    COMPONENT     ------------------ */

const Routes = (props) => (
  <Router history={browserHistory}>
    <Route path="/" component={Root} >
      <IndexRoute component={Home} />
      <Route path="login" component={Login} />
      <Route path="signup" component={Signup} />
      <Route path="stories/fakeStory" component={ViewStory} onEnter={props.onFakeStoryEnter} />
      <Route path="stories/:storyId" component={ViewStory} onEnter={props.onRealStoryEnter} />
      <Route path="editor" component={Editor} />
      <Route path="maptest" component={MapTest} />
      <Route path="*" component={Home} />
    </Route>
  </Router>
);

/* -----------------    CONTAINER     ------------------ */

import { setFakeState, fetchStory, fetchMap } from './reducers/displayState';

const mapProps = null;

const mapDispatch = dispatch => ({
  onFakeStoryEnter: () => {
    dispatch(setFakeState());
  },
  onRealStoryEnter: (nextRouterState) => {
    const storyId = nextRouterState.params.storyId;
    dispatch(fetchStory(storyId));
  }
});

export default connect(mapProps, mapDispatch)(Routes);

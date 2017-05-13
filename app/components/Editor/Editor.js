import React, { Component } from 'react';

import EditorScene from './EditorScene';
import EditorScenesMenuItem from './EditorScenesMenuItem';
import EditorActors from './EditorActors';
import EditorMaps from './EditorMaps';
import EditorHero from './EditorHero';

/* ----- COMPONENT ----- */

class Editor extends Component {
  render() {
    return (
      <div id="storyEditor" className="container">

        <div id="title-row">

          <button
            className="btn btn-success"
            id="publish-btn"
            onClick={this.props.onSubmitStory}
          >
            Publish Story  <span className="glyphicon glyphicon-share"></span>
          </button>


          <input
            name="storyTitle"
            id="story-title-input"
            className="title-font"
            type="text"
            placeholder="Title your story"
            onChange={this.props.onStoryTitleChange}
            value={this.props.storyTitle}
          />

        </div>

        <div id={`editorscene-wrapper-${this.props.whichScene}`} className="editorscene-wrapper">

          <div className="editorscene-content-wrapper">

            <div id="editor-scenes-menu">

              <div id="editor-scenes-menu-label">
                <h4>Scenes</h4>
              </div>

              <div id="editor-scenes-menu-items-container">
                {
                  this.props.scenes && this.props.scenes.map((scene, index) => (
                    <EditorScenesMenuItem
                      position={index}
                      key={index}
                      sceneTitle={scene.title}
                      whichModule={scene.whichModule}
                    />
                  ))
                }
              </div>

              <div id="editor-scenes-menu-add">
                <button
                  className="btn btn-success titlerow-button"
                  onClick={this.props.onAddScene}
                >
                  Add Scene <span className="glyphicon glyphicon-plus"></span>
                </button>
              </div>

            </div>

            <EditorScene
              whichScene={this.props.whichScene}
              whichModule={this.props.whichModule}
            />

          </div>

          <div className="editorscene-sidebar-wrapper">
            {
              this.props.whichModule === 'maps'
                ? <EditorMaps position={this.props.whichScene} />
                : this.props.whichModule === 'actors'
                  ? <EditorActors position={this.props.whichScene} />
                  : this.props.whichModule === 'hero'
                    ? <EditorHero position={this.props.whichScene} />
                    : null
            }
          </div>

        </div>

      </div>
    );
  }
}

/* ----- CONTAINER ----- */

import { connect } from 'react-redux';
import { addScene, changeStoryTitle, submitStory } from '../../reducers/editor';
import store from '../../store';
import $ from 'jquery';

const mapStateToProps = state => ({
  editor: state.editor,
  storyTitle: state.editor.title,
  user: state.auth,
  scenes: state.editor.scenes,
  whichScene: state.editor.whichScene,
  whichModule: state.editor.scenes[state.editor.whichScene].whichModule
});

const mapDispatchToProps = dispatch => ({
  onAddScene(event) {
    event.preventDefault();
    $('.editorscene-wrapper').removeClass('toggled');
    dispatch(addScene());
  },
  onStoryTitleChange(event) {
    event.preventDefault();
    dispatch(changeStoryTitle(event.target.value));
  },
  onSubmitStory(user, event) {
    event.preventDefault();
    if (!store.getState().editor.title) {
      return alert('Please enter a title for your story.');
    }
    dispatch(submitStory());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Editor);

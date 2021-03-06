import React from 'react';
import SidePane from '../side-pane/side-pane'
import './app.css'
import MainPane from '../main-pane/main-pane';
import SecondaryPane from '../secondary-pane/secondary-pane';
import StatusBar from '../status-bar/status-bar';
import Dialog from '../dialog/dialog';
import CreateNewRequestDialog from '../dialog/createNewRequestDialog';

function resize(e) {
  e.preventDefault();
  window.addEventListener('mousemove', e.target.id === "resizer-right" ? changeWidthRight : changeWidthLeft)
  window.addEventListener('mouseup', e.target.id === "resizer-right" ? stopResizeRight : stopResizeLeft)
}

function changeWidthRight(e) {
  var target = document.getElementsByClassName("side-pane")[0];
  var width = e.pageX - target.getBoundingClientRect().left + 'px';
  target.style.width = width;
}

function changeWidthLeft(e) {
  var target = document.getElementsByClassName("secondary-pane")[0];
  var width = target.getBoundingClientRect().right - e.pageX + 'px';
  target.style.width = width;
}

function stopResizeRight(e) {
  window.removeEventListener('mousemove', changeWidthRight)
}

function stopResizeLeft(e) {
  window.removeEventListener('mousemove', changeWidthLeft)
}

class App extends React.Component {

  colors = {
    "GET": "#ac84d1 ",
    "POST": "#77a7a2    ",
    "PUT": "#d37769    ",
    "PATCH": "#FEBF2D",
    "DELETE": "#c65568",
    "OPTIONS": "#B36DDD",
    "HEAD": "#5856A4",
  }

  constructor() {
    super();
    this.state = {
      stylePath: 'default.css',
      selectedTabIndex: 0,
      showNewRequestDialog: false,
      requests: [{
        title: "My Request",
        method: "GET",
      }]

    }

    this.setResponse = this.setResponse.bind(this)
    this.setData = this.setData.bind(this)
    this.addNewRequest = this.addNewRequest.bind(this)

    this.showNewRequestDialog = this.showNewRequestDialog.bind(this)
    this.closeNewRequestDialog = this.closeNewRequestDialog.bind(this)
    this.setSelectedTabIndex = this.setSelectedTabIndex.bind(this)
    this.setRequestMethod = this.setRequestMethod.bind(this)
  }

  setSelectedTabIndex(index) {
    this.setState({ selectedTabIndex: index })
  }

  // -------------------- request changes -----------------------------------

  setResponse(res) {
    this.setState(oldState => {
      var requests = oldState.requests
      requests[oldState.selectedTabIndex].response = res
      return { requests: requests }
    })
  }


  setRequestMethod(m) {
    this.setState(oldState => {
      var requests = oldState.requests
      requests[oldState.selectedTabIndex].method = m
      return { requests: requests }
    })
  }

  setData(res) {
    this.setState(oldState => {
      var requests = oldState.requests
      requests[oldState.selectedTabIndex].data = res
      return { requests: requests }
    })
  }

  addNewRequest(title, method) {
    console.log("new request call recieved")
    this.setState((oldState) => ({
      requests: [...oldState.requests, {
        title: title,
        method: method
      }]
    }))

  }

  // ----------------------------------------------------------------------------------


  showNewRequestDialog() {
    this.setState({ showNewRequestDialog: true })
  }

  closeNewRequestDialog() {
    this.setState({ showNewRequestDialog: false })
  }

  render() {
    return (
      <div className="main">
        <div className="pane-container">
          <link rel="stylesheet" type="text/css" href={this.state.stylePath} />
          <SidePane
            showNewRequestDialog={this.showNewRequestDialog}
            resizeHandler={resize}
            colors={this.colors}
            setSelectedTabIndex={this.setSelectedTabIndex}
            selectedPos={this.state.selectedTabIndex}
            requests={this.state.requests} />

          <MainPane
            colors={this.colors}
            setResponse={this.setResponse}
            setRequestMethod={this.setRequestMethod}
            setData={this.setData}
            response={this.state.requests[this.state.selectedTabIndex].response}
            data={this.state} />

          <SecondaryPane
            response={this.state.requests[this.state.selectedTabIndex].response}
            resizeHandler={resize} />

        </div>
        <StatusBar />
        {this.state.showNewRequestDialog ?
          <CreateNewRequestDialog colors={this.colors}
            addNewRequest={this.addNewRequest}
            closeDialog={this.closeNewRequestDialog} />
          : <div></div>}
      </div>
    );
  }
}

export default App;

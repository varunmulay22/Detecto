import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Rank from './components/Rank/Rank';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Particles from 'react-particles-js';
import './App.css';


const particlesOptions = {
  particles: {
    number:{
      value: 150,
      density:{
        enable: true,
        value_area: 600
      }
    }
  }
}

const initialState ={
      input: '',
      imageUrl: '',
      box : {},
      routes: 'signin',
      isSignedIn: false,
      user:{
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
}

class App extends Component {
  constructor(){
    super();
    this.state =initialState;
  }

loadUser = (data) =>{
  this.setState({
    user:{
    id: data.id,
    name: data.name,
    email: data.email,
    entries: data.entries,
    joined: data.joined
    }})
  }

  calculateFaceBox = (data) =>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width =Number(image.width);
    const height =Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width -(clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) =>{
    console.log(box);
    this.setState({box: box});
  }
  onInputChange = (event) =>{
    this.setState({input: event.target.value});
  }
  
  onButtonSubmit = () =>{
    this.setState({imageUrl: this.state.input});
    fetch('https://pacific-bayou-42692.herokuapp.com/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            input: this.state.input
            })
          })
    .then(response => response.json())
    .then(response =>{
        if(response){
          fetch('https://pacific-bayou-42692.herokuapp.com/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
            id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}))
          })
        }
        this.displayFaceBox(this.calculateFaceBox(response))
    })
    .catch(err => console.log(err));
  }

  onRouteChange = (routes) =>{
    if(routes === 'signin'){
      this.setState(initialState);
    }
    else if (routes === 'home'){
      this.setState({isSignedIn:true});
    }
    this.setState({routes : routes});
  }

  render() {
    const {isSignedIn, imageUrl, box, routes} = this.state;
    return (
      <div className = "App">
        <Particles className= 'particles'
          params = {particlesOptions}
          />
        <Navigation isSignedIn = {isSignedIn} onRouteChange = {this.onRouteChange}/>
        {routes === 'home'
          ?<div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm 
              onInputChange={this.onInputChange}
              onButtonSubmit ={this.onButtonSubmit}
                />
            <FaceRecognition box = {box} imageUrl = {imageUrl}/>
          </div>
          :(
            routes === 'signin'
            ?<SignIn loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/>
            :<Register loadUser = {this.loadUser} onRouteChange = {this.onRouteChange}/> 
            )

        }
        
      </div>
    );
  }
}

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import './styles/styles.css';
import { Component } from 'react';
import Entrance from './pages/entrance';
import VideoRoom from './pages/video-room';


class App extends Component{
    constructor(props){
        super(props);

       this.state={
         entered:false,
         preferences:null
       }
      
    }



   toggleEntered = (preferences)=>{
       this.setState({entered:!this.state.entered,preferences:preferences});
   }


    
    render(){
        return(
            <div id="app-container">
                {!this.state.entered
                    ?
                    <Entrance toggleEntered={(preferences)=>this.toggleEntered(preferences)}/>
                    :
                    <VideoRoom preferences={this.state.preferences}/>
                }
            </div>
            
        )
    }
}


ReactDOM.render(<App/>,document.getElementById('root'))
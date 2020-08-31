import React from 'react';
import { Component } from 'react';
import "regenerator-runtime/runtime.js";
import axios from 'axios';
import io from "socket.io-client";
import v4 from "uuid";
import Peer from 'peerjs'
import "../styles/video-room.css"
import '@material/react-button/dist/button.css';
import Button from '@material/react-button';
import Loading from "react-spinners/ClipLoader";

var conn =  null;
var socket = null;
class VideoRoom extends Component{
    constructor(props){
        super(props);
        this.state={
            id:null,
            otherId:null,
            loading:false,
            isSearching:false,
        }
    }

   

     componentDidMount(){

        
       
        
    }
    
    setUpSockets = ()=>{
        this.setState({loading:true,isSearching:true},()=>{
            socket = io.connect(
                "http://localhost:3000/",
                {query:`native=${this.props.preferences.native}&target=${this.props.preferences.target}`}
            )
            socket.on('id',(id)=> {
               this.setState({id:id})
            });
             socket.on('otherId',(otherId)=> {
                this.setState({otherId:otherId});
             });
        })
    }

    disconnect = ()=>{
        socket.close();
        this.setState({loading:false,isSearching:false});
    }


    connect=()=>{

        var peer = new Peer(this.state.id,{
            host:'/',
            port:'3001'
        });
        peer.on('call',(call)=>{
            navigator.mediaDevices.getUserMedia({video:true}).then((stream)=>{
                call.answer(stream);
                call.on('stream',(remoteStream)=>{
                    var videoFrame = document.getElementById('video-frame');
                    videoFrame.srcObject = remoteStream;
                    videoFrame.play();
                });
            });
        })
        navigator.mediaDevices.getUserMedia({video:true}).then((stream)=>{
            const call = peer.call(this.state.otherId,stream);
            call.on('stream',remoteStream=>{
                console.log('here');
                this.setState({loading:false},()=>{
                    var videoFrame = document.getElementById('video-frame');
                    videoFrame.srcObject = remoteStream;
                    videoFrame.play();
                })
            })
        });
            
        conn = peer.connect(this.state.otherId);
    }



    
    render(){
        if(this.state.id && this.state.otherId){
            this.connect();
        }
        return(
            <div className="video-room">
                <div className="sidebar">

                    
                        {!this.state.isSearching ?
                            <Button
                                className="connect-button"
                                raised
                                onClick={this.setUpSockets}>
                                Search for friend!
                            </Button>
                            :
                            <Button
                                className="connect-button"
                                raised
                                onClick={this.disconnect}>
                                Stop
                            </Button>
                        }
                        
                   
                    
                    
                </div>
                    
                <div className="video-container">
                    
                    {!this.state.loading ?
                        <video  id="video-frame">
                            <source/>
                        </video>
                        :
                        <Loading size={150}/>
                    }
                </div>

                


                

                
                
            </div>
            
        )
    }
}


export default VideoRoom;
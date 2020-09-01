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
var peer = null;
class VideoRoom extends Component{
    constructor(props){
        super(props);
        this.state={
            id:null,
            otherId:null,
            loading:false,
            isSearching:false,
            videoAvailable:false
        }

        this.vidRef = React.createRef();
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
             socket.on('friend-disconnection',()=>{
                 alert('friend disconnected');
             })
        })
    }

    disconnect = ()=>{
        socket.close();
        peer.disconnect();
        this.setState({
            loading:false,
            isSearching:false,
            videoAvailable:true,
            id:null,
            otherId:null
        
        
        });
    }


    connect=()=>{
        peer = new Peer(this.state.id,{
            host:'/',
            port:'3001'
        });
        peer.on('call',(call)=>{
            navigator.mediaDevices.getUserMedia({video:true}).then((stream)=>{
                call.answer(stream);
                call.on('stream',(remoteStream)=>{
                    this.vidRef.current.srcObject = remoteStream;
                    this.vidRef.current.play();
                });
            });
        })
        navigator.mediaDevices.getUserMedia({video:true}).then((stream)=>{
            const call = peer.call(this.state.otherId,stream);
            console.log(call);
            try{
                call.on('stream',remoteStream=>{
                    this.setState({loading:false,videoAvailable:true},()=>{
                        this.vidRef.current.srcObject = remoteStream;
                        this.vidRef.current.play();
                    })
                })
            }
            catch(error){
                console.log(error);
            }
            
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
                        this.state.videoAvailable &&
                            <video ref={this.vidRef} id="video-frame">
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
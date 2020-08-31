import React from 'react';
import { Component } from 'react';
import "regenerator-runtime/runtime.js";
import axios from 'axios';
import io from "socket.io-client";
import v4 from "uuid";
import Peer from 'peerjs'



var conn =  null;

class Connection extends Component{
    constructor(props){
        super(props);
        this.state={
            id:null,
            otherId:null,
        }
    }

   

     componentDidMount(){

        
        const socket = io.connect(
            "http://localhost:3000/",
            {query:`native=${this.props.preferences.native}&target=${this.props.preferences.target}`}
        )
        socket.on('id',(id)=> {
           
            this.setState({id:id})
        });
         socket.on('otherId',(otherId)=> {
            
            this.setState({otherId:otherId});
         });
        
    }

    connect=()=>{

        var peer = new Peer(this.state.id,{
            host:'/',
            port:'3001'
        });
            peer.on('connection',conn=>{
                console.log('connection complete!');
                conn.on('data',(data)=>{
                    console.log(data);
                })
                conn.on('open',()=>{
                    conn.send('hello');
                })
            })
    
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
                    
                    var videoFrame = document.getElementById('video-frame');
                        videoFrame.srcObject = remoteStream;
                        videoFrame.play();
                })
            });
            
    
    
            conn = peer.connect(this.state.otherId);
    
            
            conn.on('open',(data)=>{
                console.log(data);
            })
    
        
       
        

       
    }



    
    render(){
     
        return(
            <div>
                <input   onClick={this.send} value={this.state.message} value={"send"} style={{display:"block"}} type="button"/>
                <p>Message sent: {this.state.messageReceived}</p>
                <input onClick={this.connect} value="connect" style={{display:"block"}} type="button"/>


                

                <video width="400px" height="400px" id="video-frame">
                    <source/>
                </video>
                
            </div>
            
        )
    }
}


export default Connection;
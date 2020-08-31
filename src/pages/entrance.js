import React from 'react';


import { Component } from 'react';
import "regenerator-runtime/runtime.js";
import { Select} from 'dropdown-select';
import 'dropdown-select/dist/css/dropdown-select.css';
import "../styles/entrance.css"


class Entrance extends Component{
    constructor(props){
        super(props);
        this.state={
            target:'',
            native:''
        }
    }


    submit = () =>{
        if(!!this.state.target && !!this.state.native && this.state.target != this.state.native){
           this.props.toggleEntered({target:this.state.target,native:this.state.native});
        }
    }

    render(){
        return(
            <div className="page">
                <div className="flexed-element form">

                    <h1>Sign Up </h1>
                    <Select
                        onChange={(value)=>{this.setState({target:value})}}
                        options={["Spanish","English"]}
                        name={this.state.target}
                        placeholder={"Target Language"}
                        className={"select-field"}
                    />
                    <Select
                        onChange={(value)=>{this.setState({native:value})}}
                        options={["Spanish","English"]}
                        values={["Spanish","English"]}
                        placeholder={"Native Language"}
                        className={"select-field"}
                    />
                    
                    <button onClick={this.submit}>Start Searching</button>
                </div>
                <div className="flexed-element form">



                </div>
            </div>
            
            
        )
    }
}


export default Entrance;
import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Auth from "../../../Auth";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { setLoggedInUser } from "../../../Redux/Actions";
import Avatar from '@material-ui/core/Avatar';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import cookie from 'react-cookies'
import API from '../../../helpers/api.js';

import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import { Snackbar } from "@material-ui/core";


class Step1 extends Component {
  state = {
    userName: "",
    pass: "",
    gender : "",
    age : "",
    onDiet : "",
    redirectToReferrer: false,
    open : false,
    message : ""
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };

    // If user was authenticated, redirect her to where she came from.
    if (this.state.redirectToReferrer === true) {
      return <Redirect to={from} />;
    }

    return (
      <div style={{
        height: "100%",
        display: "flex",
        justifyContent: "center",

        alignItems: "center",
      }}>
        <div
          style={{
            height: 300,
            width: 200,
            padding: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <Avatar style={{ marginBottom: 10 }}>
            <LockOutlinedIcon />
          </Avatar>
          <div
            style={{
              marginBottom: 20,
              fontSize: 24,
              textAlign: "center"
            }}
          >
            {" "}
            Register Account
            {" "}
          </div>
          <TextField
            style = {{fontSize : 15, width : 200, padding : 10}}
            value={this.state.userName}
            placeholder="User name"
            onChange={e => {
              this.setState({ userName: e.target.value });
            }}
          />
          <TextField
            style = {{fontSize : 15, width : 200, padding : 10}}
            value={this.state.pass}
            type="password"
            placeholder="Password"
            onChange={e => {
              this.setState({ pass: e.target.value });
            }}
          />
        {/* gender */}
        <div style = {{flexDirection : 'row'}}>
          Gender:
          <Select
            style = {{margin: 20}}
            value={this.state.gender}
            onChange={(e) => this.setState({gender : e.target.value})}
          >
            <MenuItem value={'M'}>Male</MenuItem>
            <MenuItem value={'F'}>Female</MenuItem>
          </Select>
        </div>

        {/* on diet? */}
        <div style = {{flexDirection : 'row'}}>
          On diet?:
          <Select
            style = {{margin: 20}}
            value={this.state.onDiet}
            onChange={(e) => this.setState({onDiet : e.target.value})}
          >
            <MenuItem value={'Y'}>Yes</MenuItem>
            <MenuItem value={'N'}>No</MenuItem>
          </Select>
        </div>

        <TextField
            style = {{fontSize : 15, width : 200, padding : 10}}
            value={this.state.age}
            type="number"
            placeholder="Age"
            onChange={e => {
              e.target.value = Math.max(0, parseInt(e.target.value) ).toString().slice(0,3)

              this.setState({ age: e.target.value });
            }}
          />

          <Button
            style={{ marginTop: 20, width: 200 }}
            variant="outlined"
            color="primary"
            onClick={() => {
                var age = this.state.age;
                if (age > 10 && age < 120) {

                    API.create('/register', {
                        username : this.state.userName,
                        passwd : this.state.pass,
                        gender : this.state.gender,
                        age : this.state.age,
                        onDiet : this.state.onDiet
                    }, false)
                    .then((data) => {
                        if (data.result) {
                            console.log(data.data);

                                // Simulate authentication call
                            Auth.authenticate(this.state.userName, this.state.pass, user => {                            
                                if (user == '') {
                                this.setState({ wrongCred: true });
                                return;
                                }

                                this.props.dispatch(setLoggedInUser({ name: user.name }));
                                // cookie.save('userId', userId, { path: '/' })
                                this.props.history.push("/register_step2");
                            });

                            
                        } else {
                          console.log(data);
                          
                            this.setState({
                              open : true,
                              message : data.messages.messages ? data.messages.messages.pop() : data.messages
                            })
                        }
                    })
                } else{
                  this.setState({
                    open : true,
                    message : "incorrect.age.input"
                  })
                }

            }}
          >
            Create Account
          </Button>
          {this.state.wrongCred && (
            <div style={{ color: "red" }}>Wrong username and/or password</div>
          )}
        </div>
        <Snackbar
          open={this.state.open}
          autoHideDuration = {2000}
          onClose={()=> this.handleClose()}
          message= {this.state.message}
        />
      </div>
    );
  }
}
const RegisterStep1 = withRouter(connect()(Step1));

export default RegisterStep1;

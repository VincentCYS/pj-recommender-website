import React, { Component } from "react";
import { withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Auth from "../../../Auth";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import cookie from "react-cookies";
import API from "../../../helpers/api.js";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Rating from 'react-star-rating-component';
import { Snackbar } from "@material-ui/core";


class Step2 extends Component {
  state = {
    tags               : [],
    selectedTags       : [],
    popular            : [],
    redirectToReferrer : false,
    userID             : cookie.load("userId"),
    rating             : [0,0,0,0,0],
    open : false,
    message : ""
  };

  componentDidMount() {
    this.getRecipeTag();
    this.getMostViewed();
  }

  getRecipeTag() {
    API.get("/ingredients")
      .then(res => {
        this.setState({
          tags: res.data.rows
        });
      })
      .catch(err => console.log(err));
  }

  getMostViewed() {
    API.get('/most_viewed_recipe', {})
    .then((res) => {
      if (res) {
        var results = res.data.rows;
        this.setState((prev) => ({
          popular: results,
          loading: false,
          totalItemsCount: prev.totalItemsCount + results.length
        }));
      }
    })
    .catch(err => console.log(err))
  }

  rateRecipe(rating, item, index) {
    API.create("/rating", {
      rid: item.id,
      uid: this.state.userID,
      rating
    })
      .then(res => {
        if (res.result) {
          this.setState(prev=> {
            prev.rating[index] = rating;
            return {
              rating : prev.rating
            }
          })
        }
      })
      .catch(err => console.log(err));
  }


  renderRecipes() {
    var popular = this.state.popular;
    return (
      popular.length ?
      <div style = {{flex : 1, marginTop : '20%'}}>
      <div style = {{marginBottom : '5%', fontSize : '25px', textAlign : 'center'}}>Rate the recipes for better user experience</div>
      {
      popular.map((item, index) => 
          <Card style = {{ width: 200, height: 270, margin: 10, display: "inline-block" }}>
          <CardActionArea>
            <CardMedia
              style = {{ height: 140 }}
              // image = {item.imageUrl}
            />
            <CardContent style = {{ height: 50 }}>
              <div
                style={{
                  marginLeft   : 5,
                  fontWeight   : "bold",
                  whiteSpace   : "nowrap",
                  overflow     : "hidden",
                  textOverflow : "ellipsis"
                }}
              >
                {item.name}
              </div>
              <div style = {{ margin: 5 }}>Calorie: {item.calorie}</div>
              <div style = {{ color: "#1a9349", fontWeight: "bold", margin: 5 }}>
                {item.calorielevel && "Popular"}
              </div>
            </CardContent>
          </CardActionArea>
          <CardActions
            style = {{ display: "flex", alignItems: "center", height: 45 }}
          >

              <Rating
                style       = {{ flex: 1, marginTop: 5, width :'100%'}}
                name        = {'Rate'}
                value       = {this.state.rating[index]}
                onStarClick = {nextValue => this.rateRecipe(nextValue, item, index)}

              />
          </CardActions>

          
        </Card>
        
        ) 
        }
        </div> : null

    )
  }

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
      <div
        style={{
          flex: 1,
          // height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          marginBottom: "30%"
        }}
      >
        <div
          style={{
            // height: 300,
            width: "100%",
            padding: 30,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              marginBottom: 20,
              fontSize: 24,
              textAlign: "center"
            }}
          >
            {" "}
            Select what you interested in !{" "}
          </div>

          <div
          style={{
            display: "grid",
            gridGap: "1%",
            gridTemplateColumns: "auto auto"
          }}
        >
          {this.state.tags.length > 0
            ? this.state.tags.map(t => {
                return (
                  <Button
                    style={{ marginTop: 20, width: 200, flex: 1 }}
                    variant="outlined"
                    color={
                      !this.state.selectedTags.includes(t.ingredientName)
                        ? "grey"
                        : "primary"
                    }
                    onClick={() => {
                      var selectedTags = this.state.selectedTags;
                      // selectedTags =
                      selectedTags.includes(t.ingredientName)
                        ? selectedTags.splice(
                            selectedTags.indexOf(t.ingredientName),
                            1
                          )
                        : selectedTags.push(t.ingredientName);
                      this.setState(selectedTags);
                    }}
                  >
                    {t.ingredientName}
                  </Button>
                );
              })
            : null}
        </div>


        {
          this.renderRecipes()
        }

          <Button
            style={{ marginTop: '20%', width: 200 }}
            variant="outlined"
            color="primary"
            onClick={() => {
              API.create(
                "/create_profile",
                {
                  uid: this.state.userID,
                  tags: this.state.selectedTags
                },
                false
              ).then(data => {
                if (data.result) {
                  this.props.history.push("/");
                } else {
                  this.setState({
                    open : true,
                    message : data.messages
                  });
                }
              });
            }}
          >
            Start Cooking
          </Button>
        </div>
        <Snackbar
          open={this.state.open}
          autoHideDuration = {1500}
          onClose={()=> this.handleClose()}
          message= {this.state.message}
        />
      </div>
    );
  }
}
const RegisterStep2 = withRouter(connect()(Step2));

export default RegisterStep2;

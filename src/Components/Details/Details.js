import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import CircularProgress from "@material-ui/core/CircularProgress";
import { addItemInCart } from "../../Redux/Actions";
import API from "../../helpers/api.js";
import Item from "../Item/Item";
import { connect } from "react-redux";
import Rating from "react-star-rating-component";
import cookie from "react-cookies";

class ConnectedDetails extends Component {
  constructor(props) {
    super(props);

    this.isCompMounted = false;
    this.rateRecipe = this.rateRecipe.bind(this);
    this.state = {
      quantity: 1,
      item: null,
      rating: 0,

      relatedItems: [],
      recent: [],
      similarImage: [],
      cfRecipe: [],
      similarNumSteps : [],
      similarCalorie : [],
      cfUserProfileRecipe : [],
      likedSimilar : [],


      loading: true,
      userID: cookie.load("userId")
    };
    console.log(cookie.load("userId"));
    
  }

  // Gets product and its related items based on product ID.
  async fetchProductUsingID(id) {
    this.setState({ loading: true });
    var item = [];
    API.get("/recipes", { id: id })
      .then(res => {
        if (res.data.rows.length) {
          item = res.data.rows[0];
          var date = new Date(item.createDate).toLocaleDateString();
          item.createDate = date;
          if (this.isCompMounted) {
            this.setState(
              {
                item,
                quantity: 1,
              },
              () => {
                this.createBrowseHistory();
              }
            );
          }
        }
      })
      .catch(err => console.log(err));

   
  }

  getLikedSimilarRecipes() {
    API.get("/similar_liked_recipe", { uid: this.state.userID })
      .then(res => {
        if (res) {
          var results = res.data.rows;
          // Store results in state
          this.setState({
            likedSimilar: results,
          });
        }
      })
      .catch(err => console.log(err));
  }

  getRelated() {
    API.get("/similar_recipe_ingredients", { rid: this.props.match.params.id, uid : this.state.userID })
    .then(res => {
      if (res.data.rows.length) {
        var relatedItems = res.data.rows;

        if (this.isCompMounted) {
          this.setState({
            relatedItems,
          });
        }
      }
      this.setState({
        loading :false
      });
    })
    .catch(err => console.log(err));
  }
 
  getRating() {
    
    API.get("/rating", { rid: this.props.match.params.id, uid: this.state.userID })
      .then(res => {
        console.log(this.props.match.params.id, res);

          this.setState({
            rating: res.data.rows.length ? res.data.rows[0].rating : 0
          });
      })
      .catch(err => console.log(err));
  }

  createBrowseHistory() {
    API.create("/browse_history", {
      rid: this.props.match.params.id,
      uid: this.state.userID
    })
      .then(res => {
        console.log(res);
      })
      .catch(err => console.log(err));
  }

  getRecentViewedRecipe() {
    API.get("/recent_viewed_recipes", { uid: this.state.userID })
      .then(res => {
        if (res.data.rows.length) {
          var recent = res.data.rows;

          if (this.isCompMounted) {
            this.setState({
              recent,
            });
          }
        }
      })
      .catch(err => console.log(err));
  }

  getSimilarRecipeImage() {
    API.get("/recipe_image_similarity", { rid: this.props.match.params.id, })
      .then(res => {
        console.log("image", res);

        if (res.data.rows.length) {          
          var similarImage = res.data.rows;
          if (this.isCompMounted) {
            this.setState({
              similarImage,
            });
          }
        }
      })
      .catch(err => console.log(err));
  }

  getCFRecipe() {
    API.get("/cf_recipe", { uid: this.state.userID, rid: this.props.match.params.id })
      .then(res => {
        if (res.data.rows.length) {
          var cfRecipe = res.data.rows;
          if (this.isCompMounted) {
            this.setState({
              cfRecipe,
            });
          }
        }
      })
      .catch(err => console.log(err));
  }

  getSimilarNumSteps() {
    API.get("/similar_num_of_steps_recipe", { rid: this.props.match.params.id })
      .then(res => {
        if (res.data.rows.length) {
          var similarNumSteps = res.data.rows;
          if (this.isCompMounted) {
            this.setState({
              similarNumSteps,
            });
        }
        }
      })
      .catch(err => console.log(err));
  }

  getSimilarCalorie() {
    API.get("/similar_calorie_recipe", { rid: this.props.match.params.id })
      .then(res => {
        if (res.data.rows.length) {
          var similarCalorie = res.data.rows;
          if (this.isCompMounted) {
            this.setState({
              similarCalorie,
            });
          }
        }
      })
      .catch(err => console.log(err));
  }

  getCFUserProfileRecipe() {
    API.get("/cf_user_profile_recipe", { uid: this.state.userID, rid : this.props.match.params.id  })
      .then(res => {
        if (res.data.rows.length) {
          var cfUserProfileRecipe = res.data.rows;
          if (this.isCompMounted) {
            this.setState({
              cfUserProfileRecipe,
            });
          }
        }
      })
      .catch(err => console.log(err));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If ID of product changed in URL, refetch details for that product
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchProductUsingID(this.props.match.params.id);
      this.getRelated();
      this.getRating();
      this.getRecentViewedRecipe();
      this.getSimilarRecipeImage();
      // this.getCFRecipe();
      this.getLikedSimilarRecipes();
      this.getSimilarCalorie();
      // this.getCFUserProfileRecipe();
      this.getSimilarNumSteps();
 
    }
  }

  componentDidMount() {
    this.isCompMounted = true;
    this.fetchProductUsingID(this.props.match.params.id);
    this.getRelated();
    this.getRating();
    this.getRecentViewedRecipe();
    this.getSimilarRecipeImage();
    this.getLikedSimilarRecipes();
    // this.getCFRecipe();
    this.getSimilarCalorie();
    // this.getCFUserProfileRecipe();
    this.getSimilarNumSteps();
  }

  componentWillUnmount() {
    this.isCompMounted = false;
  }

  rateRecipe(rating) {
    API.create("/rating", {
      rid: this.props.match.params.id,
      uid: this.state.userID,
      rating
    })
      .then(res => {
        if (res.result) {
          this.setState({
            rating: rating
          });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    if (this.state.loading) {
      return <CircularProgress className="circular" />;
    }

    if (!this.state.item) {
      return null;
    }
    return (
      <div style={{ padding: 10 }}>
        <div
          style={{
            width: "100%",
            display: "flex",
            padding: 10,
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <div
            style={{
              marginBottom: 20,
              marginTop: 10,
              color: "gray",
              fontSize: 20,
              marginRight: 20
            }}
          >
            {this.state.item.name}
          </div>

          <Rating
            style={{ flex: 1, marginTop: 5, width: "100%" }}
            name={"Rate"}
            value={
              this.state.item.rating || 0
            } /* number of selected icon (`0` - none, `1` - first) */
            editing={false}
          />
        </div>
        <div style={{ display: "flex" }}>
          {/* <img
            src={this.state.item.imageUrl}
            alt=""
            width={250}
            height={250}
            style={{ borderRadius: "5%", objectFit: "cover" }}
          /> */}
        </div>
        {/* Recipe description */}
        <div
          style={{
            marginTop: 30,
            marginBottom: 20,
            color: "gray",
            fontSize: 20
          }}
        >
          Recipe Description
        </div>
        <div
          style={{
            marginLeft: 5,
            maxHeight: 200,
            fontSize: 13,
            overflow: "auto"
          }}
        ></div>
        <div style={{ fontSize: 18, marginTop: 10 }}>
          Ingredients
          {this.state.item.ingredient_list.split(",").map(v => (
            <div style={{ fontSize: 18, marginTop: 10 }}>{v + "\n"}</div>
          ))}
        </div>
        <div style={{ fontSize: 18, marginTop: 20 }}>
          Steps
          {this.state.item.detailStep.split(".,").map((v, i) => (
            <div
              style={{ fontSize: 18, marginTop: 10 }}
            >{`Step ${i} ${v}\n`}</div>
          ))}
        </div>
        <div style={{ fontSize: 18, marginTop: 40 }}>
          Created Date : {this.state.item.createDate}
        </div>
        <div style={{ fontSize: 18, marginTop: 10 }}>
          Calorie : {this.state.item.calorie}
        </div>
        <div
          style={{
            width: 100,
            marginLeft: 20,
            marginTop: 20,
            display: "flex",
            flexDirection: "column"
          }}
        >
          Your Rate
          <Rating
            style={{ flex: 1, marginTop: 5, width: "100%" }}
            name={"Rate"}
            value={
              this.state.rating || 0
            } /* number of selected icon (`0` - none, `1` - first) */
            onStarClick={nextValue => this.rateRecipe(nextValue)}
          />
        </div>
        {/* Relateditems */}
        {JSON.stringify(this.state.relatedItems[0]) != "{}" &&
        this.state.relatedItems.length ? (
          <div
            style={{
              marginTop: 30,
              marginBottom: 10,
              color: "gray",
              fontSize: 20
            }}
          >
            Related Recipes
          </div>
        ) : null}
        {JSON.stringify(this.state.relatedItems[0]) != "{}"
          ? this.state.relatedItems.map(x => {
              return <Item key={x.id} item={x} />;
            })
          : null}

{
          this.state.likedSimilar.length ? 
          <div>
            <div
              style={{
                marginTop: 30,
                marginBottom: 10,
                color: "gray",
                fontSize: 20
              }}
            >
              You may also like
            </div>
            <div style={{ flex: 1 }}>
              {this.state.likedSimilar.length
                ? this.state.likedSimilar.map(item => {
                    return <Item key={item.recipeID} item={item} />;
                  })
                : null}
            </div> 
          </div>: null
          }



              
        {/* CF Based on User Profile Recipes */}
        {this.state.cfUserProfileRecipe.length ? (
          <div>
            <div
              style={{
                marginTop: 30,
                marginBottom: 10,
                color: "gray",
                fontSize: 20
              }}
            >
              Similar User Taste
            </div>
            {this.state.cfUserProfileRecipe.map(x => {
              return <Item key={x.id} item={x} />;
            })}
          </div>
        ) : null}


        {/* CF Based on User Rating Recipes */}
        {this.state.cfRecipe.length ? (
          <div>
            <div
              style={{
                marginTop: 30,
                marginBottom: 10,
                color: "gray",
                fontSize: 20
              }}
            >
              Liked by Similar User
            </div>
            {this.state.cfRecipe.map(x => {
              return <Item key={x.id} item={x} />;
            })}
          </div>
        ) : null}

        {/* Similar Finishing items */}
        {this.state.similarImage.length ? (
          <div>
            <div
              style={{
                marginTop: 30,
                marginBottom: 10,
                color: "gray",
                fontSize: 20
              }}
            >
              Similar Finishing Recipes
            </div>
            {this.state.similarImage.map(x => {
              return <Item key={x.id} item={x} />;
            })}
          </div>
        ) : null}


        {/* Recent Viewed items */}
        {this.state.recent.length ? (
          <div>
            <div
              style={{
                marginTop: 30,
                marginBottom: 10,
                color: "gray",
                fontSize: 20
              }}
            >
              Recent Viewed Recipes
            </div>
            {this.state.recent.map(x => {
              return <Item key={x.id} item={x} />;
            })}
          </div>
        ) : null}
     

        {/* Similar Calorie*/}
        {this.state.similarCalorie.length ? (
          <div>
            <div
              style={{
                marginTop: 30,
                marginBottom: 10,
                color: "gray",
                fontSize: 20
              }}
            >
              Similar Calorie Recipes
            </div>
            {this.state.similarCalorie.map(x => {
              return <Item key={x.id} item={x} />;
            })}
          </div>
        ) : null}

           {/* Similar Number of Steps */}
           {this.state.similarNumSteps.length ? (
          <div>
            <div
              style={{
                marginTop: 30,
                marginBottom: 10,
                color: "gray",
                fontSize: 20
              }}
            >
              Similar Difficulty Recipes
            </div>
            {this.state.similarNumSteps.map(x => {
              return <Item key={x.id} item={x} />;
            })}
          </div>
        ) : null}




    
      </div>
    );
  }
}

let Details = connect()(ConnectedDetails);
export default Details;

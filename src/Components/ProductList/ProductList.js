import React, { Component } from "react";
import Item from "../Item/Item";
import CircularProgress from "@material-ui/core/CircularProgress";
import queryString from "query-string";
// import Api from "../../Api";
import Paging from "../Paging/Paging";
import ProductsHeader from "../ProductsHeader/ProductsHeader";
import API from "../../helpers/api.js";
import cookie from "react-cookies";

// A lot of the state of this components lives in the URL (query string):
// for instance whether to use price filter, which products
// to search for etc. The URL is checked initially and on subsequent changes.
// Child components of this component also use the query string.
class ProductList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      totalItemsCount: null,
      items: [],
      popular: [],
      trending: [],
      userProfileRecipes: [],
      notPopular: [],
      timeBased: [],
      recent: [],
      lowCal: [],
      likedSimilar : [],
      userID: cookie.load("userId")
    };
    this.updateQueryString = this.updateQueryString.bind(this);
  }

  async fetchData() {
    this.setState({ loading: true });

    let qsAsObject = queryString.parse(this.props.location.search);
    let results = [];
    // Make the request to get items
    API.get("/newest_recipes", { uid: this.state.userID })
      .then(res => {
        if (res) {
          results = res.data.rows;
          console.log("items: ", res.data.rows);

          // Store results in state
          this.setState({
            items: results,
            totalItemsCount: results.length
          });
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
  
  getLowCalNewRecipe() {
    API.get("/newest_low_cal_recipes", { uid: this.state.userID })
      .then(res => {
        if (res) {
          var results = res.data.rows;
          // Store results in state
          this.setState({
            lowCal: results,
            totalItemsCount: results.length
          });
        }
      })
      .catch(err => console.log(err));
  }

  getMostViewed() {
    API.get("/most_viewed_recipe", {})
      .then(res => {
        if (res) {
          console.log(res);

          var results = res.data.rows;
          this.setState(prev => ({
            popular: results,
            totalItemsCount: prev.totalItemsCount + results.length
          }));
        }
      })
      .catch(err => console.log(err));
  }

  getTrendingRecipe() {
    API.get("/trending_recipes", { uid: this.state.userID })
      .then(res => {
        if (res.data.rows.length) {
          var trending = res.data.rows;
          this.setState({
            trending,
          });
        }
      })
      .catch(err => console.log(err));
  }

  getUserProfileRecipe() {
    API.get("/user_profile_based_recommend", { uid: this.state.userID })
      .then(res => {
        if (res.data.rows.length) {
          var userProfileRecipes = res.data.rows;
          this.setState({
            userProfileRecipes,
          });
        }
      })
      .catch(err => console.log(err));
  }

  getNotPopularRecipe() {
    API.get("/notPopular")
      .then(res => {
        if (res.data.rows.length) {
          var notPopular = res.data.rows;
          this.setState({
            notPopular,
          });
        }
      })
      .catch(err => console.log(err));
  }

  getTimeBasedRecipe() {
    API.get("/time_based_recipes")
      .then(res => {
        if (res.data.rows.length) {
          var timeBased = res.data.rows;
          this.setState({
            timeBased,
          });
        }
      })
      .catch(err => console.log(err));
  }

  getRecentSearchRecipe() {
    API.get("/recent_searched_recipes")
      .then(res => {
        if (res.data.rows.length) {
          var recent = res.data.rows;
          this.setState({
            recent,
            loading: false
          });
        }
        this.setState({
          loading: false
        });
      })
      .catch(err => console.log(err));
  }

  componentDidMount() {
    this.fetchData();
    this.getMostViewed();
    this.getLikedSimilarRecipes();
    this.getTrendingRecipe();
    this.getLowCalNewRecipe();
    this.getUserProfileRecipe();
    // this.getNotRecipe();
    this.getTimeBasedRecipe();
    this.getRecentSearchRecipe();
  }

  updateQueryString(newValues) {
    let currentQS = queryString.parse(this.props.location.search);
    // console.log("search", currentQS);

    // Create new query string by merging with old one
    let newQS = { ...currentQS, ...newValues };

    this.props.history.push("/?" + queryString.stringify(newQS));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    let currentQS = queryString.parse(this.props.location.search);
    let oldQS = queryString.parse(prevProps.location.search);

    // Check if the query strings changed.
    let check1 = Object.entries(currentQS).some(([k, v]) => v !== oldQS[k]);
    let check2 = Object.entries(oldQS).some(([k, v]) => v !== currentQS[k]);
    let isDifferent = check1 || check2;

    // We will refetch products only when query string changes.
    if (isDifferent) {
      this.fetchData();
    }
  }

  render() {
    let parsedQS = queryString.parse(this.props.location.search);

    // Check if products are loading ...
    if (this.state.loading) {
      return <CircularProgress className="circular" />;
    }

    return (
      <div
        style={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "10%"
        }}
      >
        <ProductsHeader
          parsedQS={parsedQS}
          updateQueryString={this.updateQueryString}
          totalItemsCount={this.state.totalItemsCount}
        />
        <div style={{ padding: "2%", paddingTop: 0 }}>
          <div
            style={{
              marginTop: 30,
              marginBottom: 10,
              color: "gray",
              fontSize: 20
            }}
          >
            New Arrival
          </div>
          <div style={{ flex: 1 }}>
            {this.state.items.map(item => {
              return <Item key={item.recipeID} item={item} />;
            })}
          </div>

          {this.state.lowCal.length ? (
            <div>
              <div
                style={{
                  marginTop: 30,
                  marginBottom: 10,
                  color: "gray",
                  fontSize: 20
                }}
              >
                New Low Cal Recipes
              </div>
              <div style={{ flex: 1 }}>
                {this.state.lowCal.map(item => {
                  console.log(item);

                  return <Item key={item.recipeID} item={item} />;
                })}
              </div>
            </div>
          ) : null}

          <div
            style={{
              marginTop: 30,
              marginBottom: 10,
              color: "gray",
              fontSize: 20
            }}
          >
            Trending
          </div>
          <div style={{ flex: 1 }}>
            {this.state.trending.length
              ? this.state.trending.map(item => {
                  return <Item key={item.recipeID} item={item} />;
                })
              : null}
          </div>


          {/* {
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
          } */}

          {this.state.userProfileRecipes.length ? (
            <div>
              <div
                style={{
                  marginTop: 30,
                  marginBottom: 10,
                  color: "gray",
                  fontSize: 20
                }}
              >
                Based on your Profile
              </div>
              <div style={{ flex: 1 }}>
                {this.state.userProfileRecipes.map(item => {
                  return <Item key={item.recipeID} item={item} />;
                })}
              </div>
            </div>
          ) : null}

          {this.state.timeBased.length ? (
            <div>
              <div
                style={{
                  marginTop: 30,
                  marginBottom: 10,
                  color: "gray",
                  fontSize: 20
                }}
              >
                Prepare for your next meal
              </div>
              <div style={{ flex: 1 }}>
                {this.state.timeBased.map(item => {
                  return <Item key={item.recipeID} item={item} />;
                })}
              </div>
            </div>
          ) : null}

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
                Recent Searched Recipe
              </div>
              <div style={{ flex: 1 }}>
                {this.state.recent.map(item => {
                  return <Item key={item.recipeID} item={item} />;
                })}
              </div>
            </div>
          ) : null}

          <div
            style={{
              marginTop: 30,
              marginBottom: 10,
              color: "gray",
              fontSize: 20
            }}
          >
            Most Viewed
          </div>
          <div style={{ flex: 1 }}>
            {this.state.popular.map(item => {
              return <Item key={item.recipeID} item={item} />;
            })}
          </div>

          {this.state.notPopular.length ? (
            <div>
              <div
                style={{
                  marginTop: 30,
                  marginBottom: 10,
                  color: "gray",
                  fontSize: 20
                }}
              >
                Try somethings New?
              </div>
              <div style={{ flex: 1 }}>
                {this.state.notPopular.map(item => {
                  console.log(item);

                  return <Item key={item.recipeID} item={item} />;
                })}
              </div>
            </div>
          ) : null}

          <Paging
            parsedQS={parsedQS}
            updateQueryString={this.updateQueryString}
            totalItemsCount={this.state.totalItemsCount}
          />
        </div>
      </div>
    );
  }
}

export default ProductList;

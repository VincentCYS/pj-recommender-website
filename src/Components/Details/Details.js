import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import CircularProgress from "@material-ui/core/CircularProgress";
import { addItemInCart } from "../../Redux/Actions";
import API from "../../helpers/api.js";
import Item from "../Item/Item";
import { connect } from "react-redux";
import Rating from "react-star-rating-component";
import cookie from 'react-cookies'

class ConnectedDetails extends Component {
  constructor(props) {
    super(props);

    this.isCompMounted = false;

    this.state = {
      relatedItems : [],
      quantity     : 1,
      item         : null,
      rating       : 0,
      recent       : [],
      loading      : false,
      userID       : cookie.load('userId')
    };
  }

  // Gets product and its related items based on product ID.
  async fetchProductUsingID(id) {
    this.setState({ loading: true });
    var item = [];
    API.get("/recipes", { id: id })
      .then(res => {
        if (res.data.rows.length) {
              item            = res.data.rows[0];
          var date            = new Date(item.createDate).toLocaleDateString();
              item.createDate = date;
          if (this.isCompMounted) {
            this.setState(
              {
                item,
                quantity : 1,
                loading  : false
              },
              () => {
                this.getRating();
                this.createBrowseHistory();
              }
            );
          }
        }
      })
      .catch(err => console.log(err));

    API.get("/findSimilarRecipe", { rid: id })
      .then(res => {
        if (res.data.rows.length) {
          var relatedItems = res.data.rows;
          // Make sure this component is still mounted before we set state..
          if (this.isCompMounted) {
            this.setState({
              relatedItems,
              // relatedItems: relatedItems.data.filter(x => x.id !== item.id),
              loading : false
            });
          }
        }
      })
      .catch(err => console.log(err));
  }

  getRating() {
    API.get("/rating", { rid: this.state.item.id, uid: this.state.userID })
      .then(res => {
        if (res.data.rows.length) {
          this.setState({
            rating : res.data.rows[0].rating
          });
        }
      })
      .catch(err => console.log(err));
  }

  createBrowseHistory() {
    API.create("/browse_history", {
      rid : this.state.item.id,
      uid : this.state.userID
    })
      .then(res => {})
      .catch(err => console.log(err));
  }

  getRecentViewedRecipe() {
    API.get("/recent_viewed_recipes", { uid: this.state.userID })
      .then(res => {
        if (res.data.rows.length) {
          var recent = res.data.rows;
          // Make sure this component is still mounted before we set state..
          if (this.isCompMounted) {
            this.setState({
              recent,
              // relatedItems: relatedItems.data.filter(x => x.id !== item.id),
              loading : false
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
      this.getRating();
    }
  }

  componentDidMount() {
    this.isCompMounted = true;
    this.fetchProductUsingID(this.props.match.params.id);
    this.getRecentViewedRecipe();
  }

  componentWillUnmount() {
    this.isCompMounted = false;
  }

  rateRecipe(rating) {
    API.create("/rating", {
      rid : this.props.match.params.id,
      uid : this.state.userID,
      rating
    })
      .then(res => {
        if (res.result) {
          console.log("===> rating", rating);

          this.setState({
            rating : rating
          });
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    console.log(this.state.recent);

    if (this.state.loading) {
      return <CircularProgress className = "circular" />;
    }

    if (!this.state.item) {
      return null;
    }
    return (
      <div style = {{ padding: 10 }}>
      <div style = {{width : '100%' ,display: 'flex', padding: 10, flexDirection : 'row', alignItems : 'center' }}>
      <div
          style={{
            marginBottom : 20,
            marginTop    : 10,
            color        : "gray",
            fontSize     : 20,
            marginRight : 20
          }}
        >
          {this.state.item.name}
          </div>

          <Rating
            style = {{ flex: 1, marginTop: 5, width: "100%" }}
            name  = {"Rate"}
            value = {
              this.state.item.rating || 0
            } /* number of selected icon (`0` - none, `1` - first) */
            editing = {false}
          />


      </div>
    
        <div style = {{ display: "flex" }}>
        
          {/* <img src={this.state.item.imageUrls[0]} alt="" width={250} height={250} style={{ borderRadius: "5%", objectFit: "cover" }} /> */}
        </div>

  

        {/* Recipe description */}
        <div
          style={{
            marginTop    : 30,
            marginBottom : 20,
            color        : "gray",
            fontSize     : 20
          }}
        >
          Recipe Description
        </div>
        <div
          style={{
            marginLeft : 5,
            maxHeight  : 200,
            fontSize   : 13,
            overflow   : "auto"
          }}
        ></div>
        <div style = {{ fontSize: 18, marginTop: 10 }}>
          Ingredients
          {this.state.item.ingredient_list.split(",").map(v => (
            <div style = {{ fontSize: 18, marginTop: 10 }}>{v + "\n"}</div>
          ))}
        </div>

        <div style = {{ fontSize: 18, marginTop: 20 }}>
        Steps
          {this.state.item.detailStep.split(".,").map((v, i) => (
            <div style = {{ fontSize: 18, marginTop: 10 }}>{`Step ${i} ${v}\n`}</div>
          ))}
        </div>

        <div style = {{ fontSize: 18, marginTop: 40 }}>
          Created Date : {this.state.item.createDate}
        </div>
        <div style = {{ fontSize: 18, marginTop: 10 }}>
          Calorie : {this.state.item.calorie}
        </div>

        <div
          style={{
            width         : 100,
            marginLeft    : 20,
            marginTop     : 20,
            display       : "flex",
            flexDirection : "column"
          }}
        >
          Your Rate
          <Rating
            style = {{ flex: 1, marginTop: 5, width: "100%" }}
            name  = {"Rate"}
            value = {
              this.state.rating || 0
            } /* number of selected icon (`0` - none, `1` - first) */
            onStarClick = {nextValue => this.rateRecipe(nextValue)}
          />
        </div>

        {/* Relateditems */}
        {JSON.stringify(this.state.relatedItems[0]) != "{}" &&  this.state.relatedItems.length ? (
          <div
            style={{
              marginTop    : 30,
              marginBottom : 10,
              color        : "gray",
              fontSize     : 20
            }}
          >
            Related Recipes
          </div>
        ) : null}
        {JSON.stringify(this.state.relatedItems[0]) != "{}"
          ? this.state.relatedItems.map(x => {
              return <Item key = {x.id} item = {x} />;
            })
          : null}

        {/* Recent Viewed items */}
        <div
          style={{
            marginTop    : 30,
            marginBottom : 10,
            color        : "gray",
            fontSize     : 20
          }}
        >
          Recent Viewed Recipes
        </div>
        {this.state.recent.length
          ? this.state.recent.map(x => {
              return <Item key = {x.id} item = {x} />;
            })
          : null}
      </div>
    );
  }
}

let Details = connect()(ConnectedDetails);
export default Details;

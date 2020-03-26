import React, { Component } from "react";
import Item from "../Item/Item";
import CircularProgress from "@material-ui/core/CircularProgress";
import queryString from "query-string";
// import Api from "../../Api";
import Paging from "../Paging/Paging";
import ProductsHeader from "../ProductsHeader/ProductsHeader"
import API from '../../helpers/api.js'

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
      popular : []
    };
    this.updateQueryString = this.updateQueryString.bind(this);

  }

  async fetchData() {

    this.setState({ loading: true });

    let qsAsObject = queryString.parse(this.props.location.search);
    let results = [];
    // Make the request to get items
    API.get('/newest_recipes', {})
    .then((res) => {
      if (res) {

        results = res.data.rows;
           // Store results in state
      this.setState({
        items: results,
        loading: false,
        totalItemsCount: results.length
      });
      }
    })
    .catch(err => console.log(err))
  }


  getMostViewed() {
    API.get('/most_viewed_recipe', {})
    .then((res) => {
      if (res) {
        console.log(res);

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

  

  componentDidMount() {
    this.fetchData();
    this.getMostViewed();
  }

  updateQueryString(newValues) {
    let currentQS = queryString.parse(this.props.location.search);
    console.log('search', currentQS);
    
    // Create new query string by merging with old one
    let newQS = { ...currentQS, ...newValues };
    
    this.props.history.push("/?" + queryString.stringify(newQS));
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    let currentQS = queryString.parse(this.props.location.search);
    let oldQS = queryString.parse(prevProps.location.search)

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
    // console.log(this.state.items);
    
    // Obtain query string as an object
    let parsedQS = queryString.parse(this.props.location.search);

    // Check if products are loading ...
    if (this.state.loading) {
      return (
        <CircularProgress className="circular" />
      );
    }

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <ProductsHeader
          parsedQS={parsedQS}
          updateQueryString={this.updateQueryString}
          totalItemsCount={this.state.totalItemsCount} />
        <div
          style={{
            marginTop: 30,
            marginBottom: 10,
            color: "gray",
            fontSize: 20
          }}
        >
          New Recipes
        </div>
        <div style={{ flex: 1 }}>
          {this.state.items.map(item => {
            console.log(item);
            
            return <Item key={item.recipeID} item={item} />;
          })}
        </div>

        <div
          style={{
            marginTop: 30,
            marginBottom: 10,
            color: "gray",
            fontSize: 20
          }}
        >
          Most Viewed Recipes
        </div>
        <div style={{ flex: 1 }}>
          {this.state.popular.map(item => {
            return <Item key={item.recipeID} item={item} />;
          })}
        </div>

        <Paging
          parsedQS={parsedQS}
          updateQueryString={this.updateQueryString}
          totalItemsCount={this.state.totalItemsCount}
        />
      </div >
    );
  }
}

export default ProductList;

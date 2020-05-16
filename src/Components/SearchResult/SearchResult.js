import React, { Component } from "react";
import Item from "../Item/Item";
import CircularProgress from "@material-ui/core/CircularProgress";
import queryString from "query-string";
// import Api from "../../Api";
import Paging from "../Paging/Paging";
import ProductsHeader from "../ProductsHeader/ProductsHeader"
import API from '../../helpers/api.js'
import cookie from "react-cookies";


class SearchResult extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading         : false,
      totalItemsCount : null,
      searchResult : [],
      search : '',
      userID: cookie.load("userId")
    };
    
    this.updateQueryString = this.updateQueryString.bind(this);

  }

  async fetchData(currentQS) {

    this.setState({ loading: true });

    let results = [];

    
    var query = {};
    query.search = this.props.location.search.split('=')[1];
    query.uid = this.state.userID;    

    
    // Make the request to get items
    API.get('/search_recipes', query)
    .then((res) => {
      if (res) {
        results = res.data.rows;
        this.setState({
            searchResult: results,
            loading: false,
            totalItemsCount: results.length
        });
      } else {
        this.setState({
          searchResult: [],
          loading: false,
          totalItemsCount: 0
        });
      }
    })
    .catch(err => console.log(err))
  }



  componentDidMount() {
    this.fetchData();
  }

  updateQueryString(newValues) {
    // Create new query string by merging with old one
    window.location.reload();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    let currentQS = queryString.parse(this.props.location.search);
    let oldQS = queryString.parse(prevProps.location.search)
console.log(oldQS, currentQS);

    // Check if the query strings changed.
    let check1 = Object.entries(currentQS).some(([k, v]) => v !== oldQS[k]);
    let check2 = Object.entries(oldQS).some(([k, v]) => v !== currentQS[k]);
    let isDifferent = check1 || check2;

    // We will refetch products only when query string changes.
    if (isDifferent) {
      this.fetchData(currentQS);
      this.setState({search : currentQS.search})
    }
  }

  render() {
    let parsedQS = queryString.parse(this.props.location.search);

    // Check if products are loading ...
    if (this.state.loading) {
      return (
        <CircularProgress className="circular" />
      );
    }

    return (
      <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems : 'center', marginBottom : '10%' }}>
        <ProductsHeader
          parsedQS={parsedQS}
          updateQueryString={this.updateQueryString}
          totalItemsCount={this.state.totalItemsCount} 
          />
          <div style = {{padding : '2%', paddingTop : 0}}>


          <div>
            <div
              style={{
                marginTop: 30,
                marginBottom: 10,
                color: "gray",
                fontSize: 20
              }}
            >
              { this.state.totalItemsCount > 0 ? 'Search Result of ' + this.state.search : 'No search result'}
            </div>
            <div style={{ flex: 1 }}>
              {this.state.searchResult.map(item => {            
                return <Item key={item.recipeID} item={item} />;
              })}
            </div>
          </div>

        </div>
      </div >
    );
  }
}

export default SearchResult;

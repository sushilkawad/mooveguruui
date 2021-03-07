import React, { Component } from "react";

import './searchTopic.css';

class SearchTopic extends Component {
  constructor(props) {
    super(props)
    this.state = {
      matchTopics : [],
    }
  }

  findTopic = (e) => {
    // debugger;
    let { allTopics } = this.props;
    let matchTopics = [];
    if(e.target.value) {
      matchTopics = allTopics.filter(item => {
        return (item.n.toLowerCase()).includes(e.target.value.toLowerCase())
      });
    }
    this.setState({matchTopics});
  }


  render() {
    const { matchTopics } = this.state;
    const { selectTopic } = this.props;
    return (
      <div className="searchTopic">
        <div className="home-search" style={{ marginBottom: '1.5rem' }}>
          <div className="has-addon left-addon dropdown-typeahead">
            <i className="addon icon-search"></i>
            <input
              aria-label="Search for a company"
              type="search"
              autoComplete={'off'}
              spellCheck={false}
              placeholder="Search for a company"
              className="u-full-width"
              autoFocus={true}
              onChange={(e) => this.findTopic(e)}
              data-company-search="true" />
            <ul 
              className={`dropdown-content ${matchTopics.length > 0 ? 'visible' : ''}`}>
              {matchTopics.map(item => (<li onClick={() => selectTopic(item.id)} key={item.id}>{item.n}</li>))}
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default SearchTopic;
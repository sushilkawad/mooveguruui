import React, { Component } from "react";
import "./topicDetails.css";

import { getTopicById } from '../../constants/commonFunction';


class TopicDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      topicDetails: {}
    }
  }

  componentDidMount(){
    const url = window.location.search;
    if(url){
      const queryparams = url.split('?')[1];
      const id = queryparams.split('=')[1];
      console.log('quesry params',queryparams);
      if(queryparams){
        getTopicById(id).then((result) => {
          this.setState({topicDetails: result.data});
        }).catch((err) => {
          console.log('Error:',err);
        });
      }
    }
  }

  render() {
    const { topicDetails } = this.state;
    console.log('topicDetails',topicDetails)
    return (
      <div>enter in details</div>
    );
  }
}

export default TopicDetails;
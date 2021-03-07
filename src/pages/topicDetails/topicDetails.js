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
    console.log('propsss routeChanged', this.props);
    // (this.props.data2 || {}).data1();
    const {routeChanged} = this.props;
    routeChanged('topicDetails');
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
    const { topicDetails : {name = '', content={}, currentaffair={}, statics={}, quotes={}, diagrams={}, videos={}, questions={}, conclusion={} } = {} } = this.state;
    // console.log('topicDetails',description)
    return (
      <main className="container">
    <h1 className="margin-10">{name}</h1>

      <div className="card card-large" id="top">
        <div className="flex-row flex-space-between flex-gap-8">
          <h2 className="margin-0">Content</h2>
          <div className="flex" style={{alignItems: 'center'}}>
          <div dangerouslySetInnerHTML={{__html: (content || {}).description}}></div>
          </div>
        </div>
      </div>

      <div className="card card-large" id="currentAffairs">
        <div className="flex-row flex-space-between flex-gap-8">
          <h2 className="margin-0">Current Affair</h2>
          <div className="flex" style={{alignItems: 'center'}}>
          <div dangerouslySetInnerHTML={{__html: (currentaffair || {}).description}}></div>
          </div>
        </div>
      </div>

      <div className="card card-large" id="statics">
        <div className="flex-row flex-space-between flex-gap-8">
          <h2 className="margin-0">Statics</h2>
          <div className="flex" style={{alignItems: 'center'}}>
          <div dangerouslySetInnerHTML={{__html: (statics || {}).description}}></div>
          </div>
        </div>
      </div>

      <div className="card card-large" id="quotes">
        <div className="flex-row flex-space-between flex-gap-8">
          <h2 className="margin-0">Quotes</h2>
          <div className="flex" style={{alignItems: 'center'}}>
          <div dangerouslySetInnerHTML={{__html: (quotes || {}).description}}></div>
          </div>
        </div>
      </div>

      <div className="card card-large" id="diagrams">
        <div className="flex-row flex-space-between flex-gap-8">
          <h2 className="margin-0">Diagrams</h2>
          <div className="flex" style={{alignItems: 'center'}}>
          <div dangerouslySetInnerHTML={{__html: (diagrams || {}).description}}></div>
          </div>
        </div>
      </div>

      <div className="card card-large" id="videos">
        <div className="flex-row flex-space-between flex-gap-8">
          <h2 className="margin-0">Videos</h2>
          <div className="flex" style={{alignItems: 'center'}}>
          <div dangerouslySetInnerHTML={{__html: (videos || {}).description}}></div>
          </div>
        </div>
      </div>

      <div className="card card-large" id="questions">
        <div className="flex-row flex-space-between flex-gap-8">
          <h2 className="margin-0">Questions</h2>
          <div className="flex" style={{alignItems: 'center'}}>
          <div dangerouslySetInnerHTML={{__html: (questions || {}).description}}></div>
          </div>
        </div>
      </div>

      <div className="card card-large" id="conclusion">
        <div className="flex-row flex-space-between flex-gap-8">
          <h2 className="margin-0">Conclusion</h2>
          <div className="flex" style={{alignItems: 'center'}}>
          <div dangerouslySetInnerHTML={{__html: (conclusion || {}).description}}></div>
          </div>
        </div>
      </div>


</main>
    );
  }
}

export default TopicDetails;
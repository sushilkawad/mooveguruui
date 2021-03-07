import React, { Component } from "react";
import "./homePage.css";
import logo from '../../logo.svg';
import SearchTopic from '../searchTopics/searchTopic';
import Header from "../../component/header/header";
import Footer from "../../component/footer/footer";
import { getTopicList } from "../../constants/commonFunction";


class HomePage extends Component {
  constructor(props) {
      super(props);
      this.state = {
        topicList: [],
      }
  }

  componentDidMount() {
    getTopicList().then((response) => {
      this.setState({topicList: response.data});
    })
    .catch((error) => {
      console.log('Error:',error);
    });
  }

  selectTopic = (id) => {
    // debugger;
    const { history } = this.props;
    history.push({pathname:'/topicDetails', search: `?id=${id}` })
    //history.push('/topicDetails');
  }

  render() {
      const  { topicList } = this.state;

      const { history } = this.props;

      return (
        <div className="homePage">         
          <main className="flex-grow">
            <div className="container">   
              <div className="heading-area"></div>
              <div className="flex flex-column" style={{maxWidth: 650, margin: '96px auto', minHeight: '60vh', textAlign: 'center', justifyContent: 'center', padding: 16}}>
                <h1 style={{marginBottom: 0}}>
                  MOOVEGURU
                  {/* <img className="u-max-full-width logo" src="static/img/logo-black.f44abb4998d1.svg" alt="Screener logo" /> */}
                </h1>
                <p className="bigger">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                </p>
                <div style={{marginTop: '3%'}}>
                  <SearchTopic allTopics={topicList} selectTopic={this.selectTopic} />
                  <p className="suggestions">
                    Or analyse:
                    {topicList.map((item, index) => {
                      if(index < 9){
                        return <a key={index} className="button" onClick={() => {this.selectTopic(item.id)}}>{item.n}</a>
                      }
                    })}
                  </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  } 
}

export default HomePage;
import React, { Component } from "react";

import { Person } from "../../interfaces/Person";
import { InfiniteLoopItem } from "../../interfaces/General";
import { movieMapperData } from "../../utils/Mapper";
// import { TITLE_HOME_PAGE } from "../../constants";
// import reactLogo from '../../assets/images/react.svg';
// import text from './Home.translation';
// import { debounce } from "../../utils/Helper";
import ApiService from "../../services/Api";
import "./Home.scss";

const { movieService } = ApiService.getInstance();

export interface Props {
  intl: any;
}

export interface State {
  title: String;
  person: Person;
  infiniteItem: InfiniteLoopItem[];
  apiSelection: string;
  isLoadingItem: boolean;
  isLoadingApi: boolean;
  pages: any;
}

class Home extends Component<Props, State> {
  state = {
    title: "React Boilerplate",
    person: {
      name: "Thomi Jasir",
      age: 22,
      hobbies: ["Coding", "Fitness"],
    },
    infiniteItem: [{ id: 0, title: "", desc: "" }],
    pages: { perPage: 7, pageOf: 1 },
    apiSelection: "default",
    isLoadingItem: false,
    isLoadingApi: false,
  };

  componentDidMount() {
    const { pages } = this.state;
    const getPage = this.getPerPage(pages.perPage, pages.pageOf);
    movieService.get().then((res: any) => {
      const mapMovie = movieMapperData(res.data).slice(
        getPage.start,
        getPage.end,
      );
      this.setState({
        infiniteItem: mapMovie,
        isLoadingApi: false,
      });
    });
  }

  updatePages = (): void => {
    const { pages, infiniteItem } = this.state;
    const updatePage = { ...pages, pageOf: pages.pageOf + 1 };
    const getPage = this.getPerPage(updatePage.perPage, updatePage.pageOf);

    movieService.get().then((res: any) => {
      const mapMovie = movieMapperData(res.data).slice(
        getPage.start,
        getPage.end,
      );
      this.setState({
        infiniteItem: [...infiniteItem, ...mapMovie],
        pages: updatePage,
        isLoadingApi: false,
        isLoadingItem: false,
      });
    });
  };

  getPerPage = (perPage: any, pageOf: any) => {
    const calcPage = perPage * pageOf;
    if (pageOf <= 1) {
      return {
        start: 0,
        end: perPage,
      };
    }
    return {
      start: calcPage - perPage,
      end: calcPage,
    };
  };

  handleScroll = (event: any) => {
    const height = event.target.scrollHeight;
    const offset = event.target.offsetHeight;
    const position = event.target.scrollTop;

    if (position + offset >= height) {
      this.setState({ isLoadingItem: true }, this.updatePages);
    }
  };
  render() {
    // const { title, person } = this.state;
    // const {
    //   intl: { formatMessage },
    // } = this.props;
    const { infiniteItem, isLoadingApi, isLoadingItem } = this.state;
    return (
      <div className="home-page">
        <div className="container-fluid">
          <div className="row center-xs">
            <div className="col-lg-6 make-relative">
              <div className={`loader ${isLoadingApi ? "active" : ""}`}>
                <div className="lds-facebook">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div className="section">
                <p> For Api Selecetion</p>
              </div>
              <div className="infinite-loop" onScroll={this.handleScroll}>
                {infiniteItem.map((data: InfiniteLoopItem) => (
                  <div className="item" key={data.id}>
                    <div className="title">
                      <p>{data.title}</p>
                    </div>
                    <div className="description">
                      <p>{data.desc}</p>
                    </div>
                  </div>
                ))}
                <div className={`lds-ripple ${isLoadingItem ? "active" : ""}`}>
                  <div></div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;

import React, { Component } from "react";

import { Person } from "../../interfaces/Person";
import { InfiniteLoopItem } from "../../interfaces/General";
import {
  movieMapperData,
  postMapperData,
  peopleMapperData,
} from "../../utils/Mapper";
import text from "./Home.translation";
import ApiService from "../../services/Api";
import "./Home.scss";

const { movieService, peopleService, postService } = ApiService.getInstance();

export interface Props {
  intl: any;
}

export interface State {
  title: String;
  person: Person;
  infiniteItem: InfiniteLoopItem[];
  isLoadingItem: boolean;
  isLoadingApi: boolean;
  pages: any;
  serviceApi: any;
  mapperData: Function;
}

class Home extends Component<Props, State> {
  state = {
    title: "React Boilerplate",
    person: {
      name: "Thomi Jasir",
      age: 23,
      hobbies: ["Coding", "Fitness"],
    },
    infiniteItem: [{ id: 0, title: "", desc: "" }],
    pages: { perPage: 7, pageOf: 1 },
    isLoadingItem: false,
    isLoadingApi: true,
    serviceApi: movieService,
    mapperData: movieMapperData,
  };

  componentDidMount() {
    this.initData();
  }

  initData = (): void => {
    const { pages, serviceApi, mapperData } = this.state;
    const getPage = this.getPerPage(pages.perPage, pages.pageOf);
    serviceApi.get().then((res: any) => {
      const mapData = mapperData(res.data).slice(getPage.start, getPage.end);
      this.setState({
        infiniteItem: mapData,
        isLoadingApi: false,
      });
    });
  };

  updatePages = (): void => {
    const { pages, infiniteItem, serviceApi, mapperData } = this.state;
    const updatePage = { ...pages, pageOf: pages.pageOf + 1 };
    const getPage = this.getPerPage(updatePage.perPage, updatePage.pageOf);
    serviceApi.get().then((res: any) => {
      const mapData = mapperData(res.data).slice(getPage.start, getPage.end);
      this.setState({
        infiniteItem: [...infiniteItem, ...mapData],
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

  handleSelection = (event: any) => {
    const selection = event.target.value;
    switch (selection) {
      case "mov":
        this.setState(
          {
            serviceApi: movieService,
            mapperData: movieMapperData,
            isLoadingApi: true,
            pages: { perPage: 7, pageOf: 1 },
          },
          this.initData,
        );
        break;
      case "peo":
        this.setState(
          {
            serviceApi: peopleService,
            mapperData: peopleMapperData,
            isLoadingApi: true,
            pages: { perPage: 7, pageOf: 1 },
          },
          this.initData,
        );
        break;
      case "pos":
        this.setState(
          {
            serviceApi: postService,
            mapperData: postMapperData,
            isLoadingApi: true,
            pages: { perPage: 7, pageOf: 1 },
          },
          this.initData,
        );
        break;
      default:
        this.setState(
          {
            serviceApi: movieService,
            mapperData: movieMapperData,
            isLoadingApi: true,
            pages: { perPage: 7, pageOf: 1 },
          },
          this.initData,
        );
        break;
    }
  };

  render() {
    const {
      intl: { formatMessage },
    } = this.props;
    const { infiniteItem, isLoadingApi, isLoadingItem } = this.state;
    return (
      <div className="home-page">
        <div className="container-fluid">
          <div className="row center-xs">
            <div className="col-lg-4 make-relative">
              <div className={`loader ${isLoadingApi ? "active" : ""}`}>
                <div className="lds-facebook">
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              </div>
              <div className="section">
                <p>{formatMessage(text.app)}</p>
                <select name="API" onChange={this.handleSelection}>
                  <option value="mov">Movies</option>
                  <option value="peo">People</option>
                  <option value="pos">Posts</option>
                </select>
                <br /> <br />
                <p>
                  Check to network source i call different kind API with
                  different data structure but with the same component.
                </p>
                <br />
              </div>
              {/* I not split into component because need hurry but i know as advance how the components works it just for challenge in the real world app it will better */}
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

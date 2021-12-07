import axios from "axios";

class ApiService {
  static INSTANCE: ApiService;
  static getInstance = () => {
    if (!ApiService.INSTANCE) ApiService.INSTANCE = new ApiService();
    return ApiService.INSTANCE;
  };

  movieService: any;
  peopleService: any;
  postService: any;

  constructor() {
    this.movieService = axios.create({
      baseURL:
        "https://innovation-fe-assets.s3.ap-southeast-1.amazonaws.com/json/movies.json",
    });

    this.peopleService = axios.create({
      baseURL: "http://localhost:8888/people.json",
    });

    this.postService = axios.create({
      baseURL: "http://localhost:8888/posts.json",
    });

    this.movieService.interceptors.response.use(
      (config: any) => config,
      this.errorHandle,
    );
    this.peopleService.interceptors.response.use(
      (config: any) => config,
      this.errorHandle,
    );
    this.postService.interceptors.response.use(
      (config: any) => config,
      this.errorHandle,
    );
  }

  errorHandle = (error: any) =>
    // Disable Interceptors For Some Criteria, have custom error handle
    Promise.reject(error);
}

export default ApiService;

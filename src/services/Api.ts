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
        "https://raw.githubusercontent.com/thomijasir/infinite-loop/master/public/movies.json",
    });

    this.peopleService = axios.create({
      baseURL:
        "https://raw.githubusercontent.com/thomijasir/infinite-loop/master/public/people.json",
    });

    this.postService = axios.create({
      baseURL: "https://jsonplaceholder.typicode.com/posts",
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

const getLang = (): "en" | "id" => {
  switch (window.navigator.language.split("-")[0]) {
    case "en":
      return "en";
    case "id":
      return "id";
    default:
      return "id";
  }
};

export function debounce<T extends Function>(cb: T, wait = 1000) {
  let h: any = 0;
  const callable = (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  };
  return <T>(<any>callable);
}

export default {
  getLang,
};

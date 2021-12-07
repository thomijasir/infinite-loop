export const movieMapperData = (data: any[]): any =>
  data.map((item: any) => ({
    id: item.id,
    title: item.title,
    desc: item.plot,
  }));

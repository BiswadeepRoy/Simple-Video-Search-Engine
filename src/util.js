export const searchResultMapper = (response) => {
    const videoItems = response?.items
      ?.filter((item) => {
        return (
          item.pagemap?.videoobject !== undefined &&
          item.pagemap?.videoobject?.length > 0
        );
      })
      ?.map((item) => {
        const { displayLink, formattedUrl, title, pagemap } = item;
        const { cse_thumbnail, person, videoobject } = pagemap;
        return {
          displayLink,
          formattedUrl,
          title,
          cse_thumbnail,
          person,
          videoobject
        };
      })
      ?.sort((itemA, itemB) => {
        return (
          itemB?.videoobject[0]?.interactioncount -
          itemA?.videoobject[0]?.interactioncount
        );
      });
  
    return videoItems;
  };
  
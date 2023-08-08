export default function propertiesToFillFunc(categories, category) {
  let propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    if (catInfo) {
      propertiesToFill.push(...catInfo?.properties);
    }
    while (catInfo?.parent?._id) {
      const parentCat = categories.find(
        ({ _id }) => _id == catInfo?.parent?._id
      );
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }
  return propertiesToFill;
}

export default function handleProductProp(propName, value, setProperties) {
  setProperties((prev) => {
    const newProductProps = { ...prev };
    if (value === "") {
      delete newProductProps[propName];
      return newProductProps;
    } else {
      newProductProps[propName] = value;
      return newProductProps;
    }
  });
}

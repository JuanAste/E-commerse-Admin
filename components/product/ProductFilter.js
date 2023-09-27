import ButtonSearchIcon from "../ButtonSearchIcon";

export default function ProductFilter({
  getServerProducts,
  searchTitle,
  setSearchTitle,
  categories,
  category,
  setCategory,
  setProperties,
  setStock,
  setStatus,
}) {
  return (
    <div>
      <div className="flex mt-4 justify-center">
        <input
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              getServerProducts();
            }
          }}
          type="text"
          placeholder="Search product name"
          value={searchTitle}
          onChange={(ev) => setSearchTitle(ev.target.value)}
          className=" h-10 w-full md:w-1/5"
        />
        <div>
          <ButtonSearchIcon functionEjec={getServerProducts} />
        </div>
      </div>

      <div className=" text-center flex gap-5 flex-wrap justify-center ">
        <div className="w-full  md:w-1/5">
          <label>Category</label>
          <select
            value={category}
            onChange={(ev) => {
              setCategory(ev.target.value);
              if (!ev.target.value) {
                setProperties("");
              }
            }}
            className="select-def"
          >
            <option value={""}>Uncategorized</option>
            {categories.length &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className=" w-1/4">
          <label>Status</label>
          <select
            onChange={(ev) => {
              setStatus(ev.target.value);
            }}
            className="select-def"
          >
            <option value="">All</option>
            <option value="enable">Enable</option>
            <option value="disable">Disable</option>
          </select>
        </div>
        <div className=" w-1/4">
          <label>Order</label>
          <select
            onChange={(ev) => {
              setStock(ev.target.value);
            }}
            className="select-def"
          >
            <option value="">Disorderly</option>
            <option value="StockUp">StockUp</option>
            <option value="StockDown">StockDown</option>
          </select>
        </div>
      </div>
    </div>
  );
}

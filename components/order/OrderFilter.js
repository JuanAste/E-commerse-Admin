import ButtonSearchIcon from "../ButtonSearchIcon";

export default function OrderFilter({
  searchValue,
  setSearchValue,
  onClickSearch,
  setPaid,
  setStatus,
}) {
  return (
    <div>
      <div className="flex mt-4 justify-center">
        <input
          type="text"
          className=" w-1/2"
          placeholder="Search email user"
          value={searchValue}
          onChange={(ev) => setSearchValue(ev.target.value)}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              onClickSearch();
            }
          }}
        />
        <ButtonSearchIcon functionEjec={onClickSearch} />
      </div>
      <div className="flex justify-center gap-5">
        <div className=" w-1/3 text-center">
          <label>Paid</label>
          <select
            onChange={(ev) => setPaid(ev.target.value)}
            className="select-def"
          >
            <option value="">All</option>
            <option value="yes">Paid</option>
            <option value="no">Unpaid</option>
          </select>
        </div>
        <div className=" w-1/3 text-center">
          <label>Status</label>
          <select
            onChange={(ev) => setStatus(ev.target.value)}
            className="select-def"
          >
            <option value="">All</option>
            <option value="yes">Delivered</option>
            <option value="no">Undelivered</option>
          </select>
        </div>
      </div>
    </div>
  );
}

import handleProductProp from "@/functions/handleProductProp";

export default function PropertiesProduct({
  propertiesToFill,
  properties,
  setProperties,
  classname,
}) {
  return (
    <div className={classname}>
      {propertiesToFill?.map((p, index) => (
        <div key={index}>
          <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
          <div>
            <select
              value={properties[p.name]}
              onChange={(ev) => {
                handleProductProp(p.name, ev.target.value, setProperties);
              }}
              className={classname?.includes("text-center") ? "select-def" : ""}
              style={{ minWidth: "150px" }}
            >
              <option value={""}>All</option>
              {p.values.map((v, index) => (
                <option key={index} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}

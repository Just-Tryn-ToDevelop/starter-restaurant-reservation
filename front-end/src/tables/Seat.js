import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables } from "../utils/api";
import { useHistory, useParams } from "react-router-dom";
import { updateTable } from "../utils/api";

function Seat() {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [foundTableId, setFoundTableId] = useState("")
  const history = useHistory();
  const { reservation_id } = useParams();

  useEffect(() => {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }, []);

  function changeHandler(e) {
    const { value } = e.target;
    setFoundTableId(value)
  }

  async function submitHandler(e) {
    e.preventDefault();
    const tableName = foundTableId.split(" - ")[0];
    let foundTable = tables.find((table) => tableName === table.table_name);
    if (!foundTable) throw new Error("Table not found");
    if (foundTable) {
      foundTable.reservation_id = reservation_id;
    }
    await updateTable(foundTable)
      .then(() => {
        history.push("/");
      })
      .catch(setTablesError);
  }

  return (
    <>
      <div className="pt-3 pb-3 pr-3 m-">
        <h2>Seat Guests</h2>
      </div>
      <ErrorAlert error={tablesError} />
      <form onSubmit={submitHandler}>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <label className="input-group-text">Table Number:</label>
          </div>
          <select
            className="custom-select"
            name="table_id"
            onChange={changeHandler}
            value = {foundTableId}
          >
            <option>Choose a table......</option>
            {tables.map((table) => (
              <option key={table.table_id} >
                {table.table_name} - {table.capacity}
              </option>
            ))}
          </select>
        </div>{" "}
        <div className="mb-3">
          <button type="submit" className="btn btn-success mr-1">
            Submit
          </button>
          <button
            onClick={() => history.go(-1)}
            type="button"
            className="btn btn-danger mr-1"
          >
            Cancel
          </button>
        </div>
      </form>
    </>
  );
}

export default Seat;

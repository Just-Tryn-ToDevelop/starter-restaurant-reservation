import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";

function CreateTable() {
  const history = useHistory();
  const [createError, setCreateError] = useState(null);
  const [formData, setFormData] = useState({
    table_name: "",
    capacity: "",
  });

  function changeHandler({ target: { name, value } }) {
    setFormData((preFormData) => ({
      ...preFormData,
      [name]: value,
    }));
    if (name === "capacity") value = Number(value)
  }

  function submitHandler(event) {
    event.preventDefault();
    createTable(formData)
      .then(() => {
        history.push(`/dashboard`);
      })
      .catch(setCreateError);
  }
  return (
    <>
      <div
        className="card text-white bg-secondary mb-3"
        style={{ width: "40rem", height: "350px" }}
      >
        <div className="card-header">
          <h2>Create A Table</h2>
        </div>
        <div className="card-body">
          <ErrorAlert error={createError} />
          <form onSubmit={submitHandler} className="w-75">
            <div className="form-group d-flex">
              <label className="w-25">Table Name:</label>
              <input
                type="text"
                className="form-control"
                name="table_name"
                placeholder="Where will this table be?"
                value={formData.tableName}
                onChange={changeHandler}
                required={true}
              />
            </div>
            <div className="form-group d-flex">
              <label className="w-25">Capacity:</label>
              <input
                type="number"
                min="1"
                className="form-control"
                name="capacity"
                value={formData.capacity}
                onChange={changeHandler}
                placeholder="How many people can this table seat?"
                required={true}
              />
            </div>
            <div className="d-flex">
              <button type="submit" className="btn btn-success mr-3">
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
        </div>
      </div>
    </>
  );
}

export default CreateTable;

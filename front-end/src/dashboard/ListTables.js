import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { listTables, deleteTable, listReservations } from "../utils/api";

function ListTables({ reservations, setReservations, date }) {
  let [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }, []);

  async function clickHandler(e) {
    const { value } = e.target;
    const tableEntry = tables.find((table) => table.table_id === Number(value));

    const warningMessage = window.confirm(
      "Is this table ready to seat new guests?"
    );
    if (warningMessage) {
      try {
        await deleteTable(tableEntry.table_id);
      tables = await listTables();
      await setTables(tables);
      reservations = await listReservations({ date });
      await setReservations(reservations);
    } catch (error) {setTablesError(error)}

    }
  }

  const tablesList = tables.map((table) => {
    return (
      <tr key={table.table_id}>
        <td>{table.table_name}</td>
        <td>{table.capacity}</td>
        {!table.reservation_id ? (
          <>
            <td data-table-id-status={table.table_id}>Free</td>
            <td></td>
          </>
        ) : (
          <>
            <td data-table-id-status={table.table_id} className="pt-3">
              Occupied
            </td>
            <td>
              <button
                type="button"
                className="btn btn-danger mr-1"
                data-table-id-finish={table.table_id}
                value={table.table_id}
                onClick={clickHandler}
              >
                Finish
              </button>
            </td>
          </>
        )}
      </tr>
    );
  });

  return (
    <>
      <div>
        <table className="table table-responsive-sm border">
          <thead>
            <tr>
              <th>Table</th>
              <th>Capacity</th>
              <th>Availability</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="text-center">{tablesList}</tbody>
        </table>
        <ErrorAlert error={tablesError} />
      </div>
    </>
  );
}

export default ListTables;

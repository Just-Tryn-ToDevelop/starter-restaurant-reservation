import React, { useEffect, useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import {
  listTables,
  deleteTable,
  listReservations,
  createTable,
} from "../utils/api";

function ListTables({ reservations, setReservations, date }) {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [table, setTable] = useState({})
  useEffect(() => {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }, [table.table_id]);
  
  async function clickHandler(e) {
    const { value } = e.target;
    const tableEntry = tables.find((table) => table.table_id === Number(value));
    const reservation = reservations.find(
      (res) => res.reservation_id === tableEntry.reservation_id
      );
      setTable(tableEntry)
      if (!reservation) throw new Error("No reservation found");
      if (!tableEntry) throw new Error("No table found");
      if (reservation) reservation.status = "finished";
      const newTable = {
        table_name: tableEntry.table_name,
        capacity: tableEntry.capacity,
      };
      
      const warningMessage = window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
        );
       
        if (warningMessage) {
          await deleteTable(tableEntry.table_id);
          await listReservations({ date }).then(setReservations)
          await createTable(newTable).then((table) => {
            const index = tables.indexOf(tableEntry)
            tables.splice(index, 1, table)
            setTables(tables)
          })
          .catch(setTablesError)
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

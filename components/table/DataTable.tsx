import { Appointment } from "@/types/appwrite.types";
import React from "react";

interface DataTableProps {
  data: Appointment[];
  columns: {};
}
const DataTable = ({ data, columns }: DataTableProps) => {
  return <div>DataTable</div>;
};

export default DataTable;

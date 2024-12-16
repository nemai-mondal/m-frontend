import { Skeleton, TableCell, TableRow } from "@mui/material";
import React from "react";

export default function TableRowSkeleton({ rows, columns }) {
  return Array.from({ length: rows }).map((_, index) => (
    <TableRow key={index}>
      {Array.from({ length: columns }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton height={24} />
        </TableCell>
      ))}
    </TableRow>
  ));
}

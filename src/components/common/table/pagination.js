import React from "react";
import { css } from "@emotion/react";
import { useState, Fragment } from "react";

import {
  BsChevronLeft,
  BsChevronRight,
  BsChevronBarLeft,
  BsChevronBarRight,
} from "react-icons/bs";

import ReactPaginate from "react-paginate";

const Pagination = ({ page, pageCount, handlePageChange }) => {
  return (
    <div>
      {!!pageCount && (
        <ReactPaginate
          className="flex items-center justify-end pt-5"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel={
            <button className="break-link">
              <span
                style={{
                  height: "100%",
                  verticalAlign: "middle",
                }}
              >
                ...
              </span>
            </button>
          }
          pageCount={pageCount}
          pageRangeDisplayed={3}
          marginPagesDisplayed={1}
          activeClassName="active"
          renderOnZeroPageCount={null}
          nextLabel={<BsChevronRight />}
          containerClassName="pagination"
          previousLabel={<BsChevronLeft />}
          forcePage={page - 1}
          onPageChange={(e) => handlePageChange(e.selected + 1)}
        />
      )}
    </div>
  );
};

export default Pagination;

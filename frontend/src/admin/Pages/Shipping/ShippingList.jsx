import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiDeleteOutline } from "react-icons/ti";
import axios from "axios";

function ShippingList({ data }) {
  const [loader, setLoader] = useState(false);

  const DeleteShipping = async (e) => {
    setLoader(true);
    const token = localStorage.getItem("userToken");
    const id = e.currentTarget.id;
    const tr = e.currentTarget.parentNode.parentNode;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/shipping/delete/${id}`,
        { _method: "delete" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        console.log(response.data.message);
        tr.style.display = "none";
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <tr>
      <td>{data.id}</td>
      <td>{data.country.name}</td>
      <td>{data.amount}</td>
     
      <td className="d-flex" style={{ gap: "30px" }}>
        <Link to={`/admin/shipping/update/${data.id}`}>
          <MdModeEdit />
        </Link>
        <a
          onClick={DeleteShipping}
          id={data.id}
          className="text-danger w-4 h-4 mr-1"
        >
          <RiDeleteBin6Line />
        </a>
      </td>
    </tr>
  );
}

export default ShippingList;

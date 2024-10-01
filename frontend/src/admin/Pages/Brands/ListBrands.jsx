import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiDeleteOutline } from "react-icons/ti";
import axios from 'axios';

function ListBrands({data}) {
    const [loader, setLoader] = useState(false);
    const [message, setMessage] = useState(null);

    const DeleteBrands =async (e)=>{
            setLoader(true);
            const token = localStorage.getItem('userToken');
            const id = e.currentTarget.id;
                const tr = e.currentTarget.parentNode.parentNode;
                
        try {
           const response =await axios.post(`${import.meta.env.VITE_API_URL}/brands/delete/${id}`,{'_method':'delete'},{
                headers : {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true,
            });

            if(response.status === 200){
                Message({mess:response.data.message,stat: response.data.status});
                tr.style.display = 'none';
            }
        } catch (error) {
            console.log(error);
        }
    };

    const Message =({mess,stat})=>{
        setMessage({mess,stat});
        setTimeout(() => {
            setMessage(null);
        }, 3000);
    };
  return (
    <>
    {message && <tr><td colSpan={5} className={(message.stat)? 'alert alert-success':'alert alert-danger'}>{message.mess}</td></tr>}
      	<tr>
			<td>{data.id}</td>
			<td>{data.name}</td>
			<td>{data.slug}</td>
			<td>
            {(data.status == 1)? <IoCheckmarkCircleOutline className='text-success' style={{fontSize:'20px'}}/>
            :<TiDeleteOutline className='text-danger' style={{fontSize:'20px'}}/>
            }
			</td>
            <td className='d-flex' style={{gap:'30px'}}>
            <Link to={`/admin/brands/update/${data.id}`}>
                <MdModeEdit/>
            </Link>
            <a onClick={DeleteBrands} id={data.id} className="text-danger w-4 h-4 mr-1">
                <RiDeleteBin6Line/>

            </a>
        </td>
		</tr>
    </>
  )
}

export default ListBrands

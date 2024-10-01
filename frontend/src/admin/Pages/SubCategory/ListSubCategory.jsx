import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { TiDeleteOutline } from "react-icons/ti";
import axios from 'axios';

function ListSubCategory({value}) {
	const [loader, setLoader] = useState(false);

	const DeleteCategory =async (e)=>{
		if(confirm('Are you sure you want to delete')){
			setLoader(true);
		const token = localStorage.getItem('userToken');
		const id = e.currentTarget.id;
			const tr = e.currentTarget.parentNode.parentNode;
			
	try {
	   const response =await axios.post(`${import.meta.env.VITE_API_URL}/subcategory/delete/${id}`,{'_method':'delete'},{
			headers : {
				'Authorization': `Bearer ${token}`,
			},
			withCredentials: true,
		});

		if(response.status === 200){
			setLoader(false);
			console.log(response.data.message)
			tr.style.display = 'none';
		}
	} catch (error) {
		console.log(error);
		setLoader(false);
	}
		}
		
};

  return (
    <>
      <tr>
			<td>{value.id}</td>
			<td>{value.name}</td>
			<td>{value.slug}</td>
            <td>{value.category.name}</td>
			<td>
			{(value.status == 1)? <IoCheckmarkCircleOutline className='text-success' style={{fontSize:'20px'}}/>
            :<TiDeleteOutline className='text-danger' style={{fontSize:'20px'}}/>
            }
			</td>
			<td className='d-flex' style={{gap:'30px'}}>
				<Link to={`/admin/subcategory/update/${value.id}`}>
					<MdModeEdit/>
				</Link>
				{(loader)? 
					<div className="spinner-border" role="status">
					<span className="sr-only">Loading...</span>
				  </div>
				:
				<a onClick={DeleteCategory} id={value.id} className="text-danger w-4 h-4 mr-1">
               		 <RiDeleteBin6Line/>
				</a>
				}
			</td>
		</tr>
    </>
  )
}

export default ListSubCategory

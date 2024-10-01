import React from 'react'
import { Link } from 'react-router-dom'

function Orders() {
  return (
    <div className="content-wrapper">
				{/* <!-- Content Header (Page header) --> */}
				<section className="content-header">					
					<div className="container-fluid my-2">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1>Orders</h1>
							</div>
							<div className="col-sm-6 text-right">
							</div>
						</div>
					</div>
					{/* <!-- /.container-fluid --> */}
				</section>
				{/* <!-- Main content --> */}
				<section className="content">
					{/* <!-- Default box --> */}
					<div className="container-fluid">
						<div className="card">
							<div className="card-header">
								<div className="card-tools">
									<div className="input-group input-group" style={{width: "250px"}}>
										<input type="text" name="table_search" className="form-control float-right" placeholder="Search"/>
					
										<div className="input-group-append">
										  <button type="submit" className="btn btn-primary m-0">
											<i className="fas fa-search"></i>
										  </button>
										</div>
									  </div>
								</div>
							</div>
							<div className="card-body table-responsive p-0">								
								<table className="table table-hover text-nowrap">
									<thead>
										<tr>
											<th>Orders #</th>											
                                            <th>Customer</th>
                                            <th>Email</th>
                                            <th>Phone</th>
											<th>Status</th>
                                            <th>Total</th>
                                            <th>Date Purchased</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td><Link to="/admin/orders/details/3">OR756374</Link></td>
											<td>Mohit Singh</td>
                                            <td>example@example.com</td>
                                            <td>12345678</td>
                                            <td>
												<span className="badge bg-success">Delivered</span>
											</td>
											<td>$400</td>
                                            <td>Nov 20, 2022</td>																				
										</tr>
									
									</tbody>
								</table>										
							</div>
							<div className="card-footer clearfix">
								<ul className="pagination pagination m-0 float-right">
								  <li className="page-item"><a className="page-link" href="#">«</a></li>
								  <li className="page-item"><a className="page-link" href="#">1</a></li>
								  <li className="page-item"><a className="page-link" href="#">2</a></li>
								  <li className="page-item"><a className="page-link" href="#">3</a></li>
								  <li className="page-item"><a className="page-link" href="#">»</a></li>
								</ul>
							</div>
						</div>
					</div>
					{/* <!-- /.card --> */}
				</section>
				{/* <!-- /.content --> */}
			</div>
  )
}

export default Orders

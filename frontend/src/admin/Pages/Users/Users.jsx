import React from 'react'
import { Link } from 'react-router-dom'

function Users() {
  return (
    <div className="content-wrapper">
				{/* <!-- Content Header (Page header) --> */}
				<section className="content-header">					
					<div className="container-fluid my-2">
						<div className="row mb-2">
							<div className="col-sm-6">
								<h1>Users</h1>
							</div>
							<div className="col-sm-6 text-right">
								<Link to="/admin/users/create" className="btn btn-primary">New User</Link>
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
											<th width="60">ID</th>
											<th>Name</th>
											<th>Email</th>
											<th>Phone</th>
											<th>Gender</th>
											<th width="100">Status</th>
											<th width="100">Actions</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>
												1
											</td>
											<td>Ritika Singh</td>
											<td>example@example.com</td>
											<td>123456789</td>
											<td>Female</td>
											<td>
												<svg className="text-success-500 h-6 w-6 text-success" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" ariaHidden="true">
													<path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
												</svg>
											</td>
											<td>
												<Link to="/admin/users/update/3">
													<svg className="filament-link-icon w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" ariaHidden="true">
														<path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
													</svg>
												</Link>
												<a href="#" className="text-danger w-4 h-4 mr-1">
													<svg  wire:target="" className="filament-link-icon w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" ariaHidden="true">
														<path	ath fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
												  	</svg>
												</a>
											</td>
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

export default Users

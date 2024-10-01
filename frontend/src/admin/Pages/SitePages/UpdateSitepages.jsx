import React from 'react'
import { Link } from 'react-router-dom'

function UpdateSitepages() {
  return (
    <div className="content-wrapper">
    {/* <!-- Content Header (Page header) --> */}
    <section className="content-header">					
        <div className="container-fluid my-2">
            <div className="row mb-2">
                <div className="col-sm-6">
                    <h1>Update Page</h1>
                </div>
                <div className="col-sm-6 text-right">
                    <Link to="/admin/pages" className="btn btn-primary">Back</Link>
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
                <div className="card-body">								
                    <div className="row">
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="name">Name</label>
                                <input type="text" name="name" id="name" className="form-control" placeholder="Name"/>	
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="mb-3">
                                <label htmlFor="email">Slug</label>
                                <input type="text" name="slug" id="slug" className="form-control" placeholder="Slug"/>	
                            </div>
                        </div>	
                        <div className="col-md-12">
                            <div className="mb-3">
                                <label htmlFor="content">Content</label>
                                <textarea name="content" id="content" className="summernote" cols="30" rows="10"></textarea>
                            </div>								
                        </div>                                    
                    </div>
                </div>							
            </div>
            <div className="pb-5 pt-3">
                <button className="btn btn-primary">Create</button>
                <a href="pages.html" className="btn btn-outline-dark ml-3">Cancel</a>
            </div>
        </div>
        {/* <!-- /.card --> */}
    </section>
    {/* <!-- /.content --> */}
</div>
  )
}

export default UpdateSitepages

import React from 'react'
import { Link } from 'react-router-dom'

function OrdersDetails() {
  return (
    <div class="content-wrapper">
    {/* <!-- Content Header (Page header) --> */}
    <section class="content-header">					
        <div class="container-fluid my-2">
            <div class="row mb-2">
                <div class="col-sm-6">
                    <h1>Order: #4F3S8J</h1>
                </div>
                <div class="col-sm-6 text-right">
                    <Link to="/admin/orders" class="btn btn-primary">Back</Link>
                </div>
            </div>
        </div>
        {/* <!-- /.container-fluid --> */}
    </section>
    {/* <!-- Main content --> */}
    <section class="content">
        {/* <!-- Default box --> */}
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-9">
                    <div class="card">
                        <div class="card-header pt-3">
                            <div class="row invoice-info">
                                <div class="col-sm-4 invoice-col">
                                <h1 class="h5 mb-3">Shipping Address</h1>
                                <address>
                                    <strong>Mohit Singh</strong><br/>
                                    795 Folsom Ave, Suite 600<br/>
                                    San Francisco, CA 94107<br/>
                                    Phone: (804) 123-5432<br/>
                                    Email: info@example.com
                                </address>
                                </div>
                                
                                
                                
                                <div class="col-sm-4 invoice-col">
                                    <b>Invoice #007612</b><br/>
                                    <br/>
                                    <b>Order ID:</b> 4F3S8J<br/>
                                    <b>Total:</b> $90.40<br/>
                                    <b>Status:</b> <span class="text-success">Delivered</span>
                                    <br/>
                                </div>
                            </div>
                        </div>
                        <div class="card-body table-responsive p-3">								
                            <table class="table table-striped">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th width="100">Price</th>
                                        <th width="100">Qty</th>                                        
                                        <th width="100">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Call of Duty</td>
                                        <td>$10.00</td>                                        
                                        <td>2</td>
                                        <td>$20.00</td>
                                    </tr>
                                    <tr>
                                        <td>Call of Duty</td>
                                        <td>$10.00</td>                                        
                                        <td>2</td>
                                        <td>$20.00</td>
                                    </tr>
                                    <tr>
                                        <td>Call of Duty</td>
                                        <td>$10.00</td>                                        
                                        <td>2</td>
                                        <td>$20.00</td>
                                    </tr>
                                    <tr>
                                        <td>Call of Duty</td>
                                        <td>$10.00</td>                                        
                                        <td>2</td>
                                        <td>$20.00</td>
                                    </tr>
                                    <tr>
                                        <th colspan="3" class="text-right">Subtotal:</th>
                                        <td>$80.00</td>
                                    </tr>
                                    
                                    <tr>
                                        <th colspan="3" class="text-right">Shipping:</th>
                                        <td>$5.00</td>
                                    </tr>
                                    <tr>
                                        <th colspan="3" class="text-right">Grand Total:</th>
                                        <td>$85.00</td>
                                    </tr>
                                </tbody>
                            </table>								
                        </div>                            
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card">
                        <div class="card-body">
                            <h2 class="h4 mb-3">Order Status</h2>
                            <div class="mb-3">
                                <select name="status" id="status" class="form-control">
                                    <option value="">Pending</option>
                                    <option value="">Shipped</option>
                                    <option value="">Delivered</option>
                                    <option value="">Cancelled</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <button class="btn btn-primary">Update</button>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-body">
                            <h2 class="h4 mb-3">Send Inovice Email</h2>
                            <div class="mb-3">
                                <select name="status" id="status" class="form-control">
                                    <option value="">Customer</option>                                                
                                    <option value="">Admin</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <button class="btn btn-primary">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* <!-- /.card --> */}
    </section>
    {/* <!-- /.content --> */}
</div>
  )
}

export default OrdersDetails

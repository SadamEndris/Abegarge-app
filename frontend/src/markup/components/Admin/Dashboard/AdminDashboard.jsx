import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <>
      <section class="services-section">
        <div class="auto-container">
          <div class="sec-title style-two">
            <h2>Admin Dashboard</h2>
            <div class="text">
              Bring to the table win-win survival strategies to ensure proactive
              domination. At the end of the day, going forward, a new normal
              that has evolved from generation X is on the runway heading
              towards a streamlined cloud solution.
            </div>
          </div>
          <div class="row">
            <div class="col-lg-4 service-block-one">
              <Link to="/">
                <div class="inner-box hvr-float-shadow">
                  <h5>open for all</h5>
                  <h2>All Orders</h2>
                  <a href="/admin/orders" class="read-more">
                    list of orders +
                  </a>
                  <div class="icon">
                    <span class="flaticon-power"></span>
                  </div>
                </div>
              </Link>
            </div>
            <div class="col-lg-4 service-block-one">
              <div class="inner-box hvr-float-shadow">
                <h5>open for all</h5>
                <h2>New Orders</h2>
                <a href="/admin/order" class="read-more">
                  add order +
                </a>
                <div class="icon">
                  <span class="flaticon-gearbox"></span>
                </div>
              </div>
            </div>
            <div class="col-lg-4 service-block-one">
              <div class="inner-box hvr-float-shadow">
                <h5>open for admins</h5>
                <h2>Employees</h2>
                <a href="/admin/employees" class="read-more">
                  list of Employees +
                </a>
                <div class="icon">
                  <span class="flaticon-brake-disc"></span>
                </div>
              </div>
            </div>
            <div class="col-lg-4 service-block-one">
              <div class="inner-box hvr-float-shadow">
                <h5>open for admins</h5>
                <h2>Add Employee</h2>
                <a href="/admin/add-employee" class="read-more">
                  add employee +
                </a>
                <div class="icon">
                  <span class="flaticon-car-engine"></span>
                </div>
              </div>
            </div>
            <div class="col-lg-4 service-block-one">
              <div class="inner-box hvr-float-shadow">
                <h5>open for admins</h5>
                <h2>Customers</h2>
                <a href="/admin/customers" class="read-more">
                  list of customers +
                </a>
                <div class="icon">
                  <span class="flaticon-tire"></span>
                </div>
              </div>
            </div>
            <div class="col-lg-4 service-block-one">
              <div class="inner-box hvr-float-shadow">
                <h5>open for admins</h5>
                <h2>Add Customer</h2>
                <a href="/admin/add-customer" class="read-more">
                  add customer +
                </a>
                <div class="icon">
                  <span class="flaticon-spray-gun"></span>
                </div>
              </div>
            </div>
            <div class="col-lg-4 service-block-one">
              <div class="inner-box hvr-float-shadow">
                <h5>open for admins</h5>
                <h2>Services</h2>
                <a href="/admin/services" class="read-more">
                  services +
                </a>
                <div class="icon">
                  <span class="flaticon-spray-gun"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminDashboard;

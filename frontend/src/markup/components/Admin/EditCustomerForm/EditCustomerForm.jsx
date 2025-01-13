import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customerService from "../../../../services/customer.service";
import { useAuth } from "../../../../Context/AuthContext";

const EditCustomerForm = () => {
  const { id } = useParams(); // Extract customer ID from route params
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    customer_first_name: "",
    customer_last_name: "",
    customer_phone_number: "",
    active_customer_status: false,
    customer_email: "",
  });

  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { employee } = useAuth();
  const token = employee ? employee.employee_token : null;

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      setIsLoading(true);
      try {
        const res = await customerService.getCustomers(token); // Fetch all customers
        const data = await res.json();
        console.log(data, "customer data");

        if (res.ok && data.success) {
          const customer = data.data.find(
            (c) => c.customer_id === parseInt(id)
          );

          if (customer) {
            setFormData({
              customer_first_name: customer.customer_first_name || "",
              customer_last_name: customer.customer_last_name || "",
              customer_phone_number: customer.customer_phone_number || "",
              active_customer_status: !!customer.active_customer_status,
              customer_email: customer.customer_email || "",
            });
          } else {
            setServerError("Customer not found.");
          }
        } else {
          setServerError(data.message || "Failed to load customer details.");
        }
      } catch (error) {
        console.error("Error fetching customer details:", error);
        setServerError("Failed to load customer details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await customerService.updateCustomer(
        id,
        formData,
        token
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage("Customer updated successfully!");
        setTimeout(() => navigate("/admin/customers"), 1000);
      } else {
        setServerError(data.message || "Failed to update customer.");
      }
    } catch (error) {
      console.error("Error updating customer:", error);
      setServerError("Failed to update customer.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <section className="contact-section ml-4">
      <div className="auto-container">
        <div className="contact-title">
          <h2>
            Edit: {formData.customer_first_name} {formData.customer_last_name}
          </h2>
        </div>
        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">
                    <div className="form-group col-md-12">
                      <p className="font-weight-bolder">
                        Customer email: {formData.customer_email}
                      </p>
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_first_name"
                        value={formData.customer_first_name}
                        onChange={handleInputChange}
                        placeholder="First Name"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_last_name"
                        value={formData.customer_last_name}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_phone_number"
                        value={formData.customer_phone_number}
                        onChange={handleInputChange}
                        placeholder="Phone"
                      />
                    </div>
                    <div className="form-group col-md-12">
                      <label>
                        <input
                          type="checkbox"
                          name="active_customer_status"
                          checked={formData.active_customer_status}
                          onChange={handleInputChange}
                        />
                        <span className="ml-2">Is active customer</span>
                      </label>
                    </div>
                    <div className="form-group col-md-12">
                      <button type="submit" className="theme-btn btn-style-one">
                        <span>Update</span>
                      </button>
                    </div>
                  </div>
                </form>
                {serverError && (
                  <div className="validation-error" role="alert">
                    {serverError}
                  </div>
                )}
                {successMessage && (
                  <div className="success-message" role="alert">
                    {successMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditCustomerForm;

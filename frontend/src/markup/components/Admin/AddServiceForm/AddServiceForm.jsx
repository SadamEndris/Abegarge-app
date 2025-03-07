import { useEffect, useState } from "react";
import { useAuth } from "../../../../Context/AuthContext";
import classes from "./addServiceForm.module.css";
import serviceServices from "../../../../services/service.service";

const AddServiceForm = ({ editingService, onServiceUpdated }) => {
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { employee } = useAuth();

  let token = employee ? employee.employee_token : null;

  useEffect(() => {
    if (editingService) {
      setServiceName(editingService.service_name);
      setServiceDescription(editingService.service_description);
    } else {
      setServiceName("");
      setServiceDescription("");
    }
  }, [editingService]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const serviceData = {
      service_name: serviceName,
      service_description: serviceDescription,
    };

    try {
      if (editingService) {
        // Edit existing service
        const updatedService = await serviceServices.updateService(
          editingService.service_id,
          serviceData,
          token
        );
        onServiceUpdated(updatedService);
      } else {
        // Add new service
        const newService = await serviceServices.addService(serviceData, token);
        onServiceUpdated(newService);
      }

      // Clear the form inputs
      setServiceName("");
      setServiceDescription("");
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="w-100">
        <div className="contact-title">
          <h2>
            {editingService ? "Edit Service" : "Add a new service"}
            <span className={classes.underline}></span>
          </h2>
        </div>

        <div className={classes.add_service_wrapper}>
          <form onSubmit={handleSubmit}>
            <div className={classes.input_group}>
              <input
                type="text"
                name="service_name"
                id="serviceName"
                value={serviceName}
                onChange={(e) => setServiceName(e.target.value)}
                placeholder="Service name"
                className={classes.input_field}
                required
              />
            </div>

            <div className={classes.input_group}>
              <textarea
                name="service_description"
                id="serviceDescription"
                rows="8"
                value={serviceDescription}
                onChange={(e) => setServiceDescription(e.target.value)}
                placeholder="Service description"
                className={classes.textarea_field}
                required
              ></textarea>
            </div>

            {error && <p className="text-danger">{error}</p>}

            <div className={classes.button_container}>
              <button
                className={classes.add_service_button}
                type="submit"
                data-loading-text="Please wait..."
                disabled={!serviceName || !serviceDescription || loading}
              >
                <span>
                  {loading
                    ? editingService
                      ? "Updating..."
                      : "Adding..."
                    : editingService
                    ? "Update Service"
                    : "Add Service"}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddServiceForm;

import { useEffect, useState } from "react";
import { useAuth } from "../../../../Context/AuthContext";
import serviceServices from "../../../../services/service.service";
import { FaEdit, FaTrash } from "react-icons/fa";
import classes from "./ServiceList.module.css";
import AddServiceForm from "../AddServiceForm/AddServiceForm";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);

  const { employee } = useAuth();
  let token = employee ? employee.employee_token : null;

  const fetchServices = async () => {
    setLoading(true);
    setApiError(false);
    setApiErrorMessage(null);

    try {
      const res = await serviceServices.getServices(token);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      if (data.services && data.services.length > 0) {
        setServices(data.services);
      } else {
        setServices([]); // Ensure services are empty if no data is returned
      }
      setApiError(false); // Reset apiError
      setApiErrorMessage(null);
    } catch (error) {
      console.error("Error fetching services:", error);
      setApiError(true);
      setApiErrorMessage("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [token]);

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;

    try {
      let res = await serviceServices.deleteService(serviceId, token);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      setServices((prevServices) =>
        prevServices.filter((service) => service.service_id !== serviceId)
      );
    } catch (error) {
      console.error("Error deleting service:", error);
      setApiError(true);
      setApiErrorMessage("Failed to delete the service.");
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
  };

  const handleUpdateService = (updatedService) => {
    setServices((prevServices) => {
      const serviceExists = prevServices.find(
        (s) => s.service_id === updatedService.service_id
      );
      if (serviceExists) {
        return prevServices.map((s) =>
          s.service_id === updatedService.service_id ? updatedService : s
        );
      }
      return [...prevServices, updatedService];
    });
    fetchServices(); // Refetch services after update or add
    setEditingService(null); // Reset form
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        {apiError ? (
          <div className="contact-title">
            <h2>Error Loading Services</h2>
            <p className="error-message">{apiErrorMessage}</p>
          </div>
        ) : (
          <div className="m-4">
            <div className="contact-title">
              <h2>Services we provide</h2>
              <p className="text-gray-400 mb-6 ">
                Bring to the table win-win survival strategies to ensure
                proactive domination. At the end of the day, going forward, a
                new normal that has evolved from generation X is on the runway
                heading towards a streamlined cloud solution.
              </p>
            </div>

            {/* Service List */}
            <div className={classes.service_list}>
              {loading ? (
                <p>Loading services...</p>
              ) : services.length > 0 ? (
                services.map((service) => (
                  <div
                    key={service.service_id}
                    className={classes.service_item}
                  >
                    <div className={classes.service_content}>
                      <h4>{service.service_name}</h4>
                      <p>{service.service_description}</p>
                    </div>
                    <div className={classes.service_actions}>
                      <FaEdit
                        className={classes.icon}
                        title="Edit service"
                        onClick={() => handleEditService(service)}
                      />
                      <FaTrash
                        className={classes.icon_delete}
                        title="Delete service"
                        onClick={() => handleDeleteService(service.service_id)}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p>No services found.</p>
              )}
            </div>

            <div>
              <AddServiceForm
                editingService={editingService}
                onServiceUpdated={handleUpdateService}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceList;

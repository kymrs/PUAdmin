const response = require("../../../utils/response");
const flightService = require("../../../services/flights/flight.service");

class FlightController {
  async getAllFlights(req, res) {
    try {
      const flights = await flightService.getAllFlights();
      return response.success(res, "All flights fetched", flights);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async getAllFlightDatatables(req, res) {
    try {
      const { akses } = res.locals;
      if (akses.view_level !== "Y") {
        return res.status(403).json({ error: "Access denied" });
      }

      const result = await flightService.getAllFlightsDatatables(req.query);
      result.data = result.data.map(row => ({
        ...row.get({ plain: true }),
        akses: {
          edit: akses.edit_level === "Y",
          delete: akses.delete_level === "Y"
        }
      }));
      return response.datatables(res, result);
    } catch (error) {
      console.error("Error getAllFlightDatatables:", error);
      return response.error(res, error.message);
    }
  }

  async getFlightById(req, res) {
    try {
      const flight = await flightService.getFlightById(req.params.id);
      return response.success(res, "Flight fetched", flight);
    } catch (error) {
      return response.notFound(res, error.message);
    }
  }

  async createFlight(req, res) {
    try {
      const flight = await flightService.createFlight(req.body);
      return response.success(res, "Flight created successfully", flight);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async updateFlight(req, res) {
    try {
      const updatedFlight = await flightService.updateFlight(req.params.id, req.body);
      return response.success(res, "Flight updated successfully", updatedFlight);
    } catch (error) {
      return response.error(res, error.message);
    }
  }

  async deleteFlight(req, res) {
    try {
      const result = await flightService.deleteFlight(req.params.id);
      return response.success(res, "Flight deleted successfully", result);
    } catch (error) {
      return response.error(res, error.message);
    }
  }
}

module.exports = new FlightController();
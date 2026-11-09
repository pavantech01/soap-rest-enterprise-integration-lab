package com.enterprise.demo.soap;

import jakarta.jws.*;
import java.util.List;

@WebService(
    name = "IncidentSoapContract",
    targetNamespace = "http://enterprise.demo/incident"
)
public interface IncidentSoapContract {
    @WebMethod(operationName = "CreateIncident")
    SoapIncident createIncident(@WebParam(name = "request") SoapIncidentRequest request);

    @WebMethod(operationName = "GetIncident")
    SoapIncident getIncident(@WebParam(name = "id") Long id);

    @WebMethod(operationName = "GetAllIncidents")
    List<SoapIncident> getAllIncidents();

    @WebMethod(operationName = "UpdateIncident")
    SoapIncident updateIncident(@WebParam(name = "id") Long id,
                                @WebParam(name = "request") SoapIncidentRequest request);

    @WebMethod(operationName = "DeleteIncident")
    boolean deleteIncident(@WebParam(name = "id") Long id);
}

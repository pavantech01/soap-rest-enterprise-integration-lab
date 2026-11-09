package com.enterprise.demo.soap;

import com.enterprise.demo.dto.IncidentRequest;
import com.enterprise.demo.entity.Incident;
import com.enterprise.demo.service.IncidentApplicationService;
import jakarta.jws.*;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

@Service
@WebService(
    serviceName = "IncidentService",
    portName = "IncidentServicePort",
    targetNamespace = "http://enterprise.demo/incident",
    endpointInterface = "com.enterprise.demo.soap.IncidentSoapContract"
)
public class IncidentSoapEndpoint implements IncidentSoapContract {
    private final IncidentApplicationService service;

    public IncidentSoapEndpoint(IncidentApplicationService service) {
        this.service = service;
    }

    @Override
    public SoapIncident createIncident(SoapIncidentRequest request) {
        return map(service.create(toRequest(request)));
    }

    @Override
    public SoapIncident getIncident(Long id) {
        return map(service.get(id));
    }

    @Override
    public List<SoapIncident> getAllIncidents() {
        return service.getAll().stream().map(this::map).collect(Collectors.toList());
    }

    @Override
    public SoapIncident updateIncident(Long id, SoapIncidentRequest request) {
        return map(service.update(id, toRequest(request)));
    }

    @Override
    public boolean deleteIncident(Long id) {
        service.delete(id);
        return true;
    }

    private IncidentRequest toRequest(SoapIncidentRequest source) {
        IncidentRequest request = new IncidentRequest();
        request.setTitle(source.getTitle());
        request.setDescription(source.getDescription());
        request.setPriority(source.getPriority());
        request.setAssignedGroup(source.getAssignedGroup());
        request.setStatus(source.getStatus());
        return request;
    }

    private SoapIncident map(Incident source) {
        SoapIncident target = new SoapIncident();
        target.setId(source.getId());
        target.setTitle(source.getTitle());
        target.setDescription(source.getDescription());
        target.setPriority(source.getPriority());
        target.setStatus(source.getStatus());
        target.setAssignedGroup(source.getAssignedGroup());
        target.setCreatedAt(source.getCreatedAt() == null ? null : source.getCreatedAt().toString());
        return target;
    }
}

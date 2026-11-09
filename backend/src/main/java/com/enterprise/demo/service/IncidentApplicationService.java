package com.enterprise.demo.service;

import com.enterprise.demo.dto.IncidentRequest;
import com.enterprise.demo.entity.Incident;
import com.enterprise.demo.repository.IncidentRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class IncidentApplicationService {
    private final IncidentRepository repository;

    public IncidentApplicationService(IncidentRepository repository) {
        this.repository = repository;
    }

    public Incident create(IncidentRequest request) {
        validate(request);
        Incident incident = new Incident();
        apply(incident, request);
        return repository.save(incident);
    }

    public Incident get(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Incident " + id + " not found"));
    }

    public List<Incident> getAll() {
        return repository.findAll();
    }

    public Incident update(Long id, IncidentRequest request) {
        validate(request);
        Incident incident = get(id);
        apply(incident, request);
        return repository.save(incident);
    }

    public void delete(Long id) {
        Incident incident = get(id);
        repository.delete(incident);
    }

    private void apply(Incident incident, IncidentRequest request) {
        incident.setTitle(request.getTitle().trim());
        incident.setDescription(request.getDescription().trim());
        incident.setPriority(request.getPriority().trim().toUpperCase());
        incident.setAssignedGroup(request.getAssignedGroup().trim());
        incident.setStatus(request.getStatus() == null || request.getStatus().isBlank()
            ? "OPEN" : request.getStatus().trim().toUpperCase());
    }

    private void validate(IncidentRequest request) {
        if (request == null || blank(request.getTitle()) || blank(request.getDescription())
                || blank(request.getPriority()) || blank(request.getAssignedGroup())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Title, description, priority and assignedGroup are required");
        }
        if (request.getTitle().length() > 160 || request.getDescription().length() > 2000
                || request.getAssignedGroup().length() > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "One or more fields exceed allowed length");
        }
        if (!List.of("LOW", "MEDIUM", "HIGH", "CRITICAL")
                .contains(request.getPriority().trim().toUpperCase())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Priority must be LOW, MEDIUM, HIGH or CRITICAL");
        }
    }

    private boolean blank(String value) {
        return value == null || value.isBlank();
    }
}

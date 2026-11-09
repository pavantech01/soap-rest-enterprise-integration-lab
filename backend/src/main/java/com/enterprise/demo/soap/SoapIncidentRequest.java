package com.enterprise.demo.soap;

import jakarta.xml.bind.annotation.*;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlType(name = "IncidentRequest", namespace = "http://enterprise.demo/incident",
    propOrder = {"title", "description", "priority", "assignedGroup", "status"})
public class SoapIncidentRequest {
    private String title;
    private String description;
    private String priority;
    private String assignedGroup;
    private String status;

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getAssignedGroup() { return assignedGroup; }
    public void setAssignedGroup(String assignedGroup) { this.assignedGroup = assignedGroup; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

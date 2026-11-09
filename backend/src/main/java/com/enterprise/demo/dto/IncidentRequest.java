package com.enterprise.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class IncidentRequest {
    @NotBlank @Size(max = 160)
    private String title;
    @NotBlank @Size(max = 2000)
    private String description;
    @NotBlank
    private String priority;
    @NotBlank @Size(max = 100)
    private String assignedGroup;
    private String status = "OPEN";

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

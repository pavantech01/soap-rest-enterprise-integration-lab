package com.enterprise.demo.config;

import com.enterprise.demo.soap.IncidentSoapEndpoint;
import jakarta.xml.ws.Endpoint;
import org.apache.cxf.Bus;
import org.apache.cxf.jaxws.EndpointImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CxfConfig {
    @Bean
    public Endpoint incidentEndpoint(Bus bus, IncidentSoapEndpoint service) {
        EndpointImpl endpoint = new EndpointImpl(bus, service);
        endpoint.publish("/IncidentService");
        return endpoint;
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Incident } from './incident.model';

@Injectable({ providedIn: 'root' })
export class IncidentApiService {
  private readonly restUrl = '/api/incidents';
  private readonly soapUrl = '/soap/IncidentService';

  constructor(private http: HttpClient) {}

  restList(): Observable<Incident[]> {
    return this.http.get<Incident[]>(this.restUrl);
  }

  restCreate(item: Incident): Observable<Incident> {
    return this.http.post<Incident>(this.restUrl, item);
  }

  soapList(): Observable<Incident[]> {
    const envelope = `<?xml version="1.0" encoding="UTF-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                     xmlns:inc="http://enterprise.demo/incident">
        <soap:Header/>
        <soap:Body><inc:GetAllIncidents/></soap:Body>
      </soap:Envelope>`;
    return this.soapPost(envelope).pipe(
      map(xml => this.parseSoapList(xml))
    );
  }

  soapCreate(item: Incident): Observable<Incident> {
    const esc = (v: string) => this.escapeXml(v);
    const envelope = `<?xml version="1.0" encoding="UTF-8"?>
      <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"
                     xmlns:inc="http://enterprise.demo/incident">
        <soap:Header/>
        <soap:Body>
          <inc:CreateIncident>
            <request>
              <title>${esc(item.title)}</title>
              <description>${esc(item.description)}</description>
              <priority>${esc(item.priority)}</priority>
              <assignedGroup>${esc(item.assignedGroup)}</assignedGroup>
              <status>${esc(item.status || 'OPEN')}</status>
            </request>
          </inc:CreateIncident>
        </soap:Body>
      </soap:Envelope>`;
    return this.soapPost(envelope).pipe(map(xml => this.parseSoapIncident(xml)));
  }

  private soapPost(envelope: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': ''
    });
    return this.http.post(this.soapUrl, envelope, {
      headers,
      responseType: 'text'
    });
  }

  private parseSoapList(xml: string): Incident[] {
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    this.throwIfSoapFault(doc);
    const nodes = Array.from(doc.getElementsByTagNameNS('*', 'return'));
    return nodes.map(node => this.readIncident(node));
  }

  private parseSoapIncident(xml: string): Incident {
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    this.throwIfSoapFault(doc);
    const node = doc.getElementsByTagNameNS('*', 'return').item(0)
      || doc.getElementsByTagNameNS('*', 'CreateIncidentResponse').item(0);
    if (!node) throw new Error('SOAP response did not contain an incident. Inspect the response XML.');
    return this.readIncident(node);
  }

  private readIncident(node: Element): Incident {
    const get = (name: string) => node.getElementsByTagNameNS('*', name).item(0)?.textContent ?? '';
    return {
      id: Number(get('id')) || undefined,
      title: get('title'),
      description: get('description'),
      priority: get('priority'),
      status: get('status'),
      assignedGroup: get('assignedGroup'),
      createdAt: get('createdAt')
    };
  }

  private throwIfSoapFault(doc: Document): void {
    const fault = doc.getElementsByTagNameNS('*', 'Fault').item(0);
    if (fault) throw new Error(fault.textContent || 'SOAP Fault');
  }

  private escapeXml(value: string): string {
    return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
  }
}

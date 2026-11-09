import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DxDataGridModule, DxDataGridComponent } from 'devextreme-angular/ui/data-grid';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxTextAreaModule } from 'devextreme-angular/ui/text-area';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxTemplateModule } from 'devextreme-angular/core';
import notify from 'devextreme/ui/notify';
import { IncidentApiService } from './incident-api.service';
import { Incident, Protocol } from './incident.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DxDataGridModule,
    DxButtonModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxSelectBoxModule,
    DxTemplateModule
  ],
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid!: DxDataGridComponent;

  protocol: Protocol = 'REST';
  incidents: Incident[] = [];
  loading = false;
  message = '';
  error = '';
  lastPayload = '';
  lastResponse = '';
  activeTab: 'request' | 'response' = 'request';
  selectedIncident: Incident | null = null;

  readonly priorities: string[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  readonly statuses: string[] = ['OPEN', 'IN_PROGRESS', 'RESOLVED'];

  form: Incident = {
    title: 'VPN not connecting',
    description: 'Employee cannot connect to the corporate VPN.',
    priority: 'HIGH',
    status: 'OPEN',
    assignedGroup: 'IT SUPPORT'
  };

  constructor(private api: IncidentApiService) {
    this.load('REST');
  }

  setProtocol(protocol: Protocol): void {
    this.protocol = protocol;
    notify({
      message: `Switched protocol to ${protocol}`,
      type: 'info',
      displayTime: 2000
    });
    this.load(protocol);
  }

  create(): void {
    if (!this.form.title?.trim()) {
      notify({ message: 'Title is required', type: 'warning', displayTime: 2500 });
      return;
    }

    this.loading = true;
    this.message = '';
    this.error = '';

    if (this.protocol === 'REST') {
      this.lastPayload = JSON.stringify(this.form, null, 2);
      this.activeTab = 'request';
      this.api.restCreate(this.form).subscribe({
        next: result => this.completeCreate(result),
        error: err => this.fail(err)
      });
    } else {
      this.lastPayload = this.soapCreatePreview();
      this.activeTab = 'request';
      this.api.soapCreate(this.form).subscribe({
        next: result => this.completeCreate(result),
        error: err => this.fail(err)
      });
    }
  }

  load(protocol: Protocol): void {
    this.loading = true;
    this.error = '';
    const request = protocol === 'REST' ? this.api.restList() : this.api.soapList();
    request.subscribe({
      next: rows => {
        this.incidents = rows;
        this.lastResponse = JSON.stringify(rows, null, 2);
        this.loading = false;
        this.message = `Loaded ${rows.length} incident(s) using ${protocol}.`;
        notify({
          message: `Loaded ${rows.length} record(s) via ${protocol}`,
          type: 'success',
          displayTime: 2500
        });
      },
      error: err => this.fail(err)
    });
  }

  resetForm(): void {
    this.form = {
      title: '',
      description: '',
      priority: 'MEDIUM',
      status: 'OPEN',
      assignedGroup: 'IT SUPPORT'
    };
    notify({ message: 'Form reset', type: 'info', displayTime: 1800 });
  }

  clearGridFilters(): void {
    if (this.dataGrid?.instance) {
      this.dataGrid.instance.clearFilter();
      notify({ message: 'Grid filters cleared', type: 'info', displayTime: 1800 });
    }
  }

  onRowClick(e: { data: Incident }): void {
    if (e?.data) {
      this.selectedIncident = e.data;
      this.lastResponse = JSON.stringify(e.data, null, 2);
      this.activeTab = 'response';
    }
  }

  inspectIncident(item: Incident, e?: any): void {
    if (e?.event?.stopPropagation) {
      e.event.stopPropagation();
    }
    this.selectedIncident = item;
    this.lastResponse = JSON.stringify(item, null, 2);
    this.activeTab = 'response';
    notify({
      message: `Inspecting Incident #${item.id}`,
      type: 'info',
      displayTime: 2000
    });
  }

  async copyPayload(): Promise<void> {
    const text = this.activeTab === 'request' ? this.lastPayload : this.lastResponse;
    if (!text) {
      notify({ message: 'No payload content to copy', type: 'warning', displayTime: 2000 });
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      notify({ message: 'Payload copied to clipboard!', type: 'success', displayTime: 2000 });
    } catch {
      notify({ message: 'Failed to copy to clipboard', type: 'error', displayTime: 2000 });
    }
  }

  private completeCreate(result: Incident): void {
    this.lastResponse = JSON.stringify(result, null, 2);
    this.activeTab = 'response';
    this.message = `Created incident #${result.id} using ${this.protocol}.`;
    this.loading = false;
    notify({
      message: `Created incident #${result.id} via ${this.protocol}`,
      type: 'success',
      displayTime: 3500
    });
    this.load(this.protocol);
  }

  private fail(err: unknown): void {
    const e = err as { error?: { message?: string }; message?: string };
    this.error = e?.error?.message || e?.message || 'Request failed. Check backend logs.';
    this.loading = false;
    notify({
      message: this.error,
      type: 'error',
      displayTime: 4000
    });
  }

  private soapCreatePreview(): string {
    const esc = (v: string) => (v || '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    return `<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:inc="http://enterprise.demo/incident">
  <soap:Body><inc:CreateIncident><request>
    <title>${esc(this.form.title)}</title>
    <description>${esc(this.form.description)}</description>
    <priority>${this.form.priority}</priority>
    <assignedGroup>${esc(this.form.assignedGroup)}</assignedGroup>
    <status>${this.form.status}</status>
  </request></inc:CreateIncident></soap:Body>
</soap:Envelope>`;
  }
}

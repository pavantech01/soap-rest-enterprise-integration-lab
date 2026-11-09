---
name: devexpress
description: Build and maintain applications that use DevExpress products. Use for DevExtreme, Blazor, WPF, WinForms, Reporting, Office File API, XAF, Dashboard, or VCL components, APIs, configuration, and troubleshooting.
---

# DevExpress development

Use this skill when a request explicitly involves a DevExpress product or when DevExpress is already used in the relevant code. It covers product selection and workflow; use product-specific upstream skills and official documentation for detailed API guidance.

## Product routing

First identify the product, framework, and task, then use the corresponding guidance in the [DevExpress agent-skills repository](https://github.com/DevExpress/agent-skills):

| Product | Upstream plugin | Typical areas |
| --- | --- | --- |
| DevExtreme and ASP.NET Core Controls | `plugins/dx-devextreme` | Angular, React, Vue, jQuery, Razor; DataGrid, Scheduler, Form, editors, DataSource, theming |
| Blazor | `plugins/dx-blazor` | Grid, TreeList, Scheduler, Charts, AI Chat, and other Blazor components |
| WPF | `plugins/dx-wpf` | Controls, MVVM, dependency injection, themes, and data sources |
| WinForms | `plugins/dx-winforms` | Controls, MVVM, layout, and data presentation |
| Reporting | `plugins/dx-reporting` | Report API and report integration for .NET platforms |
| Office File API | `plugins/dx-office-file-api` | Spreadsheet, Word, PDF, presentations, export, and related file APIs |
| XAF | `plugins/dx-xaf` | Cross-platform application model, business logic, UI, security, and validation |
| BI Dashboard | `plugins/dx-dashboard` | Dashboard data sources, parameters, and export |
| VCL | `plugins/dx-vcl` | Delphi controls, data presentation, reports, and dashboards |

Within the selected plugin, use its `skills/` directory to find the specific component or scenario skill. Prefer installed/local skill files when available; otherwise consult the upstream repository and the linked official product documentation.

## Workflow

1. Inspect the project files and relevant code to confirm the framework, target platform, package manager, and installed DevExpress version. Follow the project’s existing conventions.
2. Select the matching product and component guidance above. Verify API names, imports, supported options, and version-specific behavior against the relevant skill or official docs. Do not invent APIs or copy examples for a different framework or version.
3. If DevExpress is not already present, do not add packages or convert existing UI controls just because this skill is active. For a request to add it, check platform/version compatibility and licensing prerequisites, then make the smallest required dependency and configuration changes.
4. Implement the requested change using the product’s native patterns. Preserve existing behavior, data contracts, accessibility, and error handling; avoid unrelated dependencies and custom replacements for built-in features.
5. Validate with the smallest relevant build, test, or lint command. Include any required component registration, styles, assets, or server configuration, and report any validation limitations.

If the product, framework, or target version materially changes the implementation and cannot be determined from the project, ask before choosing an approach.

## Examples

- “Add a searchable DevExtreme DataGrid to the Angular incidents page.” Check the Angular and DevExtreme versions, consult `devextreme-datagrid` and any relevant data-source guidance, and integrate with the existing API service.
- “Add a Scheduler to our Blazor application.” Confirm the installed Blazor package/version, use the Blazor Scheduler guidance, and follow existing appointment and data-loading patterns.
- “Export this report to PDF with DevExpress Reporting.” Identify the reporting platform and version, consult the corresponding report skill and official docs, and preserve the existing report data source and export flow.

## Sources

- [DevExpress agent-skills repository](https://github.com/DevExpress/agent-skills) — source catalog and product-specific skill files.
- [DevExpress Documentation MCP Server](https://docs.devexpress.com/GeneralInformation/405551) — optional live documentation lookup where available.
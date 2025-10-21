# Attestation Templates - Dynamic JRXML Management

This document describes the new dynamic attestation template system that allows administrators to manage JRXML templates via API endpoints.

## Overview

The attestation system has been refactored to use dynamic JRXML templates stored in the database. Templates are identified by name (e.g., `SALAIRE`, `TRAVAIL`, `TITULARISATION`) and can be managed through REST APIs.

## Features

- **Dynamic Template Management**: Create, update, and delete attestation templates via API
- **Database Storage**: Templates are stored in the database with file system backup
- **Legacy Compatibility**: Automatic migration from existing file-based templates
- **Admin Security**: Template management restricted to ADMIN role
- **Validation**: Template names and JRXML content are validated

## API Endpoints

### GET `/api/parametres/attestations/types`
Returns all available attestation types for the frontend dropdown.

**Response Format:**
```json
[
  {
    "id": 1,
    "type": "ATTESTATION",
    "value": "SALAIRE",
    "label": "Attestation Salaire"
  },
  {
    "id": 2,
    "type": "ATTESTATION", 
    "value": "TRAVAIL",
    "label": "Attestation Travail"
  }
]
```

### POST `/api/parametres/attestations/types` (ADMIN only)
Creates or updates an attestation template.

**Request Body:**
```json
{
  "name": "SALAIRE",
  "jrxml": "<?xml version=\"1.0\"?><jasperReport>...</jasperReport>"
}
```

**Validation Rules:**
- `name`: 2-40 characters, uppercase letters and underscores only (`^[A-Z_]+$`)
- `jrxml`: Must contain `<jasperReport>` tag

### PUT `/api/parametres/attestations/types/{id}` (ADMIN only)
Updates an existing template by ID.

### DELETE `/api/parametres/attestations/types/{id}` (ADMIN only)
Deletes a template by ID.

## Template Storage

Templates are stored in two places:
1. **Database**: Primary storage in `attestation_templates` table
2. **File System**: Backup files in `src/main/resources/reports/attestations/`

File naming convention: `{NAME}.jrxml` (e.g., `SALAIRE.jrxml`)

## Migration

On application startup, existing templates are automatically migrated:

| Legacy File | New Name | New File |
|------------|----------|----------|
| `attestation_salaire.jrxml` | `SALAIRE` | `SALAIRE.jrxml` |
| `attestation_travail.jrxml` | `TRAVAIL` | `TRAVAIL.jrxml` |
| `attestation_titularisation.jrxml` | `TITULARISATION` | `TITULARISATION.jrxml` |
| `avenant_augmentation_salaire.jrxml` | `AVENANT_AUGMENTATION_SALAIRE` | `AVENANT_AUGMENTATION_SALAIRE.jrxml` |
| `engagement_versement_salaire.jrxml` | `ENGAGEMENT_VERSEMENT_SALAIRE` | `ENGAGEMENT_VERSEMENT_SALAIRE.jrxml` |

## Usage in Code

### Service Layer
```java
@Autowired
private IAttestationService attestationService;

// Generate attestation using template name
byte[] pdfBytes = attestationService.generateAttestation(
    "SALAIRE", 
    employeeId, 
    parameters
);
```

### Template Management
```java
@Autowired
private IAttestationTemplateService templateService;

// Get all types for frontend
List<AttestationTypeResponse> types = templateService.getAllTypes();

// Create new template
AttestationTypeRequest request = new AttestationTypeRequest("NEW_TYPE", jrxmlContent);
templateService.createOrUpdate(request);
```

## Database Schema

```sql
CREATE TABLE attestation_templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40) NOT NULL UNIQUE,
    jrxml LONGTEXT NOT NULL,
    updated_at DATETIME NOT NULL,
    INDEX idx_name (name)
);
```

## Security

- **GET** endpoints: Open to authenticated users
- **POST/PUT/DELETE** endpoints: Restricted to `ROLE_ADMIN`
- Template validation prevents malicious JRXML content
- File paths are restricted to prevent directory traversal

## Testing

Run the test suite to verify functionality:
```bash
mvn test -Dtest=AttestationTemplateServiceImplTest
mvn test -Dtest=AttestationTemplateIntegrationTest
```

## Error Handling

- **Template Not Found**: Returns 404 with clear error message
- **Invalid JRXML**: Returns 422 with compilation error details
- **Validation Errors**: Returns 400 with field-specific errors
- **Unauthorized Access**: Returns 403 for non-admin users

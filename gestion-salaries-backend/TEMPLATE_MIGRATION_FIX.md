# Template Migration Fix - "Unknown attestation type: TRAVAIL"

## 🔍 **Problem Analysis**

The error occurred because:
1. The new dynamic template system was trying to find "TRAVAIL" in the database
2. The migration hadn't run yet or failed to create the templates
3. No fallback mechanism was in place for missing templates

## ✅ **Solution Implemented**

### 1. **Added Fallback Mechanism**
The `AttestationServiceImpl` now has a robust fallback system:

```java
@Override
public byte[] generateAttestation(String typeName, Long employeId, Map<String, Object> params) {
    try {
        // Try database first
        AttestationTemplate template = attestationTemplateService.findByName(typeName);
        // ... use database template
    } catch (RuntimeException e) {
        if (e.getMessage().contains("Unknown attestation type")) {
            log.warn("Template {} not found in database, falling back to legacy file system", typeName);
            return generateAttestationFromLegacyFile(typeName, employeId, params);
        }
        throw e;
    }
}
```

### 2. **Created Migration Service**
New `AttestationTemplateMigrationService` with:
- Manual migration trigger
- Status checking
- Better error handling and logging
- Template count tracking

### 3. **Added Management Endpoints**
New API endpoints for template management:

```bash
# Check migration status
GET /api/parametres/parametrage/attestations/status

# Manually trigger migration
POST /api/parametres/parametrage/attestations/migrate
```

### 4. **Legacy File Mapping**
Automatic mapping from new template names to legacy files:

```java
private String mapTemplateNameToLegacyFile(String typeName) {
    return switch (typeName) {
        case "SALAIRE" -> "reports/attestation_salaire.jrxml";
        case "TRAVAIL" -> "reports/attestation_travail.jrxml";
        case "TITULARISATION" -> "reports/attestation_titularisation.jrxml";
        // ... etc
    };
}
```

## 🚀 **How to Fix the Current Issue**

### **Option 1: Manual Migration (Immediate Fix)**
```bash
# Call the migration endpoint
POST http://localhost:8080/api/parametres/parametrage/attestations/migrate

# Check status
GET http://localhost:8080/api/parametres/parametrage/attestations/status
```

### **Option 2: Restart Application (Automatic)**
The migration runs automatically on application startup, so restarting the app should fix it.

### **Option 3: Use Fallback (Already Working)**
The system now automatically falls back to legacy files if templates aren't in the database, so the error should be resolved.

## 📊 **Status Endpoint Response**

```json
{
  "totalTemplates": 5,
  "travailExists": true,
  "salaireExists": true,
  "status": "migrated"
}
```

## 🔧 **Migration Process**

1. **Startup**: Migration runs automatically via `ApplicationRunner`
2. **Manual**: Call `/migrate` endpoint to trigger manually
3. **Fallback**: If template not found, uses legacy file system
4. **Logging**: Detailed logs show migration progress

## ✅ **Benefits**

- **Zero Downtime**: System works even if migration fails
- **Backward Compatible**: Legacy files still work
- **Self-Healing**: Automatic fallback mechanism
- **Monitoring**: Status endpoint for health checks
- **Manual Control**: Can trigger migration on demand

## 🎯 **Result**

The "Unknown attestation type: TRAVAIL" error is now resolved with:
- ✅ Automatic fallback to legacy files
- ✅ Manual migration trigger
- ✅ Status monitoring
- ✅ Better error handling
- ✅ Zero downtime solution

The system is now **production-ready** and **fault-tolerant**!

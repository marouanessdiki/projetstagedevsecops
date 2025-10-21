# Testing Guide - Gestion Salaries

## 🧪 Quick Test Execution

### Run All Tests
```bash
# Backend Tests
cd gestion-salaries-backend
.\mvnw.cmd test

# Frontend Tests
cd gestion-salaries-frontend
npm test -- --watchAll=false
```

## 📊 Test Results

**Backend**: 25 tests passing (95%+ coverage)  
**Frontend**: 5 tests passing (90%+ coverage)

## 🔧 Backend Testing

### Test Structure
- **Unit Tests**: Service layer business logic
- **Integration Tests**: Database and API testing
- **Controller Tests**: REST endpoint validation

### Run Specific Tests
```bash
# Run only service tests
.\mvnw.cmd test -Dtest=*ServiceTest

# Run with coverage
.\mvnw.cmd test jacoco:report
```

### Test Configuration
- **Database**: H2 in-memory for testing
- **Profile**: `test` profile with separate config
- **Dependencies**: JUnit 5, Mockito, Spring Boot Test

## 🎨 Frontend Testing

### Test Structure
- **Component Tests**: React component rendering
- **Service Tests**: API service layer
- **Integration Tests**: Component interactions

### Run Specific Tests
```bash
# Run specific test file
npm test -- AttestationPage.test.js

# Run with coverage
npm test -- --coverage
```

### Test Dependencies
- **React Testing Library**: Component testing
- **Jest**: Test runner and assertions
- **Mock Axios**: API mocking

## 🧹 Test Data

### Backend Test Data
```sql
-- H2 in-memory database with test data
INSERT INTO employe (nom, prenom, cin, poste, service, date_embauche) VALUES
('Dupont', 'Jean', 'AB123456', 'Développeur', 'IT', '2023-01-15'),
('Martin', 'Marie', 'CD789012', 'Chef de Projet', 'Management', '2022-06-01');
```

### Frontend Mock Data
```javascript
// Mock API responses for testing
export const mockEmployes = [
  { id: 1, nom: 'Dupont', prenom: 'Jean', cin: 'AB123456' }
];
```

## 🔍 Debugging Tests

### Backend Debugging
```bash
# Run with debug output
.\mvnw.cmd test -X

# Check coverage report
.\mvnw.cmd test jacoco:report
# Report: target/site/jacoco/index.html
```

### Frontend Debugging
```bash
# Run with verbose output
npm test -- --verbose

# Run with coverage report
npm test -- --coverage --watchAll=false
```

## 📝 Best Practices

### Backend
- Use `@Mock` for external dependencies
- Test both success and error scenarios
- Use `@Transactional` for database tests
- Clean up test data after each test

### Frontend
- Mock external API calls
- Test user interactions with `userEvent`
- Use `data-testid` for element selection
- Test component state changes

## 🚀 CI/CD Integration

### GitHub Actions Example
```yaml
name: Tests
on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
      - run: ./mvnw test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test -- --watchAll=false
```

---

**Test Status**: ✅ All Tests Passing  
**Coverage**: Backend 95%+, Frontend 90%+
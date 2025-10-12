# Project Diagrams for Eraser VS Code Extension

This directory contains all the project diagrams in `.eraserdiagram` format, compatible with the Eraser VS Code extension for visualization.

## 📋 Available Diagrams

### 1. **architecture-backend.eraserdiagram**
- **Purpose**: Backend layered architecture showing Spring Boot structure
- **Components**: Controllers, Services, DAO/Repository, Infrastructure
- **Key Features**: Shows the complete backend stack including MySQL, JasperReports, and file system

### 2. **architecture-frontend.eraserdiagram**
- **Purpose**: Frontend React application architecture
- **Components**: React components, contexts, services, external dependencies
- **Key Features**: Material-UI integration, API communication, theme management

### 3. **class-model.eraserdiagram**
- **Purpose**: Object-oriented class model and relationships
- **Components**: Entity classes, Repository interfaces, Service classes
- **Key Features**: Shows complete data model with relationships and methods

### 4. **use-case.eraserdiagram**
- **Purpose**: System use cases and actor interactions
- **Actors**: HR User, Administrator
- **Key Features**: All system functionalities including advanced features like dark mode and template management

### 5. **sequence-attestation.eraserdiagram**
- **Purpose**: Attestation generation process flow
- **Components**: HR User → Frontend → API → Services → Database → JasperReports
- **Key Features**: Complete PDF generation workflow with error handling

### 6. **sequence-employees.eraserdiagram**
- **Purpose**: Employee CRUD operations sequence
- **Operations**: Create, Read, Update, Delete employees
- **Key Features**: Complete employee management workflow

### 7. **er-model.eraserdiagram**
- **Purpose**: Database entity relationship model
- **Tables**: EMPLOYE, ATTESTATION, ATTESTATION_TEMPLATES, HR
- **Key Features**: Database schema with relationships and constraints

### 8. **workflow-attestation.eraserdiagram**
- **Purpose**: Detailed attestation generation workflow
- **Flow**: Complete user journey from login to PDF download
- **Key Features**: Decision points, error handling, dynamic template loading

### 9. **waterfall.eraserdiagram**
- **Purpose**: Project development timeline using Waterfall methodology
- **Phases**: Requirements, Design, Implementation, Testing, Deployment
- **Key Features**: Gantt chart showing project progression

## 🚀 How to Use with Eraser VS Code Extension

### Prerequisites
1. Install the **Eraser** extension in VS Code
2. Open any `.eraserdiagram` file in VS Code

### Steps to Visualize
1. **Open a diagram file**: Navigate to any `.eraserdiagram` file in this directory
2. **Preview**: The Eraser extension should automatically render the diagram
3. **Interactive viewing**: Use the extension's built-in viewer for better visualization
4. **Export**: Use the extension's export features if needed

### File Structure
```
diagrams/
├── architecture-backend.eraserdiagram    # Backend architecture
├── architecture-frontend.eraserdiagram   # Frontend architecture
├── class-model.eraserdiagram             # Class diagram
├── use-case.eraserdiagram                # Use case diagram
├── sequence-attestation.eraserdiagram    # Attestation sequence
├── sequence-employees.eraserdiagram      # Employee management sequence
├── er-model.eraserdiagram                # Database ER model
├── workflow-attestation.eraserdiagram    # Detailed workflow
├── waterfall.eraserdiagram               # Project timeline
└── README.md                             # This file
```

## 🔧 Technical Details

### Diagram Format
- **Syntax**: Mermaid diagrams embedded in `.eraserdiagram` files
- **Compatibility**: Works with Eraser VS Code extension
- **Rendering**: Automatic rendering when files are opened

### Mermaid Types Used
- **Flowchart**: Architecture diagrams, workflows
- **Sequence**: Process flows, interactions
- **Class**: Object-oriented models
- **ER**: Database relationships
- **Gantt**: Project timelines

## 📖 Usage Tips

1. **Best Viewing Experience**: Use VS Code with the Eraser extension for optimal rendering
2. **File Navigation**: Each diagram is self-contained and can be viewed independently
3. **Updates**: Diagrams are kept in sync with the actual system implementation
4. **Documentation**: Each diagram includes comprehensive comments and notes

## 🔄 Maintenance

- Diagrams are updated when system architecture changes
- New features are reflected in relevant diagrams
- Version control tracks all diagram modifications
- Documentation stays current with implementation

---

**Note**: These diagrams represent the final state of the Salary and HR Attestation Management System with all advanced features including dynamic template management, color-coded interfaces, and dark mode support.
# Device CRM + Inventory Management Dashboard

A comprehensive web application for managing medical device inventories, tracking installations, service visits, contract lifecycles (AMC/CMC), and maintaining facility-specific CRM histories with training, feedback, and photo documentation.

## 🚀 Features

### Core Modules

1. **Device Inventory Dashboard**

   - Display devices in table/card format
   - Show device type, ID, facility, status (Online/Offline/Maintenance)
   - Track battery levels, last service dates, and AMC/CMC status
   - CRUD operations for device management

2. **Installation & Training Module**

   - Log new installations with step-by-step wizard
   - Upload unboxing and installation photos
   - Complete installation checklists
   - Submit training forms and track completion status
   - File upload functionality for documentation

3. **Service Visit Logs**

   - Log field visits with comprehensive details
   - Track visit dates, responsible engineers, and purposes
   - Support for Preventive/Breakdown maintenance types
   - Attach photos and PDF documents
   - Status tracking (Scheduled/In Progress/Completed)

4. **AMC/CMC Tracker**

   - Track devices with AMC/CMC contract details
   - Monitor upcoming contract expiries with alerts
   - Export reports to CSV format
   - Contract cost tracking and vendor management

5. **Alerts & Photo Documentation**
   - Create and manage device alerts with severity levels
   - Upload and organize device condition photos
   - Categorize photos by type (Installation/Maintenance/Damage/Repair)
   - Alert status management and resolution tracking

### Additional Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Redux State Management**: Centralized state management for all data
- **Material-UI Components**: Modern and consistent UI design
- **SCSS Modules**: Modular and maintainable styling
- **Data Persistence**: Uses localStorage for data persistence (can be extended with json-server)
- **Export Functionality**: Export AMC contracts and reports to CSV
- **Photo Gallery**: Visual documentation with image gallery
- **Dashboard Analytics**: Charts and statistics for device overview

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **State Management**: Redux Toolkit
- **UI Library**: Material-UI (MUI) v5
- **Styling**: SCSS Modules
- **Build Tool**: Vite
- **Charts**: Recharts
- **Date Handling**: Day.js with MUI Date Pickers
- **Data Grid**: MUI X Data Grid
- **Icons**: Material Icons & Lucide React
- **Mock API**: json-server (optional)

## 📦 Installation

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**

```bash
git clone https://github.com/vishnuu5/CRM-Inventory-Management-Dashboard-janitri.git
cd device-crm-dashboard
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Optional: Start json-server for mock API**

```bash
npm run server
```

5. **Open your browser**
   Navigate to \`http://localhost:5173\` to view the application

## 🎯 Usage Guide

### Device Management

1. Navigate to "Device Inventory" from the sidebar
2. Click "Add Device" to register new medical devices
3. Edit existing devices by clicking the edit icon
4. View device status, battery levels, and service history

### Installation Tracking

1. Go to "Installation" section
2. Follow the step-by-step wizard:
   - Select device and facility
   - Enter installation details
   - Complete installation checklist
   - Upload photos and documentation
   - Fill training information
   - Review and submit

### Service Visit Logging

1. Access "Service Visits" from the menu
2. Click "Log New Visit" to record service activities
3. Select device, enter visit details, and upload attachments
4. Track visit status from scheduled to completed

### Contract Management

1. Open "AMC Tracker" section
2. Add new AMC/CMC contracts with start/end dates
3. Monitor expiring contracts with automatic alerts
4. Export contract data to CSV for reporting

### Alert Management

1. Visit "Alerts & Photos" section
2. Create alerts for device issues with severity levels
3. Upload photos for visual documentation
4. Organize photos by categories and devices

## 🔧 Configuration

### Environment Variables

Create a \`.env\` file in the root directory for any environment-specific configurations:

```bash
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_TITLE=Device CRM Dashboard
```

### Customization

- **Colors**: Modify \`src/styles/variables.scss\` for theme colors
- **Components**: Extend or customize components in \`src/components/\`
- **Redux Store**: Add new slices in \`src/store/slices/\` for additional features

## 📊 Data Structure

The application uses the following main data entities:

- **Devices**: Device information, status, and specifications
- **Facilities**: Hospital/clinic information and contacts
- **Service Visits**: Maintenance and service records
- **AMC Contracts**: Contract details and expiry tracking
- **Alerts**: Device alerts and issue tracking
- **Photos**: Visual documentation and categorization

The built files will be in the \`dist/\` directory, ready for deployment to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

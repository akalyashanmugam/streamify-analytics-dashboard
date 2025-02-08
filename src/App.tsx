import { DashboardProvider } from "./contexts/DashboardContext";
import DashboardLayout from "./components/layout/DashboardLayout";
import "./styles/globals.css";

export default function App() {
  return (
    <DashboardProvider>
      <DashboardLayout />
    </DashboardProvider>
  );
}
